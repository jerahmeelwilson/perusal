import "./App.css";
import Login from "./components/Landing/Login";
import Register from "./components/Landing/Register";
import { Route, Routes, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./components/dashboard/Dashboard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    axios
      .get("http://localhost:4001/auth/verify", {
        headers: { token: localStorage.token },
      })
      .then((res) => {
        res.data === true ? setIsLoggedIn(true) : setIsLoggedIn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="App">
      <NavLink to="*">Home</NavLink>
      <NavLink to="/register">Register</NavLink>
      <ToastContainer />
      <Routes>
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Dashboard setLogin={setIsLoggedIn} />
            ) : (
              <Login setLogin={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/register"
          element={<Register setLogin={setIsLoggedIn} />}
        />
      </Routes>
    </div>
  );
}

export default App;
