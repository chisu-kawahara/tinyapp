//This function takes two inputs:
//email – the email you want to look for (a string).
//users – an object that stores all your user accounts (like a mini database).
//This checks if the email of the current user matches the one we’re looking for. If it does, it returns the whole user object.

const getUserByEmail = function (email, users) {
	for (const userId in users) {
		const user = users[userId];
		if (user.email === email) {
			return user; // return the whole user object
		}
	}
	return null;
};

const generateRandomString = function () {
	return Math.random().toString(36).substring(2, 8);
};

const urlsForUser = function (userID, urlDatabase) {
	const filteredURLs = {};
	for (const shortURL in urlDatabase) {
		if (urlDatabase[shortURL].userID === userID) {
			filteredURLs[shortURL] = urlDatabase[shortURL];
		}
	}
	return filteredURLs;
};

module.exports = {
	getUserByEmail,
	generateRandomString,
	urlsForUser,
};
