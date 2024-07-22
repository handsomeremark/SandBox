const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "10.0.11.141",
  user: "devusr",
  password: "a2j?XU4^dU?6DmN@",
  database: "db_practice",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ message: "Server error" });
    } else if (results.length > 0) {
      res.status(200).json({ message: "Login successful", user: results[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

// Registration endpoint
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const checkEmailQuery = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  const insertUserQuery = "INSERT INTO users (email, password, gender) VALUES (?, ?, ?)";

  // Check if email already exists
  db.query(checkEmailQuery, [email], (checkError, checkResults) => {
    if (checkError) {
      console.error("Database query failed:", checkError);
      res.status(500).json({ message: "Server error" });
    } else {
      const emailExists = checkResults[0].count > 0;
      if (emailExists) {
        res.status(400).json({ message: "Email already exists" });
      } else {
        // Insert user if email does not exist
        db.query(
          insertUserQuery,
          [email, password],
          (insertError, insertResults) => {
            if (insertError) {
              console.error("Database insert failed:", insertError);
              res.status(500).json({ message: "Server error" });
            } else {
              res.status(200).json({ message: "Registration successful" });
            }
          }
        );
      }
    }
  });
});

// Endpoint to fetch all users
app.get("/users", (req, res) => {
  const query = "SELECT email FROM users";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ message: "Server error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Update user endpoint
app.put("/users/:email", (req, res) => {
  const userEmail = req.params.email;
  const { email, password } = req.body;
  const updateQuery =
    "UPDATE users SET email = ?, password = ? WHERE email = ?";

  db.query(updateQuery, [email, password, userEmail], (error, results) => {
    if (error) {
      console.error("Database update failed:", error);
      res.status(500).json({ message: "Server error" });
    } else {
      // Check if any rows were affected by the update query
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "User updated successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  });
});

// Delete user endpoint
app.delete("/users/:email", (req, res) => {
  const userEmail = req.params.email;
  const deleteQuery = "DELETE FROM users WHERE email = ?";

  db.query(deleteQuery, [userEmail], (error, results) => {
    if (error) {
      console.error("Database delete failed:", error);
      res.status(500).json({ message: "Server error" });
    } else {
      // Check if any rows were affected by the delete query
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
