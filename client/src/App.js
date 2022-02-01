import "./App.css";
import Login from "./components/Landing/Login";
import Register from "./components/Landing/Register";
import { Route, Routes, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer} from 'react-toastify';
import axios from "axios";
import LandingPage from "./components/Landing/LandingPage";
import BookSearch from "./components/dashboard/booksearch/BookSearch";
import BookShelf from "./components/dashboard/bookshelf/Bookshelf";
import ReadingForm from "./components/reading/ReadingForm"
import Calendar from "./components/calendar/Calendar";

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
      <nav>
        <h2>Persual</h2>
        <div className="navLinks">
          <ul>
            <li>
              <NavLink activeclassname="active" to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink activeclassname="active" to="/register">
                Signup
              </NavLink>
            </li>
            <li>
              <NavLink  activeclassname="active" to="/login">
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Dashboard setLogin={setIsLoggedIn} />
            ) : (
              <LandingPage />
            )
          }
        >
        <Route path="/books" element={<BookShelf />}/>
        <Route path="/search" element={<BookSearch />}/>
        <Route path="/read" element={<ReadingForm />}/>
        <Route path="/calendar" element={<Calendar />}/>
        </Route>
        <Route
          path="/register"
          element={<Register setLogin={setIsLoggedIn} />}
        />
        <Route path="/login" element={<Login setLogin={setIsLoggedIn} />} />
      </Routes>
    </div>
  );
}

export default App;
