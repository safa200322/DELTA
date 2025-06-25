import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Badge,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin-dashboard.css"; // For sidebar and base styles
import "../styles/vehicle-management.css"; // New CSS for Vehicle Management

// Mock Data for Vehicle Management
const MOCK_VEHICLES = [
  {
    id: 1,
    thumbnail: "https://i.imgur.com/a7WJc55.png",
    type: "Tesla",
    model: "Model 3",
    price: "$150/day",
    status: "Available",
    owner: "Steven Wabb",
    actions: ["Approve", "Delete", "Edit"],
  },
  {
    id: 2,
    thumbnail: "https://i.imgur.com/1p6L00L.png",
    type: "Glant",
    model: "Mountain",
    price: "$20/day",
    status: "Available",
    owner: "Claire Adams",
    actions: ["Approve", "Delete", "Edit"],
  },
  {
    id: 3,
    thumbnail: "https://i.imgur.com/R7h2VjM.png",
    type: "Motorcycle",
    model: "Bicycle",
    price: "$100/day",
    status: "Pending Approval",
    owner: "Annette Murphy",
    actions: ["Approve", "Delete", "Edit"],
  },
  {
    id: 4,
    thumbnail: "https://i.imgur.com/zV2X7wP.png",
    type: "Bayliner",
    model: "18-feet",
    price: "$300/day",
    status: "Mainten.",
    owner: "Annette Murphy",
    actions: ["Approve", "Delete", "Edit"],
  },
  {
    id: 5,
    thumbnail: "https://i.imgur.com/R7h2VjM.png",
    type: "Biscot",
    model: "Diet-trim",
    price: "$300/day",
    status: "Mainten",
    owner: "Annette Murphy",
    actions: ["Approve", "Delete", "Edit"],
  },
];

