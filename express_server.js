
//import external modules
const express = require("express");
const ejs = require('ejs')
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const methodOverride = require("method-override"); //for changing Edit button's request to PUT request.
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { generateRandomString, findUserByEmail, } = require("./helper");

app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // Enables body-parse
app.set('view engine', 'ejs'); // Enables EJS for rendering the pages

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.example.com", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Urls page that shows user's generated short and long URLs:
app.get("/urls", (req, res) => {
  const id = req.cookies.user_id;
  const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
  if (user) {
    let templateVars = { "urls": isUsersLink(urlDatabase, id), user };
    res.render("urls_index", templateVars);
  } else {
    res.status(403).send("Please login or register first.")
  }
});


// Generate a new short URL from a long URL
app.get("/urls/new", (req, res) => {
  const id = req.cookies.user_id;
  const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
  if (user) {
    let templateVars = { user };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

// Short url page where you can edit long URLs
app.get("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const id = req.cookies.user_id;
  const user = id ? users[id] : null; // check if the cookie already exists with a legit id 
  // let templateVars = { "urls": isUsersLink(urlDatabase, id), user }
  if (user) {
    // let templateVars = { "urls": isUsersLink(urlDatabase, id), user }
    let templateVars = { shortURL, longURL: urlDatabase[shortURL].longURL, user };
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login")
  }
  // res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const { longURL } = req.body;
  const shortURL = generateRandomString();
  const userID = req.cookies.user_id;
  urlDatabase[shortURL] = {
    longURL,
    userID,
  }
  res.redirect(`/urls/${shortURL}`);
});


app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL].longURL;
  console.log(urlDatabase);
  // console.log("ShortURL:", shortURL, "LongURL:", longURL);
  res.redirect(`${longURL}`);
});












// when the delete button on the show /urls page is pressed
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const userID = req.cookies.user_id;
  if (userID) {
    delete urlDatabase[shortURL];
  } else {
    res.send("Unauthorized request");
  }
  res.redirect("/urls");
});


// app.post("/urls/:shortURL", (req, res) => {
//   const { shortURL } = req.params;
//   const { longURL } = req.body;
//   console.log(shortURL, longURL);
//   if (!urlDatabase[shortURL]) {
//     res.send("The shortURL doesn't exist")
//   } else if (urlDatabase[shortURL]) {
//     urlDatabase[shortURL] = longURL;
//     res.redirect(`/urls/${shortURL}`)
//   }
// });


// when the edit buton on the show URL page is pressed
app.put("/urls/:shortURL/edit", (req, res) => {
  const userID = req.cookies.user_id
  const shortURL = req.params.shortURL;
  let usersObj = isUsersLink(urlDatabase, userID);
  //check if shortURL exists for current user:
  if (usersObj[shortURL]) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.render("error", {ErrorStatus: 403, ErrorMessage: "You do not have access to edit this link."});
  }
});




app.get("/login", (req, res) => {
  const id = req.cookies.user_id;
  const user = id ? users[id] : null;
  let templateVars = { user };
  res.render("login", templateVars);
})


app.post("/login", function (req, res) {
  const loginemail = req.body.loginemail; // get the entered email
  const loginpassword = req.body.loginpassword; //get the entered password
  const userID = findUserByEmail(loginemail, users); //returns user id
  const passwordCheck = checkPassword(loginemail, loginpassword, users);
  console.log(passwordCheck);

  if (userID && passwordCheck) {
    res.cookie('user_id', userID);
  } else {
    res.send("Invalid email or password combination.");
  }
  res.redirect("/login");
});



app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
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
      password: bcrypt.hashSync(password, 8)
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


// const urlsForUser = function (id) {
//   let arr = Object.values(urlDatabase) // array of objects with longURL and UserID keys
//   let arrayOfURLS = [];
//   for (let obj of arr) {
//     if (obj.userID === id) {
//       arrayOfURLS.push(obj.longURL);
//     }
//   }
//   return arrayOfURLS;
// }

const isUsersLink = function (object, id) {
  let usersObject = {};
  for (let key in object) {
    if (object[key].userID === id) {
      usersObject[key] = object[key];
    }
  }
  return usersObject;
}

//Validate login by checking email and password combination of a user
const checkPassword = function (loginemail, loginpassword, objectDb) {
  for (let user in objectDb) {
    console.log(objectDb[user]);
    if (objectDb[user].email === loginemail && bcrypt.compareSync(loginpassword, objectDb[user].password)) {
      return true;
    }
  }
  return false;
}


