import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Book from "../book/Book";
import "./ReadingForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReadingForm() {
  const [userBooks, setUserBooks] = useState([]);
  const [time, setTime] = React.useState(0);
  const [timerOn, setTimerOn] = React.useState(false);

  const [bookSelect, setBookSelect] = useState("");
  const [book, setBook] = useState("");
  const [totalPage, setTotalPages] = useState(0);

  const [pagesRead, setPagesRead] = useState(0);

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
    let interval = null;

    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!timerOn) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  const handleChange = (event) => {
    if (event.target.value !== "null") {
      setBookSelect(event.target.value);
      let bookInfo = event.target.value.split(" ");
      setBook(bookInfo[0]);
      setTotalPages(parseInt(bookInfo[1]));
    }
  };

  const handleSubmit = (event) => {
    console.log(book);
    console.log(pagesRead);
    console.log(new Date());
    console.log(time);

    let body = {
      reading_time: time,
      date: `${new Date()}`,
      book_id: book,
      current_page: parseInt(pagesRead),
    };

    axios
      .post("http://localhost:4001/dashboard/addReading", body, {
        headers: { token: localStorage.token },
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err.response.data);
      });

    setTime(0);
    setPagesRead(0);
  };

  return (
    <div className="readingTracker">
      <form>
        <h2>Reading Tracker</h2>
        <label for="book_id">Choose a book to read:</label>
        {userBooks && (
          <select htmlFor="book_id" id="book_id" onChange={handleChange}>
            {!bookSelect ? <option value="null">Select a book</option> : null}
            {userBooks.map((book) => {
              return (
                <option value={`${book.book_id} ${book.page_count}`}>
                  {book.title}
                </option>
              );
            })}
          </select>
        )}
        {!timerOn && time > 0 && (
          <div class="numberInput">
            <label for="book_id">What page are you on?</label>
            <br />
            <input
              type="number"
              min="0"
              max={totalPage}
              required
              className="numberInput"
              onChange={(event) => setPagesRead(event.target.value)}
            />
            /{totalPage}
          </div>
        )}
        <div id="buttons">
          {!timerOn && time === 0 && bookSelect && (
            <button onClick={() => setTimerOn(true)}>Begin</button>
          )}
          {timerOn && (
            <button
              onClick={(event) => {
                setTimerOn(false);
              }}
            >
              Stop
            </button>
          )}
          {!timerOn && time > 0 && pagesRead <= totalPage && pagesRead > 0 && (
            <button
              type="submit"
              onClick={(event) => {
                handleSubmit(event);
              }}
            >
              Add Time
            </button>
          )}
        </div>
      </form>
      {timerOn && (
        <div className="bookDisplay">
          <h3>
            Reading:
            <div className="timer">
              <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
              <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
            </div>
          </h3>
          <div>
            {userBooks
              .map((currentBook) => {
                return (
                  <Book
                    book={{
                      ...currentBook,
                      authors: currentBook.author,
                      from: "bookshelf",
                    }}
                  />
                );
              })
              .filter((currentBook) => {
                return currentBook.props.book.book_id === book;
              })}
          </div>
        </div>
      )}
    </div>
  );
}
