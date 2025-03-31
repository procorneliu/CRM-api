import bcrypt from 'bcryptjs';
import { querySQL } from '../config/db.js';

// Get all from users table
const getAllUsers = async () => {
  const query = 'SELECT id, name, email, role FROM users;';
  const users = await querySQL(query);

  // returning all users;
  return users.rows;
};

// Get a specific row from users table based on ID search
const getUser = async (id) => {
  const query = `SELECT id, email FROM users
                 WHERE id = $1;`;
  const values = [id];

  const user = await querySQL(query, values);

  return user.rows[0];
};

const createUser = async (name, email, password, role) => {
  const query = 'INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING name, email, role';
  const values = [name, email, password, role];

  const newUser = await querySQL(query, values);

  return newUser.rows[0];
};

const updateUser = async (id, body) => {
  const { name, email, password, role } = body;
  const filteredBody = Object.fromEntries(Object.entries({ name, email, password, role }).filter(([_, v]) => v));

  const valuesToChange = Object.entries(filteredBody).reduce((acc, currentValue) => {
    acc.push(`${currentValue[0]} = '${currentValue[1]}'`);
    return acc;
  }, []);

  const query = `UPDATE users SET ${valuesToChange.join(', ')} WHERE id = ${id} RETURNING name, email, role`;

  const updatedUser = await querySQL(query, []);
  return updatedUser.rows[0];
};

const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = ${id}`;
  await querySQL(query);
};

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
const checkPassword = async (candidatePassowrd, correctPassword) => {
  return await bcrypt.compare(candidatePassowrd, correctPassword);
};

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkIfUserExists,
  registerUser,
  checkPassword,
};
