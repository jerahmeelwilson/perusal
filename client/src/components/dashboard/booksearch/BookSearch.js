import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import Book from "../../book/Book";
import "./BookSearch.css";

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
    return errors;
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });
  return (
    <div className="booksearch">
      <div>
        <h2>BookSearch</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            className="isbnInput"
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
      </div>
      <div>
        {books
          ? books.map((book, index) => {
              let bookProps = {
                title: book.volumeInfo.title,
                subtitle: book.volumeInfo.subtitle,
                authors: book.volumeInfo.authors,
                publisher: book.volumeInfo.publisher,
                publishedDate: book.volumeInfo.publishedDate,
                description: book.volumeInfo.description,
                pageCount: book.volumeInfo.pageCount,
                isbn: book.volumeInfo.industryIdentifiers[0].identifier,
                thumbnail: book.volumeInfo.imageLinks.thumbnail,
                from: "booksearch"
              };
              return <Book key={book.id} book={bookProps} />;
            })
          : null}
      </div>
    </div>
  );
}
