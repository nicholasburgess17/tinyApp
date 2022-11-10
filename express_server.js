//helper functions
const {
  findUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("./helper");


const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
  })
);

//objects
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "h6TvQ7",
  },
};
const users = {
  h6TvQ7: {
    id: "h6TvQ7",
    email: "user@example.com",
    password: "$2y$10$3U8WZ/PJabDktP/gDQ2PN./2gT.Msaa4TMTeuhknHBtjPDIH6Bq3O",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


//JSON everything
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//login
app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = findUserByEmail(email, users);
  if (!email && !password) {
    return res.send('please enter a vaild email and password')
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.send("error 403, Password is incorrect");
  }
  if (!user) {
    return res.send("Error 403, No account with this email exists");
  }
  const userID = user.id;
  req.session.user_id = userID;
  return res.redirect("/urls");
});

//logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});
//main page
app.get("/urls", (req, res) => {
  const cookie = req.session.user_id;
  if (!cookie) {
    res.send("maybe you should login first");
  }
  const filtered = urlsForUser(cookie, urlDatabase);
  const templatevars = {
    urls: filtered,
    user: users[cookie],
    userID: cookie,
  };

  res.render("urls_index", templatevars);
});
//add new urls
app.get("/urls/new", (req, res) => {
  const templatevars = { user: users[req.session.user_id] };
  const cookie = req.session.user_id;
  if (!cookie) {
    return res.redirect("/login");
  }
  res.render("urls_new", templatevars);
});
//individual url pages
app.get("/urls/:id", (req, res) => {
  const templatevars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.user_id],
  };
  const cookie = req.session.user_id;
  if (!cookie) {
    res.send("please login to view this page");
  }
  if (cookie !== urlDatabase[req.params.id].userID) {
    res.send("you don't have the correct permissions to view this url");
  }
  res.render("urls_show", templatevars);
});
//small url redirect to original url
app.get("/u/:id", (req, res) => {
  if (Object.keys(urlDatabase).includes(req.params.id)) {
    let longURL = urlDatabase[req.params.id].longURL;
    return res.redirect(longURL);
  }
  return res.send("that tinyURL doesnt exist!");
});
//register users
app.get("/register", (req, res) => {
  const templatevars = {
    urls: urlDatabase,
    user: users[req.session.user_id],
  };
  const cookie = req.session.user_id;
  if (cookie) {
    req.session.user_id;
    return res.redirect("/urls");
  }
  res.render("register", templatevars);
});

app.get("/login", (req, res) => {
  const templatevars = {
    urls: urlDatabase,
    user: users[req.session.user_id],
  };
  const cookie = req.session.user_id;
  if (cookie) {
    req.session.user_id;
    return res.redirect("/urls");
  }
  res.render("login", templatevars);
});
//create short urls
app.post("/urls", (req, res) => {
  const cookie = req.session.user_id;
  if (!cookie) {
    return res.send("You must be logged in to create shortened urls!");
  }
  const id = generateRandomString(6);
  urlDatabase[id] = {};
  urlDatabase[id].longURL = req.body.longURL;
  urlDatabase[id].userID = req.session.user_id;
  return res.redirect(`/urls/${id}`);
});

//remove urls
app.post("/urls/:id/delete", (req, res) => {
  const cookie = req.session.user_id;
  if (!cookie) {
    res.send("please login to view this page");
  }
  if (cookie !== urlDatabase[req.params.id].userID) {
    res.send("you don't have the correct permissions to delete this url");
  }
  delete urlDatabase[req.params.id];
  res.redirect("/urls/");
});
//edit urls in url database
app.post("/urls/:id", (req, res) => {
  const cookie = req.session.user_id;
  if (!cookie) {
    res.send("please login to view this page");
  }
  if (cookie !== urlDatabase[req.params.id].userID) {
    res.send("you don't have the correct permissions to delete this url");
  }
  urlDatabase[id].longURL = req.body.longURL;
  urlDatabase[id].userID = req.session.userID;
  res.redirect("/urls");
});
//create user ID
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashed = bcrypt.hashSync(password, 10);
  if (!email && !password) {
    res.send('you need to input a valid password and email')
    return;
  }
  if (findUserByEmail(email, users)) {
    res.send('an account with this email already exists')
    return;
  }
  //Setting the new user after all the validations are checked.
  const id = generateRandomString(6).trim();
  users[id] = {
    id,
    email,
    password: hashed,
  };
  req.session.user_id;
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
