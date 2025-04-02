import bcrypt from 'bcryptjs';
import { querySQL } from '../config/db.js';

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
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

    return document.rows[0];
  }

  // Create a new document
  async create(bodyData) {
    // if creating using encrypt password
    if (bodyData.password) {
      bodyData.password = await bcrypt.hash(bodyData.password, 12);
    }

    const columnKeys = Object.keys(bodyData).join(', ');
    const columnValues = Object.values(bodyData)
      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
      .join(', ');
    const query = `INSERT INTO ${this.tableName}(${columnKeys}) VALUES(${columnValues}) RETURNING *`;

    const newDocument = await querySQL(query);

    // hide sensitive data
    newDocument.rows[0].password = undefined;
    newDocument.rows[0].passwordchangedat = undefined;

    return newDocument.rows[0];
  }

  // Update document
  async update(id, body) {
    // filtering body from unwanted values
    const filteredBody = Object.fromEntries(Object.entries({ ...body }).filter(([_, v]) => v));

    // create a query string from body content
    const valuesToChange = Object.entries(filteredBody).reduce((acc, currentValue) => {
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
