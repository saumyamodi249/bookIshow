import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";

import Home from "./home/jsx/Home.jsx";
import MyTicket from "./home/jsx/MyTIcket.jsx";
import MovieDetails from "./home/jsx/MovieDetails.jsx";
import Theater from "./home/jsx/Theater.jsx";
import TheaterDetails from "./home/jsx/TheaterDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            AUTH
        ========================= */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* =========================
            MAIN
        ========================= */}
        <Route path="/home" element={<Home />} />
        <Route path="/my-ticket" element={<MyTicket />} />

        {/* =========================
            MOVIE DETAILS
        ========================= */}
        <Route path="/movie/:id" element={<MovieDetails />} />

        {/* =========================
            THEATER LIST
        ========================= */}
        <Route path="/theaters" element={<Theater />} />

        {/* =========================
            THEATER DETAILS
        ========================= */}
        <Route
          path="/theaters/:id"
          element={<TheaterDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;