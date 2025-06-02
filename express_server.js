const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@test.com",
    password: "12345",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@test.com",
    password: "54321",
  },
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

function getUserByEmail(email, users) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user; // return the whole user object
    }
  }
  return null;
}

// GET: Home
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// GET: Registration Page
app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { user };
  res.render("register", templateVars);
});

// POST: Register a new user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

//check for empty email and password
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty.");
  }
//check if the email already exists/
  const existingUser = getUserByEmail(email, users);
  if (existingUser) {
    return res.status(400).send("A user with that email already exists.");
  }

  const id = generateRandomString();
  const newUser = { id, email, password };
  users[id] = newUser;
  res.cookie("user_id", id);
  console.log(users); //for debugging
  res.redirect("/urls");
});

// POST: Login
app.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

  if (!user) {
    return res.status(403).send("User not found");
  }

  if (user.password !== password) {
    return res.status(403).send("Incorrect password");
  }

  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty.");
  }

  let foundUser = null;
  for (let userId in users) {
    const user = users[userId];
    if (user.email === email && user.password === password) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    return res.status(403).send("Invalid email or password.");
  }

  res.cookie("user_id", foundUser.id);
  res.redirect("/urls");
});

// POST: Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});


//GET: login
app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];

  const templateVars = {
    user // pass the full user object (or undefined)
  };

  res.render("login", templateVars);
});

// GET: urls index
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { user, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET: Create new url
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// GET: Show individual url
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id, longURL, user };
  res.render("urls_show", templateVars);
});

// GET: Redirect to long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];

  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Short URL not found.");
  }
});

// POST: Create a new short URL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// POST: Delete a short URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// POST: Update a long URL
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[id] = newLongURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
