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

// Chart Data (static, as in your original)
const profitOverviewData = {
  labels: [
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
  ],
  datasets: [
    {
      label: "New Product",
      data: [
        150000, 200000, 180000, 220000, 190000, 250000, 230000, 210000, 240000,
        200000, 220000, 230000,
      ],
      backgroundColor: "#4e73df",
      barPercentage: 0.5,
    },
    {
      label: "Returned Product",
      data: [
        120000, 150000, 140000, 160000, 130000, 180000, 170000, 150000, 170000,
        140000, 160000, 170000,
      ],
      backgroundColor: "#a3b1ff",
      barPercentage: 0.5,
    },
  ],
};

const inventoryOverviewData = {
  labels: ["New Product", "Returned Product", "Sold Product"],
  datasets: [
    {
      data: [42.4, 34.7, 22.8],
      backgroundColor: ["#4e73df", "#f1b44c", "#34c38f"],
      borderWidth: 1,
    },
  ],
};

// Chart Options (same as original)
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

// Helper Components (unchanged)
const SummaryCard = ({ title, value, subValue, percentage, isPositive }) => (
  <Card className="dashboard-card summary-card">
    <CardBody>
      <p className="summary-card-title">{title}</p>
      <h3 className="summary-card-value">{value}</h3>
      <div className="d-flex align-items-center summary-card-footer">
        <span className={`me-2 ${isPositive ? "text-success" : "text-danger"}`}>
          {percentage}
        </span>
        <small className="text-muted">{subValue}</small>
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

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [newAccessory, setNewAccessory] = useState({
    name: "",
    price: "",
    category: "",
  });

  // Fetch Reservations from backend
  useEffect(() => {
    fetch("https://localhost:443/api/admin/")
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((err) => {
        console.error("Failed to fetch reservations:", err);
      });
  }, []);

  // Fetch Payments from backend
  useEffect(() => {
    fetch("https://localhost:443/api/adminpayment/")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
      })
      .catch((err) => {
        console.error("Failed to fetch payments:", err);
      });
  }, []);

  // Fetch Notifications from backend
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
      });
  }, []);

  // Fetch Accessories from backend
  useEffect(() => {
    fetch("/api/accessories")
      .then((res) => res.json())
      .then((data) => {
        setAccessories(data);
      })
      .catch((err) => {
        console.error("Failed to fetch accessories:", err);
      });
  }, []);

  const handleAction = useCallback((setState, id, action) => {
    setState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  }, []);

  const handleRemoveNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleAddAccessory = useCallback(() => {
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
    const accessory = {
      id: Date.now(),
      name: name.trim(),
      price: priceNum,
      category: category.trim(),
    };
    setAccessories((prev) => [...prev, accessory]);
    setNewAccessory({ name: "", price: "", category: "" });
  }, [newAccessory]);

  const handleInputChange = useCallback((field, value) => {
    setNewAccessory((prev) => ({ ...prev, [field]: value }));
  }, []);

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="dashboard-wrapper d-flex">
      <div className="dashboard-sidebar">
        <div className="sidebar-header text-center p-3">
          <img
            src="https://placehold.co/40x40/667fff/ffffff.png?text=L"
            alt="Logo"
            className="mb-2"
          />
        </div>
        <ul className="nav flex-column sidebar-nav">
          <li className="nav-item">
            <Link className="nav-link active" to="/" end>
              <span className="sidebar-icon">📊</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/vehicle-management">
              <span className="sidebar-icon">🚗</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/chauffeur-management">
              <span className="sidebar-icon">👤</span>
            </Link>
          </li>
        </ul>
        <div className="sidebar-footer text-center p-3">
          <img
            src="https://placehold.co/40x40/cccccc/ffffff.png?text=JD"
            alt="Profile"
            className="rounded-circle mb-2"
          />
        </div>
      </div>
      <div className="dashboard-main-content flex-grow-1 p-3">
        <Row className="mb-3 g-2">
          <Col xs={12} sm={6} md={4}>
            <SummaryCard
              title="TOTAL RESERVATIONS"
              value={reservations.length.toString()}
              subValue="2 last month"
              percentage="50%"
              isPositive={true}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <SummaryCard
              title="PENDING PAYMENTS"
              value={payments.filter((p) => p.Status === "pending").length.toString()}
              subValue="4 last month"
              percentage="25%"
              isPositive={false}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <SummaryCard
              title="TOTAL REVENUE"
              value={`$${payments
                .filter((p) => p.Status === "accepted")
                .reduce((acc, cur) => acc + Number(cur.Amount), 0)
                .toFixed(2)}`}
              subValue="$600 last month"
              percentage="25%"
              isPositive={true}
            />
          </Col>
        </Row>
        <Row className="mb-3 g-2">
          <Col xs={12} lg={6}>
            <ChartCard
              title="PROFIT OVERVIEW"
              dropdownOptions={["2022", "2023", "2024"]}
              defaultDropdownValue="2022"
            >
              <Bar
                data={profitOverviewData}
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
              title="INVENTORY OVERVIEW"
              dropdownOptions={["Last 30 Days", "Last 90 Days", "Last Year"]}
              defaultDropdownValue="Last 30 Days"
              chartId="inventory"
            >
              <Doughnut
                data={inventoryOverviewData}
                options={{
                  ...chartOptions,
                  cutout: "70%",
                  plugins: {
                    legend: {
                      display: false,
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
        <Row className="g-2">
          <Col xs={12} lg={6}>
            <Card className="dashboard-card">
              <CardHeader>
                <h5 className="mb-0">PENDING RESERVATIONS</h5>
              </CardHeader>
              <CardBody className="p-0">
                <Table responsive hover className="m-0 p-0">
                  <thead>
                    <tr>
                      <th>Renter Name</th>
                      <th>Vehicle</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.ReservationID}>
                        <td>{reservation.UserID}</td>
                        <td>{reservation.VehicleID}</td>
                        <td>{formatDate(reservation.StartDate)}</td>
                        <td>{formatDate(reservation.EndDate)}</td>
                        <td>{reservation.Status}</td>
                        <td>
                          <Badge
                            color={
                              reservation.status === "pending"
                                ? "warning"
                                : reservation.status === "accepted"
                                ? "success"
                                : "danger"
                            }
                          >
                            {reservation.status}
                          </Badge>
                        </td>
                        <td>
                          {reservation.status === "pending" && (
                            <>
                              <Button
                                color="success"
                                size="sm"
                                onClick={() =>
                                  handleAction(setReservations, reservation.id, "accepted")
                                }
                                className="me-1"
                              >
                                Accept
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleAction(setReservations, reservation.id, "rejected")
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} lg={6}>
            <Card className="dashboard-card">
              <CardHeader>
                <h5 className="mb-0">PAYMENT VERIFICATION</h5>
              </CardHeader>
              <CardBody className="p-0">
                <Table responsive hover className="m-0 p-0">
                  <thead>
                    <tr>
                      <th>Renter Name</th>
                      <th>Vehicle</th>
                      <th>Payment Proof</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.PaymentID}>
                        <td>{payment.renterName}</td>
                        <td>{payment.vehicleName}</td>
                        <td>
                          <img
                            src={payment.paymentProof}
                            alt="Payment Proof"
                            style={{ width: 100 }}
                          />
                        </td>
                        <td>{formatCurrency(payment.Amount)}</td>
                        <td>
                          <Badge
                            color={
                              payment.status === "pending"
                                ? "warning"
                                : payment.status === "accepted"
                                ? "success"
                                : "danger"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td>
                          {payment.status === "pending" && (
                            <>
                              <Button
                                color="success"
                                size="sm"
                                onClick={() =>
                                  handleAction(setPayments, payment.id, "accepted")
                                }
                                className="me-1"
                              >
                                Accept
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleAction(setPayments, payment.id, "rejected")
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="g-2 mt-3">
          <Col xs={12} lg={6}>
            <Card className="dashboard-card">
              <CardHeader>
                <h5 className="mb-0">ACCESSORY MANAGEMENT</h5>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Accessory Name</th>
                      <th>Price</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessories.map((accessory) => (
                      <tr key={accessory.id}>
                        <td>{accessory.name}</td>
                        <td>{formatCurrency(accessory.price)}</td>
                        <td>{accessory.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex flex-column flex-md-row gap-2 mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Accessory Name"
                    value={newAccessory.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
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
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  />
                  <Button color="primary" onClick={handleAddAccessory}>
                    Add Accessory
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
