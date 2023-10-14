import React, { useState } from "react";
import { connectWallet, connectMetaMask } from "./connectWallet";
import { uploadToIPFS } from "./ipfsUploader";
import "./App.css";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";

function TokenizeFile() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [fileStatus, setFileStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [ipfsLink, setIpfsLink] = useState("");

  const handleConnectMetaMask = async () => {
    const { address, formattedBalance } = await connectMetaMask();
    setWalletAddress(address);
    setWalletBalance(formattedBalance);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileStatus("File selected for upload");
  };

  const Tokenize = async () => {
    setStatus("Uploading to IPFS...");
    setLoading(true);

    try {
      // Upload the original file to IPFS
      const ipfsHashOriginal = await uploadToIPFS(file);

      // Set the IPFS link for the original file
      const ipfsLinkOriginal = `https://gateway.pinata.cloud/ipfs/${ipfsHashOriginal}`;

      // Send the file to the server for compression
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:5000/compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const compressedFile = await response.blob();

      const ipfsHashCompressed = await uploadToIPFS(compressedFile);

      const ipfsLinkCompressed = `https://gateway.pinata.cloud/ipfs/${ipfsHashCompressed}`;
      setIpfsLink(ipfsLinkCompressed);
      setStatus("Tokenizing File...");
      const { signer, contract } = await connectWallet();

      const tokenURI = `data:application/json;base64,${btoa(
        JSON.stringify({
          name,
          description,
          fileOriginal: ipfsLinkOriginal,
          fileCompressed: ipfsLinkCompressed,
        })
      )}`;

      const transaction = await contract.mintNFT(signer.getAddress(), tokenURI);
      await transaction.wait();
      setTransactionHistory((prevHistory) => [
        ...prevHistory,
        transaction.hash,
      ]);

      setStatus("File Tokenized!");
      setAlertOpen(true);
      setLoading(false);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <>
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
      <Container maxWidth="lg" className="center-container">
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            CyberCup Compressifier Uploader
          </Typography>
        </Box>
        <Grid>
          <Grid item xs={12} md={6}>
            <Box mt={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleConnectMetaMask}
                size="small"
                disabled={Boolean(walletAddress)}              >
                {walletAddress ? "Wallet Connected" : "Connect Wallet"}
              </Button>
            </Box>
            {walletAddress && (
              <Box mt={2}>
                <Typography align="center">
                  Wallet Address: {walletAddress}
                </Typography>
                <Typography align="center">
                  Wallet Balance: {walletBalance}
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              label="File Name"
              variant="outlined"
              margin="normal"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="File Description"
              variant="outlined"
              margin="normal"
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="file"
              style={{ display: "none" }}
              id="image-upload"
              onChange={handleFileChange}
            />
            <p></p>
            <label htmlFor="image-upload">
              <Button variant="contained" color="primary" component="span">
                Upload File
              </Button>
            </label>
            {fileStatus && (
              <Typography variant="caption" display="block" gutterBottom>
                {fileStatus}
              </Typography>
            )}
            <Box mt={2}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={Tokenize}
              >
                Tokenize File
              </Button>
            </Box>
            {loading && <LinearProgress />}

            <Snackbar
              open={alertOpen}
              autoHideDuration={6000}
              onClose={() => setAlertOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={() => setAlertOpen(false)}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                File Tokenizeed successfully!
              </Alert>
            </Snackbar>
          </Grid>

          <Box mt={2}>
            <Typography align="center" color="textSecondary">
              {status}
            </Typography>
            {ipfsLink && (
              <Typography align="left">
                IPFS Link:{" "}
                <Link href={ipfsLink} target="_blank" rel="noopener noreferrer">
                  {ipfsLink}
                </Link>
              </Typography>
            )}
          </Box>
        </Grid>
        <Box mt={4}>
          <Typography variant="h7" align="center">
            Transaction History:
          </Typography>
          {transactionHistory.length > 0 ? (
            transactionHistory.map((hash, index) => (
              <Box key={index} mt={1} textAlign="left">
                <Link
                  href={`https://goerli.arbiscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`Transaction ${index + 1}: ${hash}`}
                </Link>
              </Box>
            ))
          ) : (
            <Typography align="center" mt={1}>
              No transactions yet.
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}

export default TokenizeFile;
