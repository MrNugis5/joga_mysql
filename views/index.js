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
  const query = `SELECT article.*, author.name AS author_name
    FROM article
    JOIN author ON article.author_id = author.id
    WHERE article.slug = ?`
  con.query(query, [req.params.slug], (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).send("Unable to load article")
    }

    res.render("article", { article: result })
  })
})

app.get("/author/:author_id", (req, res) => {
  const authorId = req.params.author_id

  con.query("SELECT * FROM author WHERE id = ?", [authorId], (authorErr, authorResult) => {
    if (authorErr) {
      console.error(authorErr)
      return res.status(500).send("Unable to load author")
    }

    if (authorResult.length === 0) {
      return res.status(404).send("Author not found")
    }

    con.query("SELECT * FROM article WHERE author_id = ?", [authorId], (articlesErr, articlesResult) => {
      if (articlesErr) {
        console.error(articlesErr)
        return res.status(500).send("Unable to load author's articles")
      }

      res.render("author", {
        author: authorResult[0],
        articles: articlesResult
      })
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
