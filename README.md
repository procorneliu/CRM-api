# CRM API

A simple CRM (customer relationship management) API that includes CRUD operations for users, customers, sales, interactions, reminders.

```
Build with Node.js, Express, and PostgreSQL;
This API is using JWT token for authorization;
```

---

## Setup

1. Clone this repository:

   ```
   git clone https://github.com/procorneliu/CRM-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create 'config.env' file and configure.

   ##### File structure:

   ```
   NODE_ENV=development
   PORT=3000

   DB_HOST=your_database_host_name
   DB_USER=your_database_username
   DB_PORT=your_database_port
   DB_PASSWORD=your_database_password
   DB_NAME=you_database_name

   JWT_SECRET=your_jwt_secret_key
   // Example: number 30d will mean 30 days
   JWT_EXPIRES_IN=your_jwt_expires_in_date
   // Example: number 30 will mean 30 days
   JWT_COOKIES_EXPIRES_IN=your_jwt_cookie_expires_in_date
   ```

4. Set Up the PostgreSQL Database

   > For this we will be using file located in project directory `./database/backup.sql`

   **Step 1:** Open _PostgreSQL_ (for this I'll be using **pgAdmin 4**)
   **Step 2:** Create a new database running this command in _Query Tool_:
   `CREATE DATABASE database_name;`
   **Step 3:** Right-click on created database and then _Restore..._
   **Step 4:** Choose filename or filepath to _backup.sql_
   **Step 5:** Click _Restore_ and that's it

   >

5. Run in terminal command below to start the server:
   ```
   npm start
   ```
   Server will run on http://localhost:3000

---

## API DOCUMENTATION (Postman)

_You can find a full API documentation for this project in the following link:_
[API Documentation - Postman](https://documenter.getpostman.com/view/39477521/2sB2cUAi23)
