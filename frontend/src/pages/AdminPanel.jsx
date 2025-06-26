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

// Mock Data
const MOCK_RESERVATIONS = [
  {
    id: 1,
    user: "Alice",
    vehicle: "Toyota Corolla",
    duration: "3 days",
    status: "pending",
  },
  {
    id: 2,
    user: "Bob",
    vehicle: "Honda Civic",
    duration: "5 days",
    status: "pending",
  },
  {
    id: 3,
    user: "Charlie",
    vehicle: "BMW X3",
    duration: "7 days",
    status: "pending",
  },
];

const MOCK_PAYMENTS = [
  { id: 1, user: "Alice", amount: 150, date: "2025-06-20", status: "pending" },
  { id: 2, user: "Bob", amount: 250, date: "2025-06-18", status: "pending" },
  {
    id: 3,
    user: "Charlie",
    amount: 350,
    date: "2025-06-19",
    status: "pending",
  },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, message: "New reservation made by Alice", type: "info" },
  { id: 2, message: "Payment received from Bob", type: "success" },
  { id: 3, message: "New accessory added", type: "info" },
  { id: 4, message: "Vehicle maintenance scheduled", type: "warning" },
];

const MOCK_ACCESSORIES = [
  { id: 1, name: "GPS Navigation", price: 25, category: "Electronics" },
  { id: 2, name: "Child Safety Seat", price: 15, category: "Safety" },
  { id: 3, name: "Phone Charger", price: 10, category: "Electronics" },
];

// Chart Data
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

// Main Component
const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [accessories, setAccessories] = useState(MOCK_ACCESSORIES);
  const [newAccessory, setNewAccessory] = useState({
    name: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    // Fetch reservations from backend
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/AdmingetReservations/");
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        } else {
          setReservations([]);
        }
      } catch (error) {
        setReservations([]);
      }
    };
    fetchReservations();
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
              value={reservations.length}
              subValue="2 last month"
              percentage="50%"
              isPositive={true}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <SummaryCard
              title="PENDING PAYMENTS"
              value="3"
              subValue="4 last month"
              percentage="25%"
              isPositive={false}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <SummaryCard
              title="TOTAL REVENUE"
              value="$750.00"
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
            <Card className="dashboard-card h-100">
              <CardHeader>
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
                            onClick={() =>
                              handleAction(
                                setReservations,
                                reservation.id,
                                "accepted"
                              )
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            className="btn btn-reject"
                            onClick={() =>
                              handleAction(
                                setReservations,
                                reservation.id,
                                "rejected"
                              )
                            }
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
            <Card className="dashboard-card h-100">
              <CardHeader>
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
                            onClick={() =>
                              handleAction(setPayments, payment.id, "accepted")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            className="btn btn-reject"
                            onClick={() =>
                              handleAction(setPayments, payment.id, "rejected")
                            }
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
            <Card className="dashboard-card h-100">
              <CardHeader>
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessories.map((accessory) => (
                      <tr key={accessory.id}>
                        <td>{accessory.name}</td>
                        <td>{formatCurrency(accessory.price)}</td>
                        <td>{accessory.category}</td>
                        <td>
                          <Button
                            className="btn btn-remove"
                            onClick={() =>
                              setAccessories((prev) =>
                                prev.filter((item) => item.id !== accessory.id)
                              )
                            }
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
