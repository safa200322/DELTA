import React, { useState, useEffect } from "react";
import { FormGroup, Input, Button, Alert, Spinner } from "reactstrap";
import "../styles/chauffeur-profile.css";

// Pure section component for profile subpage rendering
const DocumentsVerification = () => {
  const [licensePreview, setLicensePreview] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [existingUrl, setExistingUrl] = useState(null);
  const [removing, setRemoving] = useState(false);

  // Fetch existing license file on mount
  useEffect(() => {
    const fetchLicense = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/chauffeurs/me/license",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.ok) {
          const data = await res.json();
          // If the URL is relative, prefix with the backend's public path
          let url = data.fileUrl;
          if (url && !/^https?:\/\//i.test(url)) {
            url = `http://localhost:5000${url}`;
          }
          setExistingUrl(url);
        } else {
          setExistingUrl(null);
        }
      } catch (err) {
        setExistingUrl(null);
      }
    };
    fetchLicense();
  }, [uploadSuccess, removing]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");
    setUploadSuccess(false);
    if (file) {
      setLicensePreview(URL.createObjectURL(file));
      setLicenseFile(file);
    } else {
      setLicensePreview(null);
      setLicenseFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setUploadSuccess(false);
    if (!licenseFile) {
      setError("Please select a file to upload.");
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("license", licenseFile);
      const res = await fetch(
        "http://localhost:5000/api/chauffeurs/me/license",
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to upload document");
      }
      setUploadSuccess(true);
      setError("");
      setLicenseFile(null);
      setLicensePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setError("");
    setRemoving(true);
    try {
      const token = localStorage.getItem("token");
      // Use PUT to set LicenseFileUrl to null (or create a DELETE endpoint if you prefer)
      const res = await fetch("http://localhost:5000/api/chauffeurs/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ LicenseFileUrl: null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to remove document");
      }
      setExistingUrl(null);
      setUploadSuccess(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Documents & Verification</h2>
      <div className="section-content">
        <FormGroup>
          <p>
            <strong>Driving License:</strong>{" "}
            {existingUrl
              ? "Uploaded"
              : uploadSuccess
                ? "Uploaded"
                : "Not Uploaded"}
          </p>
          {existingUrl && (
            <div style={{ marginBottom: 10 }}>
              {existingUrl.match(/\.pdf$/i) ? (
                <a
                  href={existingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              ) : (
                <img
                  src={existingUrl}
                  alt="Driving License"
                  style={{ maxWidth: "200px" }}
                />
              )}
              <Button
                color="danger"
                size="sm"
                className="ms-2"
                onClick={handleRemove}
                disabled={removing}
              >
                {removing ? <Spinner size="sm" /> : "Remove"}
              </Button>
            </div>
          )}
          {licensePreview && (
            <img
              src={licensePreview}
              alt="Preview"
              style={{ maxWidth: "200px", marginBottom: 10 }}
            />
          )}
          <Input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button
            color="primary"
            className="mt-2"
            onClick={handleUpload}
            disabled={uploading || !licenseFile}
          >
            {uploading
              ? <Spinner size="sm" />
              : existingUrl
                ? "Replace Document"
                : "Upload Document"}
          </Button>
          {error && (
            <Alert color="danger" className="mt-2">
              {error}
            </Alert>
          )}
          {uploadSuccess && (
            <Alert color="success" className="mt-2">
              Document uploaded successfully!
            </Alert>
          )}
        </FormGroup>
      </div>
    </div>
  );
};

export default DocumentsVerification;
