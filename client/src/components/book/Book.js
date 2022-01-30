import React from "react";
import './Book.css'
export default function Book({ book }) {
  const handleClick = (e) => {
    e.preventDefault();
    console.log(book);
  }
  return (
    <div className="bookCard">
      <div>
        <h4>{book.title}</h4>
        <h4>{book.subtitle}</h4>
        <img src={book.thumbnail} alt={book.title} />
        <h4>By: {book.authors.join(",")}</h4>
      </div>
      <div className="leftSide">
        <p className="description">{book.from === "booksearch" ? book.description: null}</p>
        <button onClick={handleClick}>Add to Library</button>
      </div>
    </div>
  );
}
