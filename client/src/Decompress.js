import React, { useState } from "react";
import { Link } from "react-router-dom";
export default function Decompress() {
  const [ipfsLink, setIpfsLink] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerification = async () => {
    try {
      // Set the Pinata Cloud URL with the IPFS hash
      const pinataCloudUrl = `https://gateway.pinata.cloud/ipfs/${ipfsLink}`;
      
      // Redirect the user to the Pinata Cloud URL
      window.location.href = pinataCloudUrl;
      
      // Assuming the verification is successful
      setVerificationResult(true);
    } catch (error) {
      console.error("Error during verification:", error);
      // Handle error as needed
      setVerificationResult(false);
    }
  };

  const handleInputChange = (e) => {
    setIpfsLink(e.target.value);
  };

  return (
    <div>
        
      <div className="banner">
      <nav className="navbar navbar-expand-lg navbar-dark mb-5 mr-5 ">
          <div className="container-fluid my-2">
            <Link className="navbar-brand" to="/">
              <img
                src={require("./assets/logo.png")}
                alt="Bootstrap"
                width="150"
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/upload">
                    Compress
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/decompress">
                    Decompress
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/verify">
                    Verify
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* ... (your navigation bar code) ... */}
        <div className="center-content">
          <div className="container">
            <div className="row-auto">
              <p>Decompress and Download</p>
            </div>
            <div className="row-auto">
              <label htmlFor="inputIpfsLink" className="col-form-label">
                Enter Your IPFS Hash
              </label>
            </div>
            <div className="row-auto">
              <input
                type="text"
                id="inputIpfsLink"
                className="form-control"
                value={ipfsLink}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="row-auto">
              <span id="ipfsLinkHelpInline" className="form-text">
                Must be a valid IPFS Hash.
              </span>
            </div>
            <div className="button">
              <button
                type="button"
                className="button-1"
                style={{ margin: "0 auto" }}
                onClick={handleVerification}
              >
                Download
              </button>
            </div>
            {verificationResult !== null && (
              <div className="verification-result">
                {verificationResult ? "Verification Successful!" : "Verification Failed."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
