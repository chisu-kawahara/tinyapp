const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));


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
		/*
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
*/

//Route to urls_new.ejs
app.get("/urls/new", (req, res) => {
			res.render("urls_new");
		});

//Route to urls_index.ejs
app.get("/urls", (req, res) => {
	const templateVars = { urls: urlDatabase };
	res.render("urls_index", templateVars);
});

//Route to urls_show.ejs
app.get("/urls/:id", (req, res) => {
	const id = req.params.id;
	const longURL = urlDatabase[id];
	const templateVars = { id, longURL };
	res.render("urls_show", templateVars);
});

// take the user to the real site
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];

  if (longURL) {
    res.redirect(longURL); // take the user to the real site
  } else {
    res.status(404).send("Short URL not found.");
  }
});


//-------------------- Post Routes --------------------
// Route to handle POST requests to /urls


function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); // generate the ID
  const longURL = req.body.longURL; // get the long URL from the form

  urlDatabase[shortURL] = longURL; // save it in the database!

  res.redirect(`/urls/${shortURL}`); // redirect the user to a new page
});

// redirecrt back to the /urls page - delete button
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
