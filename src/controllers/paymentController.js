const Notification = require('../models/Notification');

// Simulate successful payment
exports.mockPaymentSuccess = async (req, res) => {
  try {
    const userId = req.user.id;

    // Simulate payment logic here (e.g., save to DB if needed)

    // Send success notification
    await Notification.create({
      title: 'Payment Successful',
      message: 'Your payment was received successfully. Thank you!',
      type: 'Payment',
      userId: userId
    });

    res.status(200).json({ message: 'Mock payment success triggered and notification sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to simulate payment success', error });
  }
};

// Simulate failed payment
exports.mockPaymentFail = async (req, res) => {
  try {
    const userId = req.user.id;

    // Simulate failure logic

    // Send failure notification
    await Notification.create({
      title: 'Payment Failed',
      message: 'Your payment attempt failed. Please try again.',
      type: 'Payment',
      userId: userId
    });

    res.status(200).json({ message: 'Mock payment failure triggered and notification sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to simulate payment failure', error });
  }
};
