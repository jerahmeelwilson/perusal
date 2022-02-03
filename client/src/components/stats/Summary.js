import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./Summary.css";
export default function Summary() {
  const [userBooks, setUserBooks] = useState("");
  const [userStats, setUserStats] = useState("");

  const getBooks = () => {
    axios
      .get(`http://localhost:4001/dashboard/getBooks`, {
        headers: { token: localStorage.token },
      })
      .then((res) => {
        setUserBooks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStats = () => {
    axios
      .get(`http://localhost:4001/dashboard/getStats`, {
        headers: { token: localStorage.token },
      })
      .then((res) => {
        setUserStats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getBooks();
    getStats();
  }, []);

  let bookmarks = [];
  let totals = [];
  if (userStats && userBooks) {
    bookmarks = userStats.book_stats.map((book) => {
      return (
        <div className="bookmarks">
          <h4>{book.title}</h4>
          <h4>{book.max}</h4>
        </div>
      );
    });

    totals = userStats.reading_stats.map((book) => {
      return (
        <div className="bookmarks">
          <h4>{book.title}</h4>
          <h4>{`${("0" + Math.floor((book.sum / 3600000) % 60)).slice(-2)}:${(
            "0" + Math.floor((book.sum / 60000) % 60)
          ).slice(-2)}:${("0" + Math.floor((book.sum / 1000) % 60)).slice(
            -2
          )}`}</h4>
        </div>
      );
    });
  }

  return (
    <div className="summary">
      <h2>Summary</h2>
      <h3>Bookmarks</h3>
      {bookmarks}
      <h3>Total Reading Time</h3>
      {totals}
    </div>
  );
}
