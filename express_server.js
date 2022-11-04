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

app.use(express.urlencoded({ extended: true }));
app.use(cookie());

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.post("/login", (req, res) => {
  const value = req.body.username;
  res.cookie("username", value);
  res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  const value = req.body.username;
  res.clearCookie("username", value);
  res.redirect("/urls")
})

app.get("/urls", (req, res) => {
  const templatevars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templatevars);
});
///////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  const templatevars = { username: req.cookies["username"] };
  res.render("urls_new", templatevars);
});
///////////////////////////////////////////
app.get("/urls/:id", (req, res) => {
  const templatevars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"],
  };
  res.render("urls_show", templatevars);
});

app.get("/u/:id", (req, res) => {
  let id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // 
  const id = generateRandomString(6);
 
  urlDatabase[id] = req.body.longURL; // save new url to database
  return res.redirect(`/urls/${id}`); 
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls/");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id
  urlDatabase[id] = req.body.longURL;
 res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
