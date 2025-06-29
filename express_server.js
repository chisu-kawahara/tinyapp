const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const {
	getUserByEmail,
	generateRandomString,
	urlsForUser,
} = require("./helpers");
const { users, urlDatabase } = require("./database");

const app = express();
const PORT = 8080;

app.use(
	cookieSession({
		name: "session",
		keys: ["dkfltktensai"], // can be anything secret
	})
);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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
	const userId = req.session.user_id;
	if (userId && users[userId]) {
		return res.redirect("/urls"); // if logged in → send to /urls
	}
	const user = users[userId];
	res.render("register", { user }); // if not logged in → show the form
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
	if (!bcrypt.compareSync(password, user.password)) {
		// security check
		return res.status(403).send("Incorrect password");
	}

	req.session.user_id = user.id;
	res.redirect("/urls");
});

// POST: Logout
app.post("/logout", (req, res) => {
	req.session = null;
	res.redirect("/login");
});

//GET: login
app.get("/login", (req, res) => {
	const userId = req.session.user_id;
	if (userId && users[userId]) {
		return res.redirect("/urls"); // if logged in, go to /urls
	}
	const user = users[userId];
	res.render("login", { user }); // if not, show the login page
});

// GET: urls index
app.get("/urls", (req, res) => {
	const userId = req.session.user_id;
	// Check if user is logged in
	if (!userId) {
		return res.status(401).send("Please log in to view your URLs.");
	}

	// Get URLs only for this user
	const userURLs = urlsForUser(userId, urlDatabase);

	// Send filtered URLs to the template
	const templateVars = {
		urls: userURLs,
		user: users[userId],
	};
	res.render("urls_index", templateVars);
});

// GET: Create new url
app.get("/urls/new", (req, res) => {
	const userId = req.session.user_id;
	if (!userId || !users[userId]) {
		return res.redirect("/login");
	}
	const user = users[userId];
	const templateVars = { user };
	res.render("urls_new", templateVars);
});

// GET: Show individual url
app.get("/urls/:id", (req, res) => {
	const shortURL = req.params.id;
	const userId = req.session.user_id;
	const urlData = urlDatabase[shortURL];

	if (!urlData) {
		return res.status(404).send("Short URL not found.");
	}

	if (urlData.userID !== userId) {
		return res.status(403).send("You do not have access to this URL.");
	}

	const templateVars = {
		shortURL,
		longURL: urlData.longURL,
		user: users[userId],
	};
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
	const userId = req.session.user_id;
	if (!userId || !users[userId]) {
		return res.status(403).send("You must be logged in to shorten URLs.");
	}

	const longURL = req.body.longURL;
	const shortURL = generateRandomString();
	urlDatabase[shortURL] = {
		longURL,
		userID: userId,
	};
	res.redirect(`/urls/${shortURL}`);
});

// POST: Delete a short URL
app.post("/urls/:id/delete", (req, res) => {
	const userId = req.session.user_id;
	const id = req.params.id;
	const url = urlDatabase[id];

	if (!url) {
		return res.status(404).send("URL not found.");
	}

	if (!userId || url.userID !== userId) {
		return res
			.status(403)
			.send("You do not have permission to delete this URL.");
	}

	delete urlDatabase[req.params.id];

	res.redirect("/urls");
});

// POST: Update a long URL
app.post("/urls/:id", (req, res) => {
	const shortURL = req.params.id;
	const newLongURL = req.body.longURL;
	const userId = req.session.user_id;

	if (!urlDatabase[shortURL]) {
		return res.status(404).send("Short URL not found.");
	}

	if (urlDatabase[shortURL].userID !== userId) {
		return res.status(403).send("You do not have permission to edit this URL.");
	}

	urlDatabase[shortURL].longURL = newLongURL;
	res.redirect("/urls");
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
