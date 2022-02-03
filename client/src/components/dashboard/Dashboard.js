import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TodayIcon from '@mui/icons-material/Today';
import ListAltIcon from '@mui/icons-material/ListAlt';
export default function Dashboard({ setLogin }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const getUsername = () => {
    axios
      .get("http://localhost:4001/dashboard", {
        headers: { token: localStorage.token },
      })
      .then((res) => {
        setUsername(res.data.user_name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUsername();
    navigate("/books");
  }, []);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setLogin(false);
  };
  return (
    <div>
      <div className="titleBar">
        <h3>Welcome, {username}</h3>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="dashboard">
        <nav className="sidebar">
          <ul>
            <li>
              <NavLink to="books">{<BookIcon/>}</NavLink>
            </li>
            <li>
              <NavLink to="search">{<SearchIcon />}</NavLink>
            </li>
            <li>
              <NavLink to="read">{<AutoStoriesIcon />}</NavLink>
            </li>
            <li>
              <NavLink to="calendar">{<TodayIcon />}</NavLink>
            </li>
            <li>
              <NavLink to="summary">{<ListAltIcon />}</NavLink>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
