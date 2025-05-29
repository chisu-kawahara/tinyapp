const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//configurations
app.set("view engine", "ejs");

//middlewares

//Routes
//GET /

//GET /dashboard

//is user logged in?
if (!userId)
	//GET /register

	//POST /register
	app.post("/register", (req, res) => {
		const email = req.body.email;
		const password = req.body.password;

		//Did the user provide an email and password?
		if (!email || !password) {
			return res.status(400).send("Email and password cannot be empty.");
		}

		// Basic validation: check for empty fields
		if (!email || !password) {
			return res.status(400).send("Email and password cannot be empty.");
		}

		// Check if email already exists
		let foundUser = false;
		for (let userId in users) {
			const user = users[userId];
			if (users.email === email) {
				foundUser = user;
				return res.status(400).send("A user with that email already exists.");
			}
		}

		//did we find any user?
		if (foundUser) {
			return res.status(400).send("A user with that email already exists.");
		}

		//create the user
		const id = Math.random().toString(36).substring(2, 8);
		const newUser = {
			id: email,
			password, // plaintext for now — will fix later
		};
		users[id] = newUser;

		//set the cookie
		// Set user_id cookie and redirect
		res.cookie("user_id", id);
		console.log(users); // For testing
		res.redirect("/urls");

		//GET /login

		//POST /login
		app.post("/login", (req, res) => {
			const email = req.body.email;
			const password = req.body.password;

			// Basic validation: check for empty fields
			if (!email || !password) {
				return res.status(400).send("Email and password cannot be empty.");
			}

			// Check if user exists
			let foundUser = null;
			for (let userId in users) {
				const user = users[userId];
				if (user.email === email && user.password === password) {
					foundUser = user;
					break;
				}
			}

			// If user not found, return error
			if (!foundUser) {
				return res.status(403).send("Invalid email or password.");
			}

			// Set user_id cookie and redirect
			res.cookie("user_id", foundUser.id);
			res.redirect("/urls");
		});

		//---------------------------------------
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

		//----------------------------------------------

		const users = {
			userRandomID: {
				id: "userRandomID",
				email: "user@example.com",
				password: "purple-monkey-dinosaur",
			},
			user2RandomID: {
				id: "user2RandomID",
				email: "user2@example.com",
				password: "dishwasher-funk",
			},
		};

		//-------

		app.get("/urls/new", (req, res) => {
			res.render("urls_new");
		});

//Route to urls_index.ejs
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

		app.get("/register", (req, res) => {
			res.render("register");
		});

		const template = {
			user, // instead of username
			// other data like urls: urlDatabase
		};

		app.post("/logout", (req, res) => {
			res.clearCookie("user_id");
			res.redirect("/login");
		});

		//--------------------
		app.listen(PORT, () => {
			console.log(`Example app listening on port ${PORT}!`);
		});
	});
