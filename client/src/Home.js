import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
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
        <div className="main-content text-center ">
          <h1
            style={{
              fontWeight: 600,
              fontFamily: "'Pixelify sans'",
              color: "#009688",
              fontSize: "4em",
            }}
            className="head"
          >
            Compress / Decompress your data
          </h1>
          <p className="">Choose your preference</p>
          <div className="buttons">
            <Link to="/upload">
              <button type="button" className="button-1">
                Upload
              </button>
            </Link>
            <Link to="/verify">
              <button type="button" className="button-1">
                Verify
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
