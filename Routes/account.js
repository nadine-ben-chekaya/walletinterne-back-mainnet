const express = require("express");
const accountRoutes = express.Router();
const fs = require("fs");

const dataPath = "./Details/useraccount.json";
// util functions

const saveAccountData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(dataPath, stringifyData);
};

const getAccountData = () => {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

// reading the data
accountRoutes.get("/account", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    res.send(JSON.parse(data));
  });
});

accountRoutes.post("/account/addaccount", (req, res) => {
  console.log("we entered to server api add account");
  var existAccounts = getAccountData();
  //const newAccountId = Math.floor(100000 + Math.random() * 900000);
  console.log("req.body f signup to know where to add pkey", req.body);

  existAccounts.users.push(req.body);
  console.log(existAccounts.users);

  saveAccountData(existAccounts);

  res.status(201).json({ message: "User registered successfully" });
});

//login return name and role
accountRoutes.post("/account/login", (req, res) => {
  console.log("we entered to server api login");
  const { username, password } = req.body;
  const accounts = getAccountData();

  // Find the user based on username
  const user = accounts.users.find((p) => p.username === username);
  console.log("Login, user=", user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Validate password (simple direct comparison, not recommended for production)
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Respond with the user details (name, role, and message)
  res.status(200).json({
    message: "Login successful",
    username: user.username, // Send the user's name
    role: user.role, // Send the user's role (admin or client)
    pkey: user.pkey,
  });
});

// Read - get all accounts from the json file
accountRoutes.get("/account/list", (req, res) => {
  const accounts = getAccountData();
  res.send(accounts.users);
});

// Update - using Put method
accountRoutes.put("/account/:id", (req, res) => {
  var existAccounts = getAccountData();
  fs.readFile(
    dataPath,
    "utf8",
    (err, data) => {
      const accountId = req.params["id"];
      existAccounts[accountId] = req.body;

      saveAccountData(existAccounts);
      res.send(`accounts with id ${accountId} has been updated`);
    },
    true
  );
});

//delete - using delete method
accountRoutes.delete("/account/delete/:id", (req, res) => {
  fs.readFile(
    dataPath,
    "utf8",
    (err, data) => {
      var existAccounts = getAccountData();

      const userId = req.params["id"];
      delete existAccounts[userId];
      saveAccountData(existAccounts);
      res.send(`accounts with id ${userId} has been deleted`);
    },
    true
  );
});
module.exports = accountRoutes;
