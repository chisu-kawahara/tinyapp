const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
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

app.get('/register', (req, res) => {
  res.render('register');
});
const userId = req.cookies["user_id"];
const user = users[userId];

const template = {
  user, // instead of username
  // other data like urls: urlDatabase
};

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});




app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Basic validation: check for empty fields
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty.");
  }

  // Check if email already exists
  for (let userId in users) {
    if (users[userId].email === email) {
      return res.status(400).send("A user with that email already exists.");
    }
  }

  

  // Create new user
  const userId = generateRandomID();
  const newUser = {
    id: userId,
    email,
    password // plaintext for now — will fix later
  };

  users[userId] = newUser;

  // Set user_id cookie and redirect
  res.cookie("user_id", userId);
  console.log(users); // For testing
  res.redirect('/urls');
});
