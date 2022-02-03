import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ReadingCalendar.css";
import axios from "axios";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function ReadingCalendar() {
  const [userBooks, setUserBooks] = useState([]);
  const [userReadings, setUserReadings] = useState([]);
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    try {
      const books = await axios.get(
        `http://localhost:4001/dashboard/getBooks`,
        {
          headers: { token: localStorage.token },
        }
      );
      setUserBooks(books.data);
      const readings = await axios.get(
        `http://localhost:4001/dashboard/getReadings`,
        {
          headers: { token: localStorage.token },
        }
      );
      setUserReadings(readings.data);
      const newEvents = userReadings.map((event) => {
        let book = userBooks.filter((book) => event.book_id === book.book_id);
        return {
          title: `Read ${book[0].title} for ${(
            "0" + Math.floor((event.reading_time / 3600000) % 60)
          ).slice(-2)} hours and ${(
            "0" + Math.floor((event.reading_time / 60000) % 60)
          ).slice(-2)} minutes, finished on page ${event.current_page}.`,
          start: event.date,
          end: event.date,
        };
      });
      setEvents(newEvents);
    } catch (err) {
      console.error(err.message);
    }
  };



  useEffect(() => {
    getEvents();
   
  }, [events]);

  return (
    <div>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        events={events}
        endAccessor="end"
        views={{
          month: true,
          agenda: true
        }}
        style={{ height: 400, margin: "10px" }}
      />
    </div>
  );
}
