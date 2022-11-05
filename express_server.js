const express = require("express");
const app = express();
const cookie = require("cookie-parser");
const PORT = 8080;

app.set("view engine", "ejs");

//helper functions
const generateRandomString = (length) => {
  let string = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  result = " ";
  for (let i = 0; i < length; i++) {
    result += string.charAt(Math.floor(Math.random() * string.length));
  }
  return result;
};
const findUserByEmail = (email) => {
  for (let userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
  }
};
//objects
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
  const password = req.body.password;
  const email = req.body.email;
  //lookup email submitted via loginform
  //no user email found -> error 403
  for (const userID in users) {
    
    if (!findUserByEmail(email)) {
      console.log("error 403, no account with this email exists");
      res.redirect("/register");
      return;
    }
    //if email is found, locate password -> match? go to urls after cookies are set to id
    if (users[userID].password === password) {
      const value = users[userID].id
      res.cookie("user_id", value);
      res.redirect("/urls");
      return;
    }
    console.log("error 403. Password is incorrect");
    res.redirect("/login");
  }
  
});
//logout
app.post("/logout", (req, res) => {
  const value = req.body.users;
  res.clearCookie("user_id", value);
  res.redirect("/login");
});
//main page
app.get("/urls", (req, res) => {
  const templatevars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templatevars);
});
//add new urls
app.get("/urls/new", (req, res) => {
  const templatevars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templatevars);
});
//individual url pages
app.get("/urls/:id", (req, res) => {
  const templatevars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templatevars);
});
//small url redirect to original url
app.get("/u/:id", (req, res) => {
  let id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});
//register users
app.get("/register", (req, res) => {
  const templatevars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("register", templatevars);
});
//error 400, empty email or password when registering
app.get("/error_page", (req, res) => {
  const templatevars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("error_page", templatevars);
});
//user already exists
app.get("/error", (req, res) => {
  const templatevars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("error", templatevars);
});
app.get("/login", (req, res) => {
  const templatevars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("login", templatevars);
});
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
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls");
});
//create user ID
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //if email or pass are empty strings send response with 400 status code
  if (!email || !password) {
    res.redirect("/error_page");
    return;
  }
  //if someone registers with an already registered email send response with a 400 error code
  if (findUserByEmail(email)) {
    res.redirect("/error");
    return;
  }
  //Setting the new user after all the validations are checked.
  const id = generateRandomString(4).trim();
  users[id] = {
    id,
    email,
    password,
  };
  res.cookie("user_id", id);
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
