const express = require("express");
const ejs = require('ejs')
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { generateRandomString, findUserByEmail, checkPassword } = require("./helper");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // Enables body-parse
app.set('view engine', 'ejs'); // Enables EJS for rendering the pages


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");

});

app.get("/urls", (req, res) => {
  const id = req.cookies.user_id;
  const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
  let templateVars = { "urls": urlDatabase, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies.user_id;
  const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
  let templateVars = { user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const id = req.cookies.user_id;
  const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
  let templateVars = { shortURL, longURL: urlDatabase[shortURL], user };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const { longURL } = req.body;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL];
  console.log("ShortURL:", shortURL, "LongURL:", longURL);
  res.redirect(longURL);
});




app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const { longURL } = req.body;
  console.log(shortURL, longURL);
  if (!urlDatabase[shortURL]) {
    res.send("The shortURL doesn't exist")
  } else if (urlDatabase[shortURL]) {
    urlDatabase[shortURL] = longURL;
    res.redirect(`/urls/${shortURL}`)
  }
});


app.get("/login", (req, res) => {
  const id = req.cookies.user_id;
  const user = id ? users[id] : null;
  let templateVars = { user };
  res.render("login", templateVars);
})


app.post("/login", function (req, res) {
  let loginemail = req.body.loginemail; // get the entered email
  let loginpassword = req.body.loginpassword; //get the entered password
  let userID = findUserByEmail(loginemail, users); //returns user id
  let passwordCheck = checkPassword(loginemail, loginpassword, users);

  if (userID && passwordCheck) {
    res.cookie('user_id', userID);
  } else {
    res.status(403).send("Invalid email or password combination.");
  }
  res.redirect("/urls");
});



app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})

app.get("/register", (req, res) => {
  const id = req.cookies.user_id;
  const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
  let templateVars = { user };
  res.render("registration", templateVars);

})

app.post("/register", function (req, res) {
  const { email, password } = req.body;
  //if email or password input is blank throw an error
  if (email === "" || password === "") {
    res.status(400).send("An email or password needs to be entered.")
    return
    //if email is already in use throw an error 
  } else if (findUserByEmail(email, users)) {
    res.status(400).send("Email is already in use.")
    return
  } else {
    //if the email is not in use, create a new user for TinyApp
    let userID = generateRandomString();
    users[userID] = {
      id: userID,
      email: email,
      password: password
    }
    res.cookie("user_id", userID);
    res.redirect("/urls");
    console.log(users);
  }
});


// DATABASE FOR THE USERS
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}