import React, { useState } from "react";
import { FormGroup, Input, Button } from "reactstrap";
import "../styles/chauffeur-profile.css";

// Pure section component for profile subpage rendering
const DocumentsVerification = () => {
  const [license, setLicense] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicense(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-section">
      <h2>Documents & Verification</h2>
      <div className="section-content">
        <FormGroup>
          <p>
            <strong>Driving License:</strong>{" "}
            {license ? "Uploaded" : "Not Uploaded"}
          </p>
          {license && (
            <img
              src={license}
              alt="Driving License"
              style={{ maxWidth: "200px" }}
            />
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button color="primary" className="mt-2">
            Upload Document
          </Button>
        </FormGroup>
      </div>
    </div>
  );
};

export default DocumentsVerification;
