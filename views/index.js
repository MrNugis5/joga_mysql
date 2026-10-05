const express = require("express")
const path = require("path")
const hbs = require("express-handlebars")

const app = express()

app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "layouts")
  })
)

app.set("view engine", "hbs")
app.set("views", __dirname)

app.use(express.static(path.join(__dirname, "../public")))

const mysql = require("mysql2")

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

app.get("/article/:slug", (req, res) => {
  let query = `SELECT * FROM article WHERE slug = '${req.params.slug}'`
  let article
  con.query(query, (err, result) => {
    if (err) throw err

    article = result
    console.log(article)
    
    res.render("article", {
      article: article
    })
  })
})
app.get("/", (req, res) => {
  let query = "SELECT * FROM article"

  con.query(query, (err, result) => {
    if (err) throw err

    console.log(result)

    res.render("index", {
      articles: result
    })
  })
})

app.listen(3003, () => {
  console.log("Started at http://localhost:3003")
})
