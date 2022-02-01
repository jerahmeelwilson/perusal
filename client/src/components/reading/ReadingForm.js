import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ReadingForm() {
  const [userBooks, setUserBooks] = useState([]);

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

  useEffect(() => {
    getBooks();
  }, []);
  console.log(userBooks);
  return (
    <div>
      <h2>Track Reading</h2>
    </div>
  );
}
