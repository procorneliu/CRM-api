import bcrypt from 'bcryptjs';
import { querySQL } from '../config/db.js';

// Some specific functions for only USERS

// Registering a new user and saving to DB
const registerUser = async (name, email, password) => {
  // creating query string
  const query = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id;';

  // ecrypt password before saving to DB
  const ecryptedPassword = await bcrypt.hash(password, 12);

  const values = [name, email, ecryptedPassword];

  // making request
  const newUser = await querySQL(query, values);

  // returning newly registered user data
  return newUser.rows[0];
};

// verifying with user with this email exists, used for loggining
const checkIfUserExists = async (email) => {
  // creating query string
  const query = `SELECT id, name, email, password, role FROM users
   WHERE email = $1;`;

  const values = [email];

  // making request
  const user = await querySQL(query, values);

  // return the found user
  return user.rows[0];
};

// checking if password is correct
const checkPassword = async (candidatePassword, correctPassword) => {
  return await bcrypt.compare(candidatePassword, correctPassword);
};

// checking if password was changed after JWT token was issued
const passwordChangedAfter = (passwordChangedAt, JWTTimestamp) => {
  if (passwordChangedAt) {
    // convert time to seconds
    const convertedTime = parseInt(passwordChangedAt.getTime() / 1000, 10);

    // comparing who is greated and return boolean value
    return JWTTimestamp < convertedTime;
  }
  // False means password not changed after token was issued
  return false;
};

export default { checkIfUserExists, registerUser, checkPassword, passwordChangedAfter };
