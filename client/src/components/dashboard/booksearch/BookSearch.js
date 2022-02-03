import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import Book from "../../book/Book";
import "./BookSearch.css";
import {toast } from 'react-toastify';
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
        if(!res.data.items){
          toast.error("ISBN does not exist");
        }
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
    if(values.isbn.includes("-")){
      errors.isbn = "Please include numbers only"
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
        <h2>Book Search</h2>
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
            {formik.errors.isbn ? <div className="validationError">{formik.errors.isbn}</div> : null}
          </div>
        </form>
      </div>
      <div>
        {books
          ? books.map((book, index) => {
              let bookProps = {
                book_id: book.id,
                title: book.volumeInfo.title,
                subtitle: book.volumeInfo.subtitle,
                authors: book.volumeInfo.authors,
                description: book.volumeInfo.description,
                page_count: book.volumeInfo.pageCount,
                isbn13: book.volumeInfo.industryIdentifiers[0].identifier,
                thumbnail: book.volumeInfo.hasOwnProperty('imageLinks') ? book.volumeInfo.imageLinks.thumbnail : null,
                from: "booksearch"
              };
              let authorString = book.volumeInfo.authors.join("");
              bookProps = {...bookProps, authors: authorString};
              return <Book key={book.id} book={bookProps} />;
            })
          : null}
      </div>
    </div>
  );
}
