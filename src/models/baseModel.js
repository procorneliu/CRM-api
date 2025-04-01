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
    const query = `SELECT * FROM ${this.tableName} WHERE id = ${id};`;

    const document = await querySQL(query);

    return document.rows[0];
  }

  // Create a new document
  async create(name, email, password, role) {
    const query = `INSERT INTO ${this.tableName}(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *`;
    const values = [name, email, password, role];

    const newDocument = await querySQL(query, values);

    return newDocument.rows[0];
  }

  // Update document
  async update(id, body) {
    const { name, email, password, role } = body;
    // filtering body from unwanted values
    const filteredBody = Object.fromEntries(Object.entries({ name, email, password, role }).filter(([_, v]) => v));

    // create a query string from body content
    const valuesToChange = Object.entries(filteredBody).reduce((acc, currentValue) => {
      acc.push(`${currentValue[0]} = '${currentValue[1]}'`);
      return acc;
    }, []);

    const query = `UPDATE ${this.tableName} SET ${valuesToChange.join(', ')} WHERE id = ${id} RETURNING *`;
    const updatedDocument = await querySQL(query);

    return updatedDocument.rows[0];
  }

  // Delete document
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ${id}`;
    await querySQL(query);
  }
}

export default BaseModel;
