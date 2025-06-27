import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Chart Data (dynamic, based on payments)
const getMonthlyRevenueData = (payments) => {
  // Group accepted payments by month
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyTotals = Array(12).fill(0);
  payments.forEach((p) => {
    if (p.status === "accepted") {
      const date = new Date(p.date);
      const month = date.getMonth();
      monthlyTotals[month] += p.amount;
    }
  });
  return {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: monthlyTotals,
        backgroundColor: "#4e73df",
        barPercentage: 0.5,
      },
    ],
  };
};

// Chart data for inventory overview (real data)
const inventoryOverviewData = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ["#4e73df", "#f1b44c", "#34c38f", "#e74c3c", "#8e44ad", "#16a085"],
      borderWidth: 1,
    },
  ],
};

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { display: false },
      grid: { display: false },
    },
    x: {
      ticks: { display: true },
      grid: { display: false },
    },
  },
};

// Helper Components
const SummaryCard = ({ title, value, subValue, percentage, isPositive }) => (
  <Card
    className="dashboard-card summary-card shadow-lg border-0"
    style={{
      background: "linear-gradient(120deg, #256489 0%, #3b8dbd 100%)",
      color: "#fff",
      borderRadius: 18,
      minHeight: 140,
      boxShadow: "0 4px 24px 0 #25648933, 0 1.5px 4px #0001",
      border: "none",
      marginBottom: 0,
    }}
  >
    <CardBody>
      <p className="summary-card-title" style={{ color: "#e0e6ed", fontWeight: 600, letterSpacing: 1 }}>{title}</p>
      <h3 className="summary-card-value" style={{ color: "#fff", fontWeight: 700, fontSize: 32 }}>{value}</h3>
      <div className="d-flex align-items-center summary-card-footer mt-2">
        <span className={`me-2 ${isPositive ? "text-success" : "text-danger"}`} style={{ fontWeight: 600 }}>
          {percentage}
        </span>
        <small className="text-light" style={{ opacity: 0.85 }}>{subValue}</small>
      </div>
    </CardBody>
  </Card>
);

