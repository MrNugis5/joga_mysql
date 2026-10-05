const express = require("express")
const path = require("path")
const hbs = require("express-handlebars")

const app = express()
app.engine(hbs.engine({ extname: "hbs", defaultLayout: "main", layoutsDir: __dirname + "/views/layouts" })) 
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

const mysql = require("mysql")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwerty",
  database: "joga_mysql"
})

con.connect(function(err) {
  if (err) throw err
  console.log("Connected!")
})

app.listen(3003, () => {
    console.log("Started at http://localhost:3003")
})