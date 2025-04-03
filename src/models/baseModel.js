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

  // Get all data from table
  async findAll() {
    // creating query string
    const query = `SELECT secure_select('${this.tableName}')`;

    // making request
    const documents = await querySQL(query);

    // returning all documents;
    return documents.rows[0].secure_select;
  }

  // Get a specific row from table based on ID
  async findOne(id) {
    // creating query string
    const query = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;

    // making request
    const document = await querySQL(query);

    // if password was not changed don't show in response
    if (document.rows[0].password_changed_at === null) document.rows[0].password_changed_at = undefined;

    // returning document
    return document.rows[0];
  }

  // Create a new document
  async create(bodyData) {
    // Encrypt password if creating a new user manually as an admin
    if (bodyData.password) {
      bodyData.password = await bcrypt.hash(bodyData.password, 12);
    }
    // fixing single quote error
    const singleQuotesFix = this.fixSingleQuote(bodyData);

    // creating strings for what columns with what values to set
    const columnKeys = Object.keys(singleQuotesFix).join(', ');
    const columnValues = Object.values(singleQuotesFix)
      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
      .join(', ');

    // creating query string
    const query = `INSERT INTO ${this.tableName}(${columnKeys}) VALUES(${columnValues}) RETURNING *`;

    // making request
    const newDocument = await querySQL(query);

    // hide sensitive data
    newDocument.rows[0].password = undefined;
    newDocument.rows[0].password_changed_at = undefined;

    // returning newly created document data
    return newDocument.rows[0];
  }

  // Update document
  async update(id, body) {
    // filtering body from sensitive data
    const filteredBody = Object.fromEntries(Object.entries({ ...body }).filter(([_, v]) => v));

    // prevent error when using single quotes in SQL query
    const singleQuotesFix = this.fixSingleQuote(filteredBody);

    // create a query string from body content
    const valuesToChange = Object.entries(singleQuotesFix).reduce((acc, currentValue) => {
      acc.push(`${currentValue[0]} = '${currentValue[1]}'`);
      return acc;
    }, []);

    // creating query string
    const query = `UPDATE ${this.tableName} SET ${valuesToChange.join(', ')} WHERE id = ${id} RETURNING *`;
    // making request
    const updatedDocument = await querySQL(query);

    // hide sensitive data
    updatedDocument.rows[0].password = undefined;

    // return updated document data
    return updatedDocument.rows[0];
  }

  // Delete document
  async delete(id) {
    // creating query string
    const query = `DELETE FROM ${this.tableName} WHERE id = ${id}`;

    // making request
    await querySQL(query);
  }
}

export default BaseModel;
