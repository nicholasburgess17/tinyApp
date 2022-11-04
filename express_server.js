const express = require("express");
const app = express();
const cookie = require("cookie-parser");
const PORT = 8080;

app.set("view engine", "ejs");

const generateRandomString = (length) => {
  let string = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  result = " ";
  for (let i = 0; i < length; i++) {
    result += string.charAt(Math.floor(Math.random() * string.length));
  }
  return result;
};
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
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

app.use(express.urlencoded({ extended: true }));
app.use(cookie());
//JSON everything
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//login
app.post("/login", (req, res) => {
  const value = req.body.users;
  res.cookie("user_id", value);
  res.redirect("/urls");
});
//logout
app.post("/logout", (req, res) => {
  const value = req.body.users;
  res.clearCookie("user_id", value);
  res.redirect("/urls")
})
//main page
app.get("/urls", (req, res) => {
  const templatevars = { urls: urlDatabase, user: req.cookies["user_id"] };
  res.render("urls_index", templatevars);
});
//add new urls
app.get("/urls/new", (req, res) => {
  const templatevars = { user: users };
  res.render("urls_new", templatevars);
});
//individual url pages
app.get("/urls/:id", (req, res) => {
  const templatevars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: req.cookies["user_id"],
  };
  res.render("urls_show", templatevars);
});
//small url redirect to original url
app.get("/u/:id", (req, res) => {
  let id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});
//register
//not displaying users.email in header, caused by templatevars... how to fix
app.get("/register", (req, res) => {
  const templatevars = { urls: urlDatabase,  user:  req.cookies["user_id"]
  }
  res.render("register", templatevars)
})
//create short urls
app.post("/urls", (req, res) => {
  const id = generateRandomString(6);
  urlDatabase[id] = req.body.longURL; // save new url to database
  return res.redirect(`/urls/${id}`); 
});
//remove urls 
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls/");
});
//add new urls to url database
app.post("/urls/:id", (req, res) => {
  const id = req.params.id
  urlDatabase[id] = req.body.longURL;
 res.redirect("/urls");
});
//create user ID
app.post("/register", (req, res) => {
  const id = generateRandomString(4).trim();
  const email = req.body.email
  const password = req.body.password
  users[id] = {
    id,
    email,
    password,
  }
//  const user = users[id]
  res.cookie("user_id", id)
  res.redirect("/urls")
console.log(user.email)
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
