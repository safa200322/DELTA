import React, { useEffect, useState } from "react";
import {
  FaCarSide,
  FaMoneyBillWave,
  FaUserTie,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaToolbox,
  FaBell,
} from "react-icons/fa";

const iconMap = {
  reservation: <FaCarSide color="#1e88e5" />,
  vehicle: <FaCarSide color="#1565c0" />,
  alert: <FaExclamationCircle color="#ef6c00" />,
  chauffeur: <FaUserTie color="#6a1b9a" />,
  confirm: <FaCheckCircle color="#2e7d32" />,
  payment: <FaMoneyBillWave color="#2e7d32" />,
  fail: <FaTimesCircle color="#c62828" />,
  accessory: <FaToolbox color="#00695c" />,
  default: <FaBell color="#1976d2" />,
};

function getIcon(type) {
  if (!type) return iconMap.default;
  if (type.includes("reservation")) return iconMap.reservation;
  if (type.includes("vehicle")) return iconMap.vehicle;
  if (type.includes("alert")) return iconMap.alert;
  if (type.includes("chauffeur")) return iconMap.chauffeur;
  if (type.includes("confirm")) return iconMap.confirm;
  if (type.includes("payment")) return iconMap.payment;
  if (type.includes("fail")) return iconMap.fail;
  if (type.includes("accessory")) return iconMap.accessory;
  return iconMap.default;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/notifications/my", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unknown error");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Format timestamp
  function formatTime(ts) {
    if (!ts) return "";
    const date = new Date(ts);
    if (isNaN(date.getTime())) return ts;
    return date.toLocaleString();
  }

  // UI
  return (
    <div style={{ display: "flex", padding: 24, fontFamily: "Arial, sans-serif", minHeight: 400 }}>
      <div style={{ width: "28%", paddingRight: 24 }}>
        <h2 style={{ marginBottom: 18 }}>Notifications</h2>
        {loading ? (
          <div style={{ color: "#888", padding: 24 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: "#c62828", padding: 24 }}>Error: {error}</div>
        ) : notifications.length === 0 ? (
          <div style={{ color: "#888", padding: 24 }}>No notifications found.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notifications.map((n) => (
              <div
                key={n.NotificationID || n.id}
                onClick={() => setSelected(n)}
                style={{
                  cursor: "pointer",
                  backgroundColor: selected?.NotificationID === n.NotificationID ? "#e3f2fd" : "#f7fafd",
                  padding: "14px 18px",
                  borderRadius: 10,
                  boxShadow: selected?.NotificationID === n.NotificationID ? "0 2px 8px #1976d222" : "0 1px 2px #0001",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  border: selected?.NotificationID === n.NotificationID ? "2px solid #1976d2" : "1px solid #e0e0e0",
                  transition: "0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div style={{ fontSize: 22 }}>{getIcon(n.type || n.Type || n.title || "")}</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 15 }}>{n.title || n.Title || n.type || n.Type || "Notification"}</strong>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 2, whiteSpace: "pre-line" }}>{n.message || n.Message || n.body || n.Body || ""}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{formatTime(n.createdAt || n.timestamp || n.Time || n.date)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: "#f9feff",
          padding: 28,
          borderRadius: 10,
          minHeight: 250,
          boxShadow: "inset 0 0 8px #1976d208",
          marginLeft: 8,
        }}
      >
        {selected ? (
          <>
            <h3 style={{ marginBottom: 10 }}>{selected.title || selected.Title || selected.type || selected.Type || "Notification"}</h3>
            <p style={{ fontSize: 15, color: "#444" }}>{selected.message || selected.Message || selected.body || selected.Body || "No details available."}</p>
            <p style={{ fontSize: 13, color: "#888" }}>
              <i>Timestamp:</i> {formatTime(selected.createdAt || selected.timestamp || selected.Time || selected.date)}
            </p>
          </>
        ) : loading ? null : (
          <p style={{ color: "#888" }}>Select a notification to see details.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
