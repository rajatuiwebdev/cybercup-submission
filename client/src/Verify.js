import React, { useState } from "react";
import { redirect } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Verify() {
  const [hash, setHash] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleVerification = () => {
    const txnHash = encodeURIComponent(hash);
    const redirectUrl = `https://goerli.arbiscan.io/tx/${txnHash}`;
    window.location.href = redirectUrl;
  };

  const handleInputChange = (e) => {
    setHash(e.target.value);
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
        <div className="center-content">
          <div className="container">
            <div className="row-auto">
              <p>Verification Page</p>
            </div>
            <div className="row-auto">
        <label htmlFor="inputPassword6" className="col-form-label">
          Enter Your Transaction Hash
        </label>
      </div>
      <div className="row-auto">
        <input
          type="password"
          id="inputPassword6"
          className="form-control"
          aria-describedby="passwordHelpInline"
          value={hash}
          onChange={handleInputChange}
          required
        />
      </div>
            <div className="row-auto">
              <span id="passwordHelpInline" className="form-text">
                Must be a valid Hash.
              </span>
            </div>
            <div className="button">
      <button
        type="button"
        className="button-1"
        style={{ margin: "0 auto" }}
        onClick={handleVerification}
      >
        Verify
      </button>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
}
