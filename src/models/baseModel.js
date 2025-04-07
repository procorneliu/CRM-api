import bcrypt from 'bcryptjs';
import { querySQL } from '../config/db.js';

// General model used for all CRUD operations
// Creating query strings and returning requested data
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // replace all ' with '' to prevent PostgreSQL error
  fixSingleQuote(data) {
    const fixedValues = Object.fromEntries(
      Object.entries(data).map(([key, val]) => {
        // if value type is string
        if (typeof val === 'string') val = val.replaceAll("'", "''");

        return [key, val];
      }),
    );

    return fixedValues;
  }

  // for safe queries, check if table exists
  checkTable() {
    const allowedTables = ['users', 'customers', 'sales', 'interactions', 'reminders'];

    if (!allowedTables.includes(this.tableName)) {
      throw new Error('Invalid table name');
    }
  }

  // Get all data from table
  async findAll() {
    // check table name
    this.checkTable();

    // creating query string
    const query = `SELECT secure_select('${this.tableName}')`;

    // making request
    const documents = await querySQL(query);

    // returning all documents;
    return documents.rows[0].secure_select;
  }

  // Get a specific row from table based on ID
  async findOne(id) {
    // check table name
    this.checkTable();

    // creating query string
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const values = [id];

    // making request
    const document = await querySQL(query, values);

    // if password was not changed don't show in response
    if (document.rows[0].password_changed_at === null) document.rows[0].password_changed_at = undefined;

    // returning document
    return document.rows[0];
  }

  // Create a new document
  async create(bodyData) {
    // check table name
    this.checkTable();

    // Encrypt password if creating a new user manually as an admin
    if (bodyData.password) {
      bodyData.password = await bcrypt.hash(bodyData.password, 12);
    }
    // fixing single quote error
    const singleQuotesFix = this.fixSingleQuote(bodyData);

    // creating strings for what columns with what values to set
    const keys = Object.keys(singleQuotesFix);
    const values = Object.values(singleQuotesFix);

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columnKeys = keys.join(', ');

    // creating query string
    const query = `INSERT INTO ${this.tableName}(${columnKeys}) VALUES(${placeholders}) RETURNING *`;

    // making request
    const newDocument = await querySQL(query, values);

    // hide sensitive data
    newDocument.rows[0].password = undefined;
    newDocument.rows[0].password_changed_at = undefined;

    // returning newly created document data
    return newDocument.rows[0];
  }

  // Update document
  async update(id, body) {
    // check table name
    this.checkTable();

    if (!body) throw new Error('No data provided!');

    // filtering body from sensitive data
    const filteredBody = Object.fromEntries(Object.entries({ ...body }).filter(([_, v]) => v));

    // ecrypt and set password_changed_at to now if updating password
    if (filteredBody.password) {
      // ecrypt
      filteredBody.password = await bcrypt.hash(filteredBody.password, 12);

      // set password_changed_at to now
      filteredBody.password_changed_at = new Date(Date.now()).toLocaleString();
    }

    // prevent error when using single quotes in SQL query
    const singleQuotesFix = this.fixSingleQuote(filteredBody);

    // create a query string from body content
    const keys = Object.keys(singleQuotesFix);
    const columnsToChange = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map((key) => singleQuotesFix[key]);
    values.push(id); // Add ID as last parameter

    // creating query string
    const query = `UPDATE ${this.tableName} SET ${columnsToChange} WHERE id = $${values.length} RETURNING *`;

    // making request
    const updatedDocument = await querySQL(query, values);

    // hide sensitive data
    updatedDocument.rows[0].password = undefined;

    // return updated document data
    return updatedDocument.rows[0];
  }

  // Delete document
  async delete(id) {
    // check table name
    this.checkTable();

    // creating query string
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const values = [id];

    // making request
    await querySQL(query, values);
  }
}

export default BaseModel;
