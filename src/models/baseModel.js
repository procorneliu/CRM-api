import bcrypt from 'bcryptjs';
import { querySQL } from '../config/db.js';

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // replace all ' with '' to prevent PostgreSQL error
  fixSingleQuote(data) {
    const fixedValues = Object.fromEntries(
      Object.entries(data).map(([key, val]) => {
        if (typeof val === 'string') val = val.replaceAll("'", "''");

        return [key, val];
      }),
    );

    return fixedValues;
  }

  // Get all data from table
  async findAll() {
    // const query = `SELECT * FROM ${this.tableName};`;
    const query = `SELECT secure_select('${this.tableName}')`;

    const documents = await querySQL(query);

    // returning all documents;
    return documents.rows[0].secure_select;
  }

  // Get a specific row from table based on ID
  async findOne(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;

    const document = await querySQL(query);

    // if password was not changed don't show in response
    if (document.rows[0].password_changed_at === null) document.rows[0].password_changed_at = undefined;

    return document.rows[0];
  }

  // Create a new document
  async create(bodyData) {
    // if creating user encrypt password
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

    const query = `INSERT INTO ${this.tableName}(${columnKeys}) VALUES(${columnValues}) RETURNING *`;

    const newDocument = await querySQL(query);

    // hide sensitive data
    newDocument.rows[0].password = undefined;
    newDocument.rows[0].password_changed_at = undefined;

    return newDocument.rows[0];
  }

  // Update document
  async update(id, body) {
    // filtering body from unwanted values
    const filteredBody = Object.fromEntries(Object.entries({ ...body }).filter(([_, v]) => v));
    // prevent error when using single quotes in SQL query
    const singleQuotesFix = this.fixSingleQuote(filteredBody);

    // create a query string from body content
    const valuesToChange = Object.entries(singleQuotesFix).reduce((acc, currentValue) => {
      acc.push(`${currentValue[0]} = '${currentValue[1]}'`);
      return acc;
    }, []);

    const query = `UPDATE ${this.tableName} SET ${valuesToChange.join(', ')} WHERE id = ${id} RETURNING *`;
    const updatedDocument = await querySQL(query);

    // hide sensitive data
    updatedDocument.rows[0].password = undefined;

    return updatedDocument.rows[0];
  }

  // Delete document
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ${id}`;
    await querySQL(query);
  }
}

export default BaseModel;
