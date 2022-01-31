const router = require("express").Router();
const sequelize = require("../sequelize");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req,res) => {
    try {
        //req.user has the payload
        const user = await sequelize.query(`SELECT user_name FROM users WHERE user_id = '${req.user}';`);

        res.json(user[0][0]);

    } catch (err){
        console.error(err.message);
        res.status(500).json("Server Error")
    }
})

router.post("/addBook", authorization, async (req,res) => {
    let request = {
        user: req.user,
        body: req.body
    }
    console.log(request);
 
    try{
    //1. Add book to book table
    const book = await sequelize.query(
        `SELECT * FROM books WHERE book_id = '${request.body.book_id}'`
    );


    if(book[1].rowCount === 0){
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
        `);
    }
    //2. look for user_id and book_id listing in user_book table
    const user_book = await sequelize.query(
        `SELECT * FROM user_books WHERE book_id = '${request.body.book_id}' AND user_id = '${request.user}'`
    )
    //3. if listing exist do nothing.
    if(user_book[1].rowCount !== 0){
        return res.status(401).send("Book already added");
    }
    //4. if Listing does not exist add book to table.
    await sequelize.query(`INSERT INTO user_books(user_id, book_id)
    VALUES (
        '${request.user}',
        '${request.body.book_id}'
    );
    `);
        res.status(200).send('Book added');
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error")
    }
})


module.exports = router;