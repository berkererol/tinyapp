const generateRandomString = function () {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//Match the given e-mail with the records
const getUserByEmail = function (email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
}


//Validate login by checking email and password combination of a user
const checkPassword = function (email, password, users) {
  for (let user in users) {
    if (users[user].email === email && users[user].password === password) {
      return true;
    }
  }
  return false;
}

const urlsForUser = function (id) {
  let arr = Object.values(urlDatabase) // array of objects with longURL and UserID keys
  let arrayOfURLS = [];
  for (let obj of arr) {
    if (obj.userID === id) {
      arrayOfURLS.push(item.longURL);
    }
  }
  return arrayOfURLS;
}





module.exports = { generateRandomString, getUserByEmail, checkPassword, }
