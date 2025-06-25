import React, { useState } from "react";
import { Container, Button, Alert } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Import the custom CSS file for this component
import "../styles/chauffeurAdmin.css";
const ChauffeurAdmin = () => {
  // Hardcoded dummy data for chauffeur applications
  const initialApplications = [
    {
      id: 1, // Added a unique ID
      name: "John",
      surname: "Doe",
      carType: "Sedan",
      pickupPlace: "Airport (Dummy)",
      dropoffPlace: "City Center (Dummy)",
      status: "Pending",
      applicationDate: "2025-05-01", // Added dummy date
    },
    {
      id: 2,
      name: "Jane",
      surname: "Smith",
      carType: "SUV",
      pickupPlace: "Hotel A (Dummy)",
      dropoffPlace: "Hotel B (Dummy)",
      status: "Accepted",
      applicationDate: "2025-04-28",
    },
    {
      id: 3,
      name: "Peter",
      surname: "Jones",
      carType: "Van",
      pickupPlace: "Port (Dummy)",
      dropoffPlace: "Residential Area (Dummy)",
      status: "Pending",
      applicationDate: "2025-05-05",
    },
    {
      id: 4,
      name: "Mary",
      surname: "Brown",
      carType: "Luxury",
      pickupPlace: "City Center (Dummy)",
      dropoffPlace: "Airport (Dummy)",
      status: "Rejected",
      applicationDate: "2025-04-20",
    },
    {
      id: 5,
      name: "Chris",
      surname: "Green",
      carType: "Motorcycle",
      pickupPlace: "Train Station (Dummy)",
      dropoffPlace: "Downtown (Dummy)",
      status: "Pending",
      applicationDate: "2025-05-07",
    },
  ];

  // State for applications, message, and message color (same as before)
  const [applications, setApplications] = useState(initialApplications);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("info");

  // Handle Accept (update state only)
  const handleAccept = (id) => {
    const updatedApplications = applications.map((app) => {
      if (app.id === id && (app.status === "Pending" || !app.status)) {
        return { ...app, status: "Accepted" };
      }
      return app;
    });

    const acceptedApp = updatedApplications.find(
      (app) => app.id === id && app.status === "Accepted"
    );
    if (acceptedApp) {
      setApplications(updatedApplications);
      setMessage(
        `Application from ${acceptedApp.name} ${acceptedApp.surname} has been accepted.`
      );
      setMessageColor("success");
    } else {
      setMessage("Application is not pending or not found.");
      setMessageColor("warning");
    }
  };

  // Handle Reject (update state only)
  const handleReject = (id) => {
    const updatedApplications = applications.map((app) => {
      if (app.id === id && (app.status === "Pending" || !app.status)) {
        return { ...app, status: "Rejected" };
      }
      return app;
    });

    const rejectedApp = updatedApplications.find(
      (app) => app.id === id && app.status === "Rejected"
    );
    if (rejectedApp) {
      setApplications(updatedApplications);
      setMessage(
        `Application from ${rejectedApp.name} ${rejectedApp.surname} has been rejected.`
      );
      setMessageColor("danger");
    } else {
      setMessage("Application is not pending or not found.");
      setMessageColor("warning");
    }
  };

  // Helper function to determine status class based on Bootstrap colors
  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "badge bg-success"; // Bootstrap 5+ badge classes
      case "Rejected":
        return "badge bg-danger";
      case "Pending":
      default:
        return "badge bg-warning text-dark"; // Bootstrap 5+ warning text is dark
    }
  };

  return (
    // Using Bootstrap classes for padding and background
    <div className="bg-light py-4">
      {" "}
      {/* Bootstrap light background */}
      {/* Using reactstrap Container */}
      <Container>
        {/* Bootstrap text-center and margin classes */}
        <h3 className="text-center mb-4">
          Chauffeur Applications Admin Panel (Dummy Data)
        </h3>

        {/* Display messages */}
        {message && (
          <Alert color={messageColor} className="mb-4">
            {message}
          </Alert>
        )}

        {applications.length === 0 ? (
          <p className="text-center text-muted">
            No applications submitted yet.
          </p>
        ) : (
          // Custom class for the grid/list container
          <div className="chauffeur-cards-container">
            {/* Map over the applications array to render each card */}
            {applications.map((app) => (
              // Custom class for each card/box
              <div key={app.id} className="chauffeur-card card">
                {" "}
                {/* Added Bootstrap 'card' class */}
                {/* Card Body using Bootstrap class */}
                <div className="card-body">
                  {/* Custom class for details section */}
                  <div className="card-details mb-3">
                    {" "}
                    {/* Bootstrap margin bottom */}
                    <h5 className="card-title">
                      {app.name} {app.surname}
                    </h5>{" "}
                    {/* Bootstrap card title */}
                    <p className="card-text mb-1">
                      <strong>Car Type:</strong> {app.carType}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Pickup:</strong> {app.pickupPlace}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Drop-off:</strong> {app.dropoffPlace}
                    </p>
                    <p className="card-text text-muted small">
                      {" "}
                      {/* Bootstrap text-muted and small classes */}
                      Applied on: {app.applicationDate}
                    </p>
                  </div>

                  {/* Status and Actions */}
                  <div>
                    <div className="d-flex align-items-center mb-3">
                      {" "}
                      {/* Bootstrap flex and align items */}
                      <span className="me-2">Status:</span>{" "}
                      {/* Bootstrap margin-right */}
                      <span className={getStatusClass(app.status)}>
                        {" "}
                        {/* Dynamic status class */}
                        {app.status || "Pending"}
                      </span>
                    </div>

                    {/* Show action buttons only if status is "Pending" */}
                    {app.status !== "Accepted" && app.status !== "Rejected" && (
                      // Bootstrap button group or custom flex for buttons
                      <div className="d-flex justify-content-between">
                        {" "}
                        {/* Bootstrap flex and justify */}
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => handleAccept(app.id)}
                          className="w-50 me-2" // Bootstrap width and margin
                        >
                          Accept
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleReject(app.id)}
                          className="w-50" // Bootstrap width
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {/* Optionally show accepted/rejected text if no actions */}
                    {app.status === "Accepted" && (
                      <p className="text-center text-success font-weight-bold small mt-3">
                        Application Accepted
                      </p>
                    )}
                    {app.status === "Rejected" && (
                      <p className="text-center text-danger font-weight-bold small mt-3">
                        Application Rejected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ChauffeurAdmin;