const ChartCard = ({
  title,
  children,
  dropdownOptions,
  defaultDropdownValue,
  chartId,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Card className="dashboard-card h-100 w-100">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        {dropdownOptions && (
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle
              caret
              size="sm"
              color="light"
              className="chart-dropdown-toggle"
            >
              {defaultDropdownValue}
            </DropdownToggle>
            <DropdownMenu>
              {dropdownOptions.map((option, index) => (
                <DropdownItem key={index}>{option}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>
      <CardBody className="d-flex flex-column justify-content-center align-items-center p-0">
        <div
          style={{
            position: "relative",
            height: chartId === "inventory" ? "250px" : "200px",
            width: "100%",
          }}
        >
          {children}
        </div>
      </CardBody>
    </Card>
  );
};

const NotificationCard = ({ notifications, handleRemoveNotification }) => (
  <Card className="dashboard-card h-100 w-100">
    <CardHeader>
      <h5 className="mb-0">NOTIFICATIONS</h5>
    </CardHeader>
    <CardBody className="notification-list p-0">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`notification-item d-flex align-items-center p-3 ${notif.type}`}
        >
          <span className="notification-message">{notif.message}</span>
          <Button
            className="btn btn-dismiss ms-auto"
            onClick={() => handleRemoveNotification(notif.id)}
          >
            Dismiss
          </Button>
        </div>
      ))}
      <div className="text-center p-3 pt-2">
        <Link to="/notifications" className="text-primary text-decoration-none">
          SEE ALL →
        </Link>
      </div>
    </CardBody>
  </Card>
);

// Main Component
const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [vehicleInventory, setVehicleInventory] = useState({ total: 0, distribution: [] });
  const [newAccessory, setNewAccessory] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch all admin dashboard data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('[ADMIN DASHBOARD] Fetching: /api/admin/reservations');
        console.log('[ADMIN DASHBOARD] Fetching: /api/admin/payments');
        console.log('[ADMIN DASHBOARD] Fetching: /api/admin/notifications');
        console.log('[ADMIN DASHBOARD] Fetching: /api/admin/accessories');
        console.log('[ADMIN DASHBOARD] Fetching: /api/admin/inventory-distribution');
        // Get token from localStorage
        const token = localStorage.getItem('token');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
        const fetchWithAuth = (url, options = {}) =>
          fetch(url, {
            ...options,
            headers: {
              ...(options.headers || {}),
              ...authHeader,
            },
            credentials: 'include',
          });
        const [resvRes, payRes, notifRes, accRes, inventoryRes] = await Promise.all([
          fetchWithAuth("http://localhost:5000/api/admin/reservations").then(async (r) => { const data = await r.json(); console.log('[ADMIN DASHBOARD] http://localhost:5000/api/admin/reservations response:', data); return data; }),
          fetchWithAuth("http://localhost:5000/api/admin/payments").then(async (r) => { const data = await r.json(); console.log('[ADMIN DASHBOARD] http://localhost:5000/api/admin/payments response:', data); return data; }),
          fetchWithAuth("http://localhost:5000/api/admin/notifications").then(async (r) => { const data = await r.json(); console.log('[ADMIN DASHBOARD] http://localhost:5000/api/admin/notifications response:', data); return data; }),
          fetchWithAuth("http://localhost:5000/api/admin/accessories").then(async (r) => { const data = await r.json(); console.log('[ADMIN DASHBOARD] http://localhost:5000/api/admin/accessories response:', data); return data; }),
          fetchWithAuth("http://localhost:5000/api/admin/inventory-distribution").then(async (r) => { const data = await r.json(); console.log('[ADMIN DASHBOARD] /api/admin/inventory-distribution response:', data); return data; }),
        ]);
        // Defensive: ensure arrays
        setReservations(Array.isArray(resvRes) ? resvRes : []);
        setPayments(Array.isArray(payRes) ? payRes : []);
        setNotifications(Array.isArray(notifRes) ? notifRes : []);
        setAccessories(Array.isArray(accRes) ? accRes : []);
        setVehicleInventory(inventoryRes || { total: 0, distribution: [] });
      } catch (err) {
        // Enhanced error handling
        let errorMsg = '[ADMIN DASHBOARD] Fetch error:';
        if (err instanceof SyntaxError) {
          errorMsg += ' Invalid JSON returned from backend.';
        } else if (err instanceof TypeError) {
          errorMsg += ' Network error or resource not found.';
        } else {
          errorMsg += ' ' + (err.message || err);
        }
        console.error(errorMsg, err);
        setReservations([]);
        setPayments([]);
        setNotifications([]);
        setAccessories([]);
        setVehicleInventory({ total: 0, distribution: [] });
        // Optionally, show a user-friendly error message (e.g., setError(errorMsg))
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Accept/reject reservation
  const handleReservationAction = useCallback(async (id, action) => {
    try {
      await fetch(`/api/admin/reservations/${id}/${action}`, { method: "POST" });
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: action } : item))
      );
    } catch (err) {
      alert("Failed to update reservation status");
    }
  }, []);

  // Accept/reject payment
  const handlePaymentAction = useCallback(async (id, action) => {
    try {
      await fetch(`/api/admin/payments/${id}/${action}`, { method: "POST" });
      setPayments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: action } : item))
      );
    } catch (err) {
      alert("Failed to update payment status");
    }
  }, []);

  // Remove notification
  const handleRemoveNotification = useCallback(async (id) => {
    try {
      await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to remove notification");
    }
  }, []);

  // Add accessory
  const handleAddAccessory = useCallback(async () => {
    const { name, price, category } = newAccessory;
    if (!name.trim() || !price || !category.trim()) {
      alert("Please fill in all fields");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch("http://localhost:5000/api/admin/accessories", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        credentials: 'include',
        body: JSON.stringify({
          AccessoryName: name.trim(),
          VehicleType: category.trim(),
          Quantity: 1, // Default to 1 for now
          Price: priceNum,
        }),
      });
      const result = await res.json();
      // Fetch the new accessory from the DB to get all fields
      if (result.accessoryId) {
        const accRes = await fetch("http://localhost:5000/api/admin/accessories", {
          headers: { ...authHeader },
          credentials: 'include',
        });
        const allAccessories = await accRes.json();
        const newAcc = allAccessories.find(a => a.AccessoryID === result.accessoryId);
        setAccessories((prev) => [...prev, newAcc || {
          id: result.accessoryId,
          name: name.trim(),
          price: priceNum,
          category: category.trim(),
        }]);
      }
      setNewAccessory({ name: "", price: "", category: "" });
    } catch (err) {
      alert("Failed to add accessory");
    }
  }, [newAccessory]);

  // Remove accessory
  const handleRemoveAccessory = useCallback(async (id) => {
    try {
      await fetch(`/api/admin/accessories/${id}`, { method: "DELETE" });
      setAccessories((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to remove accessory");
    }
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setNewAccessory((prev) => ({ ...prev, [field]: value }));
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    return `$${amount.toFixed(2)}`;
  };
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="dashboard-wrapper d-flex" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%)' }}>
      <div className="dashboard-sidebar d-flex flex-column align-items-center justify-content-center" style={{ minWidth: 90, background: '#085078', color: '#fff', minHeight: '100vh', boxShadow: '2px 0 12px #0001' }}>
        <div className="sidebar-header text-center p-3">
          <img
            src="https://placehold.co/40x40/667fff/ffffff.png?text=L"
            alt="Logo"
            className="mb-2"
            style={{ borderRadius: 12, background: '#fff' }}
          />
        </div>
        <ul className="nav flex-column sidebar-nav" style={{ gap: '18px', marginTop: '32px', width: '100%' }}>
          <li className="nav-item">
            <Link className="nav-link active d-flex justify-content-center align-items-center" to="/admin" end style={{ height: 56 }}>
              <span className="sidebar-icon" style={{ fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                📊
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link d-flex justify-content-center align-items-center" to="/admin/reservations-dashboard" style={{ height: 56 }}>
              <span className="sidebar-icon" style={{ fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                📅
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/payments-dashboard" className="nav-link d-flex justify-content-center align-items-center" style={{ height: 56 }}>
              <span className="sidebar-icon" style={{ fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                💰
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/notifications-dashboard" className="nav-link d-flex justify-content-center align-items-center" style={{ height: 56 }}>
              <span className="sidebar-icon" style={{ fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                🔔
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/accessories" className="nav-link d-flex justify-content-center align-items-center" style={{ height: 56 }}>
              <span className="sidebar-icon" style={{ fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                🛠️
              </span>
            </Link>
          </li>
        </ul>
        <div className="sidebar-footer text-center p-3 mt-auto">
          <img
            src="https://placehold.co/40x40/cccccc/ffffff.png?text=JD"
            alt="Profile"
            className="rounded-circle mb-2"
            style={{ border: '2px solid #fff', background: '#eee' }}
          />
        </div>
      </div>
      <div className="dashboard-main-content flex-grow-1 d-flex flex-column align-items-center p-4" style={{ minHeight: '100vh' }}>
        {/* Top summary cards row */}
        <Row className="mb-4 w-100 justify-content-center" style={{ gap: 24 }}>
          <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
            <SummaryCard
              title="TOTAL RESERVATIONS"
              value={reservations.length}
              subValue={`${reservations.filter(r => r.status === 'accepted').length} accepted`}
              percentage={reservations.length ? `${Math.round((reservations.filter(r => r.status === 'accepted').length / reservations.length) * 100)}%` : "-"}
              isPositive={reservations.filter(r => r.status === 'accepted').length >= reservations.length}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
            <SummaryCard
              title="PENDING PAYMENTS"
              value={payments.filter(p => p.status === 'pending').length}
              subValue={`${payments.filter(p => p.status === 'accepted').length} processed`}
              percentage={payments.length ? `${Math.round((payments.filter(p => p.status === 'pending').length / payments.length) * 100)}%` : "-"}
              isPositive={payments.filter(p => p.status === 'pending').length >= payments.length}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
            <SummaryCard
              title="TOTAL REVENUE"
              value={`$${payments.reduce((total, payment) => total + (payment.status === 'accepted' ? payment.amount : 0), 0).toFixed(2)}`}
              subValue={`$${payments.filter(p => p.status === 'accepted').reduce((total, payment) => total + payment.amount, 0).toFixed(2)} processed`}
              percentage={payments.length ? `${Math.round((payments.filter(p => p.status === 'accepted').length / payments.length) * 100)}%` : "-"}
              isPositive={payments.filter(p => p.status === 'accepted').length >= payments.length}
            />
          </Col>
        </Row>
        {/* Charts and notifications row */}
        <Row className="mb-4 w-100 justify-content-center" style={{ gap: 24 }}>
          <Col xs={12} lg={6} className="mb-3 mb-lg-0">
            <ChartCard
              title="PROFIT OVERVIEW"
              dropdownOptions={["2022", "2023", "2024"]}
              defaultDropdownValue="2024"
            >
              <Bar
                data={getMonthlyRevenueData(payments)}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        display: true,
                        callback: (value) => `$${value / 1000}k`,
                      },
                      grid: { color: "#e0e0e0" },
                    },
                    x: {
                      ticks: { display: true },
                      grid: { display: false },
                    },
                  },
                }}
              />
            </ChartCard>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <ChartCard
              title="Vehicle Distribution"
              dropdownOptions={["Last 30 Days", "Last 90 Days", "Last Year"]}
              defaultDropdownValue="Last 30 Days"
              chartId="inventory"
            >
              <Doughnut
                data={{
                  labels: vehicleInventory.distribution.map(d => d.type),
                  datasets: [
                    {
                      data: vehicleInventory.distribution.map(d => d.count),
                      backgroundColor: ["#4e73df", "#f1b44c", "#34c38f", "#e74c3c", "#8e44ad", "#16a085"],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  ...chartOptions,
                  cutout: "70%",
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        color: '#333',
                        font: { size: 14 },
                        padding: 20,
                      },
                    },
                  },
                }}
              />
            </ChartCard>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <NotificationCard
              notifications={notifications}
              handleRemoveNotification={handleRemoveNotification}
            />
          </Col>
        </Row>
        {/* Management tables row */}
        <Row className="g-4 w-100 justify-content-center">
          <Col xs={12} lg={6}>
            <Card className="dashboard-card h-100 shadow-sm rounded-4">
              <CardHeader style={{ background: '#f7fafc', borderBottom: '1px solid #e0e0e0', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <h5 className="mb-0">RESERVATION MANAGEMENT</h5>
              </CardHeader>
              <CardBody className="p-0">
                <Table hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Vehicle</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>{reservation.user}</td>
                        <td>{reservation.vehicle}</td>
                        <td>{reservation.duration}</td>
                        <td>
                          <Badge
                            color={
                              reservation.status === "accepted"
                                ? "success"
                                : reservation.status === "rejected"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {reservation.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            className="btn btn-accept me-2"
                            onClick={() => handleReservationAction(reservation.id, "accepted")}
                          >
                            Accept
                          </Button>
                          <Button
                            className="btn btn-reject"
                            onClick={() => handleReservationAction(reservation.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} lg={6}>
            <Card className="dashboard-card h-100 shadow-sm rounded-4">
              <CardHeader style={{ background: '#f7fafc', borderBottom: '1px solid #e0e0e0', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <h5 className="mb-0">PAYMENT MANAGEMENT</h5>
              </CardHeader>
              <CardBody className="p-0">
                <Table hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.user}</td>
                        <td>{formatCurrency(payment.amount)}</td>
                        <td>{formatDate(payment.date)}</td>
                        <td>
                          <Badge
                            color={
                              payment.status === "accepted"
                                ? "success"
                                : payment.status === "rejected"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            className="btn btn-accept me-2"
                            onClick={() => handlePaymentAction(payment.id, "accepted")}
                          >
                            Accept
                          </Button>
                          <Button
                            className="btn btn-reject"
                            onClick={() => handlePaymentAction(payment.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} lg={6}>
            <Card className="dashboard-card h-100 shadow-sm rounded-4">
              <CardHeader style={{ background: '#f7fafc', borderBottom: '1px solid #e0e0e0', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <h5 className="mb-0">ACCESSORIES MANAGEMENT</h5>
              </CardHeader>
              <CardBody>
                <div
                  className="form-grid d-grid gap-2 mb-3"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Accessory Name"
                    value={newAccessory.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={newAccessory.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Category"
                    value={newAccessory.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                  />
                  <Button
                    className="btn btn-primary"
                    onClick={handleAddAccessory}
                  >
                    Add Accessory
                  </Button>
                </div>
                <Table hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessories.map((accessory) => (
                      <tr key={accessory.AccessoryID}>
                        <td>{accessory.AccessoryName}</td>
                        <td>{formatCurrency(accessory.Price)}</td>
                        <td>{accessory.VehicleType}</td>
                        <td>{accessory.Quantity}</td>
                        <td>
                          <Button
                            className="btn btn-remove"
                            onClick={() => handleRemoveAccessory(accessory.AccessoryID)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
