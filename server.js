
var express = require("express");
var app = express();
var cors = require("cors");
var mysql = require("mysql");
var bodyParser = require('body-parser');

var jsonparser = bodyParser.json();
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");




app.use(express.json());
app.use(cors(

));
//mysql connection //

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "loginmern",
})
con.connect(function (err) {
    if (err) {
        console.log(err)
    }
    else {
        console.log("database connected sucessfully")
    }
})

//mysql connection //



function verifyUser(req, res, next) {
    let token = req.cookies.token;
    if (!token) {
        return res.json({ success: false, Message: "token provide" })
    } else {
        jwt.verify(token, "secert", function (err, decoded) {
            if (err) {
                return res.json({ Message: "authentication error" })
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
}



app.get('/', verifyUser, (req, res) => {
    res.json({ success: "true", name: req.name })
})





app.post("/login", jsonparser, function (req, res) {
    let sql = "SELECT * FROM login WHERE email = ? and password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, row) => {
        if (err) {
            return res.json({ Message: "server side err" });
        }
        if (row.length > 0) {
            const name = row[0].name;
            const token = jwt.sign(name, "secert", { expiresIn: 60 });
            res.cookie('token', token, { httpOnly: true });
            res.json({ success: true, Message: 'login successfull' });
        }
        else {
            res.status(401).json({ success: false, Message: "no recorded" })
        }
    })
})






app.listen(4000, () => {
    console.log("listening...........");
})




















