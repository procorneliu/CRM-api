import bcrypt from 'bcryptjs';
import { querySQL } from '../config/db.js';

// Registering a new user and saving to DB
const registerUser = async (name, email, password) => {
  const query = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id;';

  // ecrypt password before saving to DB
  const ecryptedPassword = await bcrypt.hash(password, 12);

  const values = [name, email, ecryptedPassword];

  const newUser = await querySQL(query, values);

  return newUser.rows[0];
};

// verifying with user with this email exists, used for loggining
const checkIfUserExists = async (email) => {
  const query = `SELECT id, email, password FROM users
   WHERE email = $1;`;
  const values = [email];

  const user = await querySQL(query, values);

  return user.rows[0];
};

// checking if inserted password is correct
const checkPassword = async (candidatePassword, correctPassword) => {
  return await bcrypt.compare(candidatePassword, correctPassword);
};

// Checking if password was changed after JWT token was issued
const passwordChangedAfter = (passwordChangedAt, JWTTimestamp) => {
  if (passwordChangedAt) {
    // convert time to seconds
    const convertedTime = parseInt(passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < convertedTime;
  }
  // False means password not changed after token was issued
  return false;
};

export default { checkIfUserExists, registerUser, checkPassword, passwordChangedAfter };
