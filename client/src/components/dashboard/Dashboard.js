import axios from "axios";
import { useState, useEffect } from "react";
import BookSearch from "./booksearch/BookSearch";

export default function Dashboard({setLogin}) {
  const [username, setUsername] = useState("");

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
  },[]);

  const logout = (e)=> {
    e.preventDefault();
    localStorage.removeItem("token");
    setLogin(false);
  }

  return (
    <div>
      <h1>Dashboard {username}</h1>

      <BookSearch />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
