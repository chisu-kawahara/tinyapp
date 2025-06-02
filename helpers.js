function getUserByEmail(email, users) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user; // return the whole user object
    }
  }
  return null;
}

module.exports = { getUserByEmail };