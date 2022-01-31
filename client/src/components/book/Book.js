import React from "react";
import "./Book.css";
import axios from "axios";
import { toast } from "react-toastify";
import BookIcon from '@mui/icons-material/Book';

export default function Book({ book }) {
  const handleClick = (e) => {
    if (!book.subtitle) {
      book.subtitle = null;
    }

    let authorString = book.authors.join(",");

    let body = { ...book, authors: authorString };

    axios
      .post("http://localhost:4001/dashboard/addBook", body, {
        headers: { token: localStorage.token },
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data)
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err.response.data);
      });
  };
  console.log(book.thumbnail);
  return (
    <div className="bookCard">
      <div>
        <h4>{book.title}</h4>
        <h4>{book.subtitle}</h4>
        {book.thumbnail ? <img src={book.thumbnail} alt={book.title} /> : <BookIcon className='bookPlaceHolder'/>}
        <h4>By: {book.authors.join(",")}</h4>
      </div>
      <div className="leftSide">
        <p className="description">
          {book.from === "booksearch" ? book.description : null}
        </p>
        <button onClick={handleClick}>Add to Library</button>
      </div>
    </div>
  );
}
