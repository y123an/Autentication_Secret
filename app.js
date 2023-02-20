require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

async function connect() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
        console.log("database is connected");

    } catch (err) {
        console.error(err);
    }
}

connect();

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User = mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
})
app.get("/register", (req, res) => {
    res.render("register");
})
app.get("/login", (req, res) => {
    res.render("login");
})



app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
})

app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({ email: email }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result) {
                if (result.password === password) {
                    res.render("secrets")
                }
            }
        }
    })
})


app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port 3000")
});


