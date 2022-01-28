import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useState, useEffect } from "react";

export default function BookSearch() {
  const [books, setBooks] = useState([]);

  const initialValues = {
    isbn: "",
  };
  const onSubmit = async (values) => {
    axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${values.isbn}`)
      .then((res) => {
        setBooks(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const validate = (values) => {
    const errors = {};
    if (!values.isbn) {
      errors.isbn = "ISBN Required";
    }
    return errors
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });
  console.log(books)
  return (
    <div>
      <h2>BookSearch</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="isbn"
          onChange={formik.handleChange}
          value={formik.values.isbn}
          placeholder="ISBN"
        />
        <button type="submit" disabled={!formik.isValid}>
          Submit
        </button>
        <div>
        {formik.errors.isbn ? <div>{formik.errors.isbn}</div> : null}
        </div>
      </form>
      {books
        ? books.map((book) => {
            return (
              <div key={book.id}>
                <h1>{book.volumeInfo.title}</h1>
                <h2>{book.volumeInfo.subtitle}</h2>
                <p>{book.volumeInfo.authors}</p>
                <p>{book.volumeInfo.publisher}</p>
                <p>{book.volumeInfo.publishedDate}</p>
                <p>{book.volumeInfo.description}</p>
                <p>{book.volumeInfo.pageCount}</p>
                <p>{book.volumeInfo.industryIdentifiers[1].identifier}</p>          
              </div>
            );
          })
        : null}
    </div>
  );
}
