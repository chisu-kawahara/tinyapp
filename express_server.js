const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');

const app = express();
const PORT = 8080;

app.use(cookieSession({
  name: "session",
  keys: ["dkfltktensai"], // can be anything secret
}));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@test.com",
    password: bcrypt.hashSync("12345", 10), // hashed
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@test.com",
    password: bcrypt.hashSync("54321", 10), // hashed
  },
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",   // Who created this URL
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// GET: Home
app.get("/", (req, res) => {
  const userID = req.session.user_id;

  if (userID) {
    return res.redirect("/urls");
  }

  return res.redirect("/login");
});

// GET: Registration Page
app.get("/register", (req, res) => {
	const userId = req.session.user_id
  if (userId && users[userId]) {
    return res.redirect("/urls"); // if logged in → send to /urls
  }
  const user = users[userId];
  res.render("register", {user}); // if not logged in → show the form
});

// POST: Register a new user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty.");
  }

  const existingUser = getUserByEmail(email, users);
  if (existingUser) {
    return res.status(400).send("A user with that email already exists.");
  }

  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10); 
  const newUser = { id, email, password: hashedPassword };

  users[id] = newUser;
  req.session.user_id = id;
  res.redirect("/urls");
});

// POST: Login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty.");
  }

  if (!user) {
    return res.status(403).send("User not found");
  }
  if (!bcrypt.compareSync(password, user.password)) { // security check
    return res.status(403).send("Incorrect password");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

// POST: Logout
app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/login");
});

//GET: login
app.get("/login", (req, res) => {
  const userId = req.session.user_id
  if (userId && users[userId]) {
    return res.redirect("/urls"); // if logged in, go to /urls
  }
  const user = users[userId];
  res.render("login", {user}); // if not, show the login page
})

// GET: urls index
app.get("/urls", (req, res) => {
  const userId = req.session.user_id

  // Check if user is logged in
  if (!userId || !users[userId]) {
    return res.status(401).send("Please log in to view your URLs.");
    // Or you could do: return res.redirect("/login");
  }

  // Get URLs only for this user
  const userURLs = urlsForUser(userId);

  // Get user object for template
  const user = users[userId];

  // Send filtered URLs to the template
  const templateVars = { user, urls: userURLs };
  res.render("urls_index", templateVars);
});

// GET: Create new url
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id
  if (!userId || !users[userId]) {
    return res.redirect("/login");
  }
  const user = users[userId];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// GET: Show individual url
app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id
  const user = users[userId];
  const id = req.params.id;
  const url = urlDatabase[id];

  if (!userId || !user) {
    return res.status(401).send("You must be logged in to view this URL.");
  }
  if (!url) {
    return res.status(404).send("URL not found.");
  }
  if (url.userID !== userId) {
    return res.status(403).send("You do not have permission to view this URL.");
  }

  const templateVars = { id, longURL: url.longURL, user };
  res.render("urls_show", templateVars);
});

// GET: Redirect to long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const urlData = urlDatabase[shortURL];

  if (urlData) {
    res.redirect(urlData.longURL);
  } else {
    res.status(404).send("Short URL not found.");
  }
});

// POST: Create a new short URL
app.post("/urls", (req, res) => {
  const userId = req.session.user_id
  if (!userId || !users[userId]) {
    return res.status(403).send("You must be logged in to shorten URLs.");
  }

  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    userID: userId
  };
  res.redirect(`/urls/${shortURL}`);
});

// POST: Delete a short URL
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id
  const id = req.params.id;
  const url = urlDatabase[id];

  if (!url) {
    return res.status(404).send("URL not found.");
  }
  if (!userId || url.userID !== userId) {
    return res.status(403).send("You do not have permission to delete this URL.");
  }

  delete urlDatabase[id];
  res.redirect("/urls");
});


// POST: Update a long URL
app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id
  const id = req.params.id;
  const url = urlDatabase[id];

  if (!url) {
    return res.status(404).send("URL not found.");
  }
  if (!userId || url.userID !== userId) {
    return res.status(403).send("You do not have permission to edit this URL.");
  }

  const newLongURL = req.body.longURL;
  url.longURL = newLongURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
