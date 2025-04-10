const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "happycamper",
    password: "password",
  },
];

const userExists = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  const accessToken = jwt.sign({ username }, "JWT_SECRET", { expiresIn: "1h" });

  req.session.authorization = {
    accessToken,
    username,
  };
  return res
    .status(200)
    .json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookISBN = req.params.isbn;
  const username = req.session.authorization.username;
  const bookByISBN = books[bookISBN];
  const reviewContent = req.body.review;

  if (!reviewContent) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (!bookByISBN) {
    return res.status(404).json({ message: `Book ${bookISBN} not found.` });
  }

  bookByISBN.reviews[username] = reviewContent;

  return res
    .status(200)
    .json({
      message: "Review added/updated successfully",
      reviews: bookByISBN
    });
});

regd_users.delete("/auth/review/:isbn/delete", (req, res) =>{
  const bookISBN = req.params.isbn;
  const username = req.session.authorization.username;
  const bookByISBN = books[bookISBN];

  if (!bookByISBN) {
    return res.status(404).json({ message: `Book ${bookISBN} not found.` });
  }

  if (!bookByISBN.reviews[username]){
    return res.status(404).json({ message: `You haven't reviewed ${bookByISBN.title} yet.` });
  }

  delete bookByISBN.reviews[username];

  return res.status(200).json({message: `Review of ${bookByISBN.title} was deleted successfully.`})

})


module.exports.authenticated = regd_users;
module.exports.userExists = userExists;
module.exports.users = users;
