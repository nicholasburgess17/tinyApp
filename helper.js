
const generateRandomString = (length) => {
  let string = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  result = " ";
  for (let i = 0; i < length; i++) {
    result += string.charAt(Math.floor(Math.random() * string.length));
  }
  return result;
};

const findUserByEmail = (email, userDatabase) => {
  for (let userID in userDatabase) {
    if (userDatabase[userID].email === email) {
      const user = userDatabase[userID];
      return user;
    }
  }
};
const urlsForUser = (id, urlDatabase) => {
  let result = {};
  for (let shortURLS in urlDatabase) {
    if (id === urlDatabase[shortURLS].userID) {
      result[shortURLS] = urlDatabase[shortURLS].longURL;
    }
  }
  return result;
};
module.exports = { generateRandomString, findUserByEmail, urlsForUser }