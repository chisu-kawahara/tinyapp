//This function takes two inputs:
//email – the email you want to look for (a string).
//users – an object that stores all your user accounts (like a mini database).
//This checks if the email of the current user matches the one we’re looking for. If it does, it returns the whole user object. 

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