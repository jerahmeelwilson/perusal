import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Book from "../../book/Book";
import { Grid } from "@mui/material";
export default function Bookshelf() {
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

  return (
    <div>
      <h2>Books</h2>
      <div>
        <Grid container spacing={6}>
          {userBooks
            ? userBooks.map((book) => {
                let bookProps = {
                  book_id: book.book_id,
                  title: book.title,
                  subtitle: book.subtitle === "null" ? null : book.subtitle,
                  authors: book.author,
                  page_count: book.page_count,
                  isbn13: book.isbn13,
                  thumbnail: book.thumbnail === "null" ? null : book.thumbnail,
                  from: "bookshelf",
                };

                return (
                  <Grid item key={bookProps.book_id} md={userBooks.length <= 2 ?  6 : 3}>
                    <Book book={bookProps} />
                  </Grid>
                );
              })
            : null}
        </Grid>
      </div>
    </div>
  );
}
