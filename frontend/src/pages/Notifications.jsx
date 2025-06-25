import React, { useState } from "react";
import { FaCarSide, FaMoneyBillWave, FaUserTie, FaExclamationCircle, FaCheckCircle, FaTimesCircle, FaToolbox } from "react-icons/fa";

const notifications = [
  {
    id: 1,
    title: "Reservation Created",
    time: "2 min ago",
    icon: <FaCarSide color="#1e88e5" />,
    bgColor: "#e3f2fd",
  },
  {
    id: 2,
    title: "Vehicle Status Updated",
    time: "5 min ago",
    icon: <FaCarSide color="#1565c0" />,
    bgColor: "#e3f2fd",
  },
  {
    id: 3,
    title: "New Reservation Alert",
    time: "10 min ago",
    icon: <FaExclamationCircle color="#ef6c00" />,
    bgColor: "#fff3e0",
  },
  {
    id: 4,
    title: "New Chauffeur Application",
    time: "15 min ago",
    icon: <FaUserTie color="#6a1b9a" />,
    bgColor: "#f3e5f5",
  },
  {
    id: 5,
    title: "Chauffeur Confirmation",
    time: "20 min ago",
    icon: <FaCheckCircle color="#2e7d32" />,
    bgColor: "#e8f5e9",
  },
  {
    id: 6,
    title: "Payment Successful",
    time: "30 min ago",
    icon: <FaMoneyBillWave color="#2e7d32" />,
    bgColor: "#e8f5e9",
  },
  {
    id: 7,
    title: "Payment Failed",
    time: "1 hour ago",
    icon: <FaTimesCircle color="#c62828" />,
    bgColor: "#ffebee",
  },
  {
    id: 8,
    title: "Accessory Created",
    time: "2 hours ago",
    icon: <FaToolbox color="#00695c" />,
    bgColor: "#e0f2f1",
  },
  {
    id: 9,
    title: "Accessory Updated",
    time: "3 hours ago",
    icon: <FaToolbox color="#00897b" />,
    bgColor: "#e0f2f1",
  },
  {
    id: 10,
    title: "Accessory Deleted",
    time: "4 hours ago",
    icon: <FaToolbox color="#d84315" />,
    bgColor: "#fbe9e7",
  },
  {
    id: 11,
    title: "Vehicle Created",
    time: "5 hours ago",
    icon: <FaCarSide color="#0277bd" />,
    bgColor: "#e1f5fe",
  },
  {
    id: 12,
    title: "Vehicle Updated",
    time: "6 hours ago",
    icon: <FaCarSide color="#039be5" />,
    bgColor: "#e1f5fe",
  },
  {
    id: 13,
    title: "Vehicle Deleted",
    time: "7 hours ago",
    icon: <FaCarSide color="#b71c1c" />,
    bgColor: "#ffebee",
  },
];

const Notifications = () => {
  const [selected, setSelected] = useState(null);

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
                backgroundColor: n.bgColor,
                padding: "12px 16px",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "0.3s",
                border: selected?.id === n.id ? "2px solid #007bff" : "1px solid transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ fontSize: "18px" }}>{n.icon}</div>
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
