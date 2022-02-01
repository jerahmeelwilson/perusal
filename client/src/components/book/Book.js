import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BookIcon from '@mui/icons-material/Book';
import "./Book.css";

export default function Book({ book }) {
  
  
  const handleClick = (e) => {
    if (!book.subtitle) {
      book.subtitle = null;
    }
  
    axios
      .post("http://localhost:4001/dashboard/addBook", book, {
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
  return (
    <div className="bookCard">
      <div>
        <h4>{book.title} {book.subtitle}</h4>
        {book.thumbnail ? <img src={book.thumbnail} alt={book.title} /> : <BookIcon className='bookPlaceHolder'/>}
        <h4>By: {book.authors}</h4>
      </div>
      {book.from !== 'bookshelf' ? <div className="leftSide">
        <p className="description">
          {book.from === "booksearch" ? book.description : null}
        </p>
        <button onClick={handleClick}>Add to Library</button>
      </div>: null}
    </div>
  );
}
