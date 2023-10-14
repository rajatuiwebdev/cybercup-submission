import React from "react";
import MintNFT from "./MintNFT";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { Routes, Route } from "react-router-dom"
import Home from "./Home";
import Verify from "./Verify";
import Decompress from "./Decompress";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
      <Route path="/" element = {<Home/>}></Route>
      <Route path="/upload" element = {<MintNFT/>}></Route>
      <Route path="/verify" element = {<Verify/>}></Route>
      <Route path="/decompress" element = {<Decompress/>}></Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;


