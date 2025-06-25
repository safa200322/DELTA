import React, { useState, useEffect } from "react";
import {
  FaCarSide,
  FaMoneyBillWave,
  FaUserTie,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaToolbox,
} from "react-icons/fa";

const iconMap = {
  car: <FaCarSide color="#1e88e5" />,
  money: <FaMoneyBillWave color="#2e7d32" />,
  user: <FaUserTie color="#6a1b9a" />,
  alert: <FaExclamationCircle color="#ef6c00" />,
  success: <FaCheckCircle color="#2e7d32" />,
  error: <FaTimesCircle color="#c62828" />,
  tool: <FaToolbox color="#00897b" />,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Fetch notifications from your backend API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", padding: "20px", fontFamily: "Arial" }}>
      <div style={{ width: "25%", paddingRight: "20px" }}>
        <h2>Notifications</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => setSelected(n)}
              style={{
                cursor: "pointer",
                backgroundColor: n.bgColor || "#f5f5f5",
                padding: "12px 16px",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "0.3s",
                border:
                  selected?.id === n.id
                    ? "2px solid #007bff"
                    : "1px solid transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div style={{ fontSize: "18px" }}>
                {iconMap[n.icon] || <FaExclamationCircle />}
              </div>
              <div>
                <strong>{n.title}</strong>
                <div style={{ fontSize: "12px", color: "#555" }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: "#f9feff",
          padding: "20px",
          borderRadius: "6px",
          minHeight: "250px",
          boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)",
        }}
      >
        {selected ? (
          <>
            <h3>{selected.title}</h3>
            <p>
              This is the detailed view for <b>{selected.title}</b>.
            </p>
            <p>
              <i>Timestamp:</i> {selected.time}
            </p>
          </>
        ) : (
          <p>Select a notification to see details.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
