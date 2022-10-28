const express = require("express");
const app = express();
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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templatevars = { urls: urlDatabase };
  res.render("urls_index", templatevars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:id", (req, res) => {
  const templatevars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templatevars);
});
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString(6);
  //let encoded = encodeURIComponent(id)
  urlDatabase[id] = req.body.longURL; // save new url to database
  return res.redirect(`/urls/${id}`); //shows %20 in URL !!!!!!!!REMOVE AT END!!!!!!!!!!!!
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
