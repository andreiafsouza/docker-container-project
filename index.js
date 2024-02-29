const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// MySQL connection configuration
const dbConfig = {
  host: "mysql-container", // Use the service name defined in docker-compose.yml
  user: "root",
  password: "",
  database: "nodedocker",
};

const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Create a table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;

connection.query(createTableQuery, (err, results) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table 'users' created or already exists");
  }
});

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Register User
app.post("/register", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  // Hash the password using bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  data.password = hashedPassword; // Replace the original password with the hashed one

  // Insert user into the MySQL database
  const insertUserQuery = "INSERT INTO users SET ?";
  connection.query(insertUserQuery, data, (err, results) => {
    if (err) {
      console.error("Error inserting user:", err);
      res.send("An error occurred during registration.");
    } else {
      console.log("User inserted successfully:", results);
      res.render("home");
    }
  });
});

// Login user
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Retrieve user from the MySQL database
  const getUserQuery = "SELECT * FROM users WHERE name = ?";
  connection.query(getUserQuery, [username], async (err, results) => {
    if (err) {
      console.error("Error retrieving user:", err);
      res.send("An error occurred during login.");
    } else if (results.length === 0) {
      res.send("User name does not exist");
    } else {
      const isPasswordMatch = await bcrypt.compare(password, results[0].password);
      if (isPasswordMatch) {
        res.render("home");
      } else {
        res.send("Wrong Password");
      }
    }
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
