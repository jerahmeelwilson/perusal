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


module.exports = router;