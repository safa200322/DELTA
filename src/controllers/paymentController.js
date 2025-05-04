const db = require("../db");

// Make a payment
exports.makePayment = (req, res) => {
  const { reservationId, amount } = req.body;
  const userId = req.user.id;

  if (!reservationId || !amount) {
    return res.status(400).json({ message: "Reservation ID and amount are required." });
  }

  // Step 1: Insert payment
  const insertQuery = `
    INSERT INTO Payment (ReservationID, Amount, Status)
    VALUES (?, ?, 'Successful')
  `;
  db.query(insertQuery, [reservationId, amount], (err, result) => {
    if (err) return res.status(500).json({ message: "Payment failed", error: err });

    // Step 2: Notify user
    const notifyQuery = `
      INSERT INTO Notification (UserID, Title, Message, Type, Status)
      VALUES (?, 'Payment Successful', 'Your payment was completed successfully.', 'Payment', 'Unread')
    `;
    db.query(notifyQuery, [userId]);

    res.status(201).json({ message: "Payment processed and notification sent." });
  });
};
