const express = require("express");
let books = require("./booksdb.js");
let userExists = require("./auth_users.js").userExists;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (userExists(username)) {
    return res
      .status(409)
      .json({ message: `The username: ${username} already exists` });
  } else {
    users.push({ username, password });
    return res
      .status(201)
      .json({ message: `${username} registered successfully` });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.status(200).json(books);
});

//Get book list using async/await axios
// public_users.get("/", async function (req, res) {
//   try{
//     const response = await axios.get('http://localhost:5000/');
//     return res.status(200).json(response.data);
//   } catch (error){
//     return res.status(500).json({message: "Error fetching book data", error: error.message});
//   }
// });

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  const bookByISBN = books[bookISBN];

  if (bookByISBN) {
    res.status(200).json(bookByISBN);
  } else {
    res.status(404).json({ message: `Book ${bookISBN} not found.` });
  }
});

//Get books by ISBN with async/await axios
// public_users.get("/isbn/:isbn", async function (req, res) {
//   try {
//     const bookISBN = req.params.isbn;
//     const bookByISBN = books[bookISBN];

//     const response = await axios.get(`http://localhost:5000/isbn/${bookISBN}`);

//     if (bookByISBN) {
//       res.status(200).json(response.data);
//     } else {
//       res.status(404).json({ message: `Book ${bookISBN} not found.` });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching book data", error: error.message });
//   }
// });

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const bookByAuthor = Object.values(books).filter((book) =>
    book.author.toLowerCase().includes(author)
  );
  if (bookByAuthor.length > 0) {
    res.status(200).json(bookByAuthor);
  } else {
    res.status(404).json({ message: `Book by ${author} not found.` });
  }
});

//Get books by author using async/await axios
// public_users.get("/author/:author", async function (req, res) {
//   try {
//     const author = req.params.author.toLowerCase();
//     const bookByAuthor = Object.values(books).filter((book) =>
//       book.author.toLowerCase().includes(author)
//     );

//     const response = await axios.get(`http://localhost:5000/author/${author}`);

//     if (bookByAuthor.length > 0) {
//       res.status(200).json(response.data);
//     } else {
//       res.status(404).json({ message: `Book by ${author} not found.` });
//     }
//   } catch (error) {
//         res.status(500).json({ message: "Error fetching book data", error: error.message });
//       }
// });

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title)
  );
  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: `Book with ${title} not found.` });
  }
});

//Get all books by title using async/await axios
// public_users.get("/title/:title", async function (req, res) {
//   try {
//     const title = req.params.title.toLowerCase();
//     const booksByTitle = Object.values(books).filter((book) =>
//       book.title.toLowerCase().includes(title)
//     );

//     const response = await axios.get(`http://localhost:5000/title/${title}`);

//     if (booksByTitle.length > 0) {
//       res.status(200).json(response.data);
//     } else {
//       res.status(404).json({ message: `Book with ${title} not found.` });
//     }
//   } catch (error){
//     res
//       .status(500)
//       .json({ message: "Error fetching book data", error: error.message });
//   }
// });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  const bookByISBN = books[bookISBN];

  if (!bookByISBN) {
    res.status(404).json({ message: `Book ${bookISBN} not found.` });
  }

  if (bookByISBN.reviews && Object.keys(bookByISBN.reviews).length > 0) {
    return res.status(200).json(bookByISBN.reviews);
  } else {
    return res.status(404).json({
      message: `Book with ISBN: ${bookISBN} does not have any reviews yet.`,
    });
  }
});

module.exports.general = public_users;