const VehicleManagement = () => {
  const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
  const [dropdownLocationOpen, setDropdownLocationOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [sortOption, setSortOption] = useState("Price (Low to High)");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTypeDropdown = () => setDropdownTypeOpen((prev) => !prev);
  const toggleLocationDropdown = () => setDropdownLocationOpen((prev) => !prev);
  const toggleSortDropdown = () => setSortOpen((prev) => !prev);

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    filterVehicles(type, locationFilter, searchQuery);
  };

  const handleLocationFilter = (location) => {
    setLocationFilter(location);
    filterVehicles(typeFilter, location, searchQuery);
  };

  const handleSort = (option) => {
    setSortOption(option);
    const sortedVehicles = [...vehicles].sort((a, b) => {
      const priceA = parseFloat(a.price.replace("$", "").split("/")[0]);
      const priceB = parseFloat(b.price.replace("$", "").split("/")[0]);
      return option === "Price (Low to High)"
        ? priceA - priceB
        : priceB - priceA;
    });
    setVehicles(sortedVehicles);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterVehicles(typeFilter, locationFilter, query);
  };

  const filterVehicles = (type, location, query) => {
    let filtered = MOCK_VEHICLES;
    if (type !== "All") {
      filtered = filtered.filter(
        (vehicle) => vehicle.type.toLowerCase() === type.toLowerCase()
      );
    }
    if (location !== "All locations") {
      filtered = filtered.filter((vehicle) =>
        vehicle.owner.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (query) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.type.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.owner.toLowerCase().includes(query)
      );
    }
    setVehicles(filtered);
  };

  const handleAddVehicle = () => {
    alert("Add New Vehicle functionality to be implemented");
  };

  // Statistical data
  const stats = [
    { label: "Total Vehicles", value: 126, icon: "🚗", color: "#4e73df" },
    { label: "Available", value: 87, icon: "✅", color: "#34c38f" },
    { label: "Pending Approval", value: 14, icon: "⏳", color: "#f1b44c" },
    { label: "Rented", value: 14, icon: "📅", color: "#ff6f61" },
    { label: "Mainten.", value: 19, icon: "🛠️", color: "#74788d" },
  ];

  return (
    <div className="dashboard-wrapper d-flex">
      {/* Sidebar */}
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
            <Link className="nav-link" to="/admin" end>
              <span className="sidebar-icon">📊</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" to="/vehicle-management">
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

      {/* Main Content Area */}
      <div className="dashboard-main-content flex-grow-1 p-4">
        <div className="vehicle-management-header mb-4">
          <h4 className="vehicle-management-title">
            <span className="title-icon">🚗</span> Vehicle Management
          </h4>
          <Button className="add-vehicle-btn" onClick={handleAddVehicle}>
            Add New Vehicle
          </Button>
        </div>

        {/* Stats Section */}
        <Row className="mb-4">
          {stats.map((stat, index) => (
            <Col xs={12} sm={6} md={4} lg={2} key={index} className="mb-3">
              <Card className="stat-card">
                <CardBody className="text-center p-3">
                  <div
                    className="stat-icon"
                    style={{ backgroundColor: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <h6 className="stat-label mt-2">{stat.label}</h6>
                  <h4 className="stat-value">{stat.value}</h4>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Filters and Search Section */}
        <Card className="dashboard-card filters-card mb-4">
          <CardBody className="p-3 d-flex flex-wrap align-items-center gap-3">
            <div className="search-container">
              <Input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={handleSearch}
                className="vehicle-search-input"
              />
            </div>
            <div className="filter-group">
              <span className="filter-label">Filter by Type</span>
              <Dropdown isOpen={dropdownTypeOpen} toggle={toggleTypeDropdown}>
                <DropdownToggle className="custom-dropdown-toggle">
                  {typeFilter}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleTypeFilter("All")}>
                    All
                  </DropdownItem>
                  <DropdownItem onClick={() => handleTypeFilter("Car")}>
                    Car
                  </DropdownItem>
                  <DropdownItem onClick={() => handleTypeFilter("Bicycle")}>
                    Bicycle
                  </DropdownItem>
                  <DropdownItem onClick={() => handleTypeFilter("Motorcycle")}>
                    Motorcycle
                  </DropdownItem>
                  <DropdownItem onClick={() => handleTypeFilter("Boat")}>
                    Boat
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="filter-group">
              <span className="filter-label">Filter by Location</span>
              <Dropdown
                isOpen={dropdownLocationOpen}
                toggle={toggleLocationDropdown}
              >
                <DropdownToggle className="custom-dropdown-toggle">
                  {locationFilter}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => handleLocationFilter("All locations")}
                  >
                    All locations
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleLocationFilter("Location 1")}
                  >
                    Location 1
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleLocationFilter("Location 2")}
                  >
                    Location 2
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="filter-group ms-auto">
              <span className="filter-label">Sort by</span>
              <Dropdown isOpen={sortOpen} toggle={toggleSortDropdown}>
                <DropdownToggle className="custom-dropdown-toggle">
                  {sortOption}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => handleSort("Price (Low to High)")}
                  >
                    Price (Low to High)
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleSort("Price (High to Low)")}
                  >
                    Price (High to Low)
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>

        {/* Vehicle Table */}
        <Card className="dashboard-card table-card">
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table className="vehicle-table mb-0">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Type</th>
                    <th>Model</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <img
                          src={vehicle.thumbnail}
                          alt="Vehicle"
                          className="vehicle-thumbnail"
                        />
                      </td>
                      <td>{vehicle.type}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.price}</td>
                      <td>
                        <Badge
                          color={
                            vehicle.status === "Available"
                              ? "success"
                              : vehicle.status === "Pending Approval"
                              ? "warning"
                              : "secondary"
                          }
                          className="status-badge"
                        >
                          {vehicle.status}
                        </Badge>
                      </td>
                      <td>{vehicle.owner}</td>
                      <td>
                        {vehicle.actions.map((action, index) => (
                          <Button
                            key={index}
                            color={
                              action === "Approve"
                                ? "success"
                                : action === "Reject"
                                ? "danger"
                                : "secondary"
                            }
                            className={`action-btn ${action.toLowerCase()}-btn`}
                            onClick={() =>
                              alert(`${action} clicked for ${vehicle.model}`)
                            }
                          >
                            {action === "×" ? <span>×</span> : action}
                          </Button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VehicleManagement;

// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Nav,
//   NavItem,
//   Card,
//   CardBody,
//   Button,
//   Badge,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from "reactstrap";
// import "../styles/user-profile.css";

// // Sample vehicle data (replace with actual data from API or state management)
// const vehicles = [
//   {
//     id: 1,
//     brand: "Toyota",
//     model: "Camry",
//     type: "Sedan",
//     thumbnail: "https://i.pravatar.cc/150?img=5", // Replace with actual vehicle image
//     status: "available",
//   },
//   {
//     id: 2,
//     brand: "Honda",
//     model: "CR-V",
//     type: "SUV",
//     thumbnail: "https://i.pravatar.cc/150?img=6",
//     status: "rented",
//   },
//   {
//     id: 3,
//     brand: "Ford",
//     model: "Focus",
//     type: "Compact",
//     thumbnail: "https://i.pravatar.cc/150?img=7",
//     status: "maintenance",
//   },
// ];

// const VehicleManagement = () => {
//   const [dropdownOpen, setDropdownOpen] = useState({});

//   const toggleDropdown = (id) => {
//     setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "available":
//         return <Badge color="success">Available</Badge>;
//       case "rented":
//         return <Badge color="warning">Rented</Badge>;
//       case "maintenance":
//         return <Badge color="danger">Maintenance</Badge>;
//       default:
//         return <Badge color="secondary">Unknown</Badge>;
//     }
//   };

//   return (
//     <div className="vehicle-management">
//       <h5 className="section-title mb-3">
//         <i className="ri-car-line me-2 text-primary"></i>
//         Vehicle Management
//       </h5>
//       <Row>
//         {vehicles.map((vehicle) => (
//           <Col md="6" lg="4" key={vehicle.id} className="mb-4">
//             <Card className="vehicle-card">
//               <img
//                 src={vehicle.thumbnail}
//                 alt={`${vehicle.brand} ${vehicle.model}`}
//                 className="vehicle-thumbnail"
//                 style={{ width: "100%", height: "150px", objectFit: "cover" }}
//               />
//               <CardBody>
//                 <h6 className="vehicle-title">
//                   {vehicle.brand} {vehicle.model}
//                 </h6>
//                 <p className="text-muted mb-2">Type: {vehicle.type}</p>
//                 <p className="mb-2">Status: {getStatusBadge(vehicle.status)}</p>
//                 <div className="vehicle-actions d-flex gap-2">
//                   <Button
//                     color="primary"
//                     size="sm"
//                     onClick={() =>
//                       alert(
//                         `Uploading maintenance for ${vehicle.brand} ${vehicle.model}`
//                       )
//                     }
//                   >
//                     <i className="ri-file-upload-line me-1"></i>
//                     Maintenance
//                   </Button>
//                   <Button
//                     color="info"
//                     size="sm"
//                     onClick={() =>
//                       alert(
//                         `Viewing rental history for ${vehicle.brand} ${vehicle.model}`
//                       )
//                     }
//                   >
//                     <i className="ri-history-line me-1"></i>
//                     History
//                   </Button>
//                   <Dropdown
//                     isOpen={dropdownOpen[vehicle.id] || false}
//                     toggle={() => toggleDropdown(vehicle.id)}
//                   >
//                     <DropdownToggle caret color="danger" size="sm">
//                       <i className="ri-more-fill"></i>
//                     </DropdownToggle>
//                     <DropdownMenu>
//                       <DropdownItem
//                         onClick={() =>
//                           alert(`Removing ${vehicle.brand} ${vehicle.model}`)
//                         }
//                       >
//                         Remove Vehicle
//                       </DropdownItem>
//                       <DropdownItem
//                         onClick={() =>
//                           alert(
//                             `Deactivating ${vehicle.brand} ${vehicle.model}`
//                           )
//                         }
//                       >
//                         Deactivate Vehicle
//                       </DropdownItem>
//                     </DropdownMenu>
//                   </Dropdown>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// const RenteeVehicleManagement = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   return (
//     <section style={{ marginTop: "10px" }}>
//       <Container fluid>
//         <Row>
//           <Col
//             xs="12"
//             md="3"
//             lg="2"
//             className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
//           >
//             <div className="sidebar-header">
//               <h3>Rentee Profile</h3>
//               <i
//                 className="ri-menu-line sidebar-toggle d-md-none"
//                 onClick={toggleSidebar}
//               ></i>
//             </div>
//             <Nav vertical className="sidebar-nav">
//               <NavItem>
//                 <NavLink to="/profile/rentee-profile" className="nav-link">
//                   <i className="ri-user-line"></i> Personal Info
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   to="/profile/rentee-vehicle-management"
//                   className="nav-link"
//                 >
//                   <i className="ri-briefcase-line"></i> Vehicle Management
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   to="/profile/rentee-rental-reservations"
//                   className="nav-link"
//                 >
//                   <i className="ri-calendar-line"></i> Rental reservations
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   to="/profile/rentee-earnings-and-payments"
//                   className="nav-link"
//                 >
//                   <i className="ri-file-text-line"></i> Earnings & Payments
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   to="/profile/rentee-maintenance-and-documents"
//                   className="nav-link"
//                 >
//                   <i className="ri-settings-3-line"></i> Maintenance & Documents
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   to="/profile/rentee-notifications"
//                   className="nav-link"
//                 >
//                   <i className="ri-wallet-line"></i> Notifications
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink to="/profile/rentee-reviews" className="nav-link">
//                   <i className="ri-wallet-line"></i> Reviews
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink to="/profile/rentee-security" className="nav-link">
//                   <i className="ri-wallet-line"></i> Security
//                 </NavLink>
//               </NavItem>
//             </Nav>
//           </Col>

//           <Col xs="12" md="9" lg="10" className="content-area">
//             <Row className="mt-4">
//               <Col lg="12">
//                 <VehicleManagement />
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default RenteeVehicleManagement;
