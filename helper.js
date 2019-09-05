
//Generate random alphanumeric string composed of 6 characters
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
const findUserByEmail = function (email, database) {
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


module.exports = { generateRandomString, findUserByEmail, checkPassword }
