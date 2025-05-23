const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};



app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.use(express.urlencoded({ extended: true }));

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(); // Generate unique ID

  // Save to "database"
  urlDatabase[shortURL] = longURL;

  // Redirect to /urls/:id
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[id] = newLongURL;
  res.redirect("/urls");
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);  // sets cookie named 'username'
  res.redirect('/urls');              // redirect after login
});

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars

  };
  res.render("urls_index", templateVars);
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');   // This clears the cookie
  res.redirect('/urls');         // Redirects to the /urls page
});