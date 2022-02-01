const router = require("express").Router();
const sequelize = require("../sequelize");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    //req.user has the payload
    const user = await sequelize.query(
      `SELECT user_name FROM users WHERE user_id = '${req.user}';`
    );

    res.json(user[0][0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.post("/addBook", authorization, async (req, res) => {
  let request = {
    user: req.user,
    body: req.body,
  };
  console.log(request);

  try {
    //1. Add book to book table
    const book = await sequelize.query(
      `SELECT * FROM books WHERE book_id = '${request.body.book_id}'`
    );

    if (book[1].rowCount === 0) {
      await sequelize.query(
        `INSERT INTO books (book_id, title, subtitle, author, page_count, isbn13, thumbnail) 
            VALUES (
                '${request.body.book_id}',
                '${request.body.title}',
                '${request.body.subtitle}',
                '${request.body.authors}',
                '${request.body.page_count}',
                '${request.body.isbn13}',
                '${request.body.thumbnail}'
            );
        `
      );
    }
    //2. look for user_id and book_id listing in user_book table
    const user_book = await sequelize.query(
      `SELECT * FROM user_books WHERE book_id = '${request.body.book_id}' AND user_id = '${request.user}'`
    );
    //3. if listing exist do nothing.
    if (user_book[1].rowCount !== 0) {
      return res.status(401).send("Book already added");
    }
    //4. if Listing does not exist add book to table.
    await sequelize.query(`INSERT INTO user_books(user_id, book_id)
    VALUES (
        '${request.user}',
        '${request.body.book_id}'
    );
    `);
    res.status(200).send("Book added");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.get("/getBooks", authorization, async (req, res) => {
  try {
    //req.user has the payload
    const user_books = await sequelize.query(
      `SELECT books.book_id, title, subtitle, author, page_count, isbn13, thumbnail 
        FROM books
        JOIN user_books ON books.book_id = user_books.book_id
        WHERE user_books.user_id = ${req.user};`
    );
    res.json(user_books[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.post("/addReading", authorization, async (req, res) => {
  let request = {
    user: req.user,
    body: req.body,
  };

  try {
    //1. check if current page is greater than or equal to book page count
    const book = await sequelize.query(
      `SELECT page_count FROM books WHERE book_id = '${request.body.book_id}'`
    );
    if (
      request.body.current_page > book[0][0].page_count ||
      request.body.current_page < 0
    ) {
      res.status(401).send("Invalid page number");
    } else {
      const addTime = await sequelize.query(`
          INSERT INTO reading_times (reading_time, date, current_page, book_id) 
            VALUES (
                ${request.body.reading_time},
                '${request.body.date}',
                ${request.body.current_page},
                '${request.body.book_id}'
            )
            RETURNING reading_time_id;
          `);
      await sequelize.query(`
         INSERT INTO user_reading_times(reading_time_id, user_id)
            VALUES (
                '${addTime[0][0].reading_time_id}',
                '${request.user}'
        );
         `);

      res.status(200).send(`Reading time added`);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
