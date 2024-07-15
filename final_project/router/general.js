const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//Async Version

public_users.get('/',async function (req, res) {
  const allbooks =await JSON.stringify(books, null, 2)
  return res.status(200).json({
    books: allbooks
  });
});


public_users.get('/isbn/:isbn',async function (req, res) {
  let bookarray = Object.values(books)
  const result = await bookarray.find((book)=> book.isbn === req.params.isbn)
 return res.status(200).json({book: result});
});


// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const authorbooks = Object.values(books)
  const all = await authorbooks.filter((book)=> book.author === req.params.author)
  return res.status(200).json(all);
});



// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const allbooks = Object.values(books)
  const all = await allbooks.filter((book)=> book.title === req.params.title)
  return res.status(200).json(all);
});



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password
  if(!username && !password)  res.status(404).json({message: 'enter credentials'})
  if(isValid(username)) res.status(200).json({message:'User already exists'})
  const user = {
    username:username,
    password:password  
  }
  users.push(user)
  console.log(users)

  return res.status(200).json({message: "Successfully registered",user:user});
});

// // Get the book list available in the shop
// public_users.get('/',async function (req, res) {
//   //Write your code here
//   const allbooks = books
//   return res.status(200).json({
//     books: JSON.stringify(allbooks, null, 2)
//   });
// });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//    let bookarray = Object.values(books)
//    const result = bookarray.find((book)=> book.isbn === req.params.isbn)
//   return res.status(200).json({book: result});
//  });
 
 // Get book details based on ISBN
public_users.get('/review/:isbn',function (req, res) {
  let bookarray = Object.values(books)
  const result = bookarray.find((book)=> book.isbn === req.params.isbn)
  if(Object.keys(result.reviews).length < 0 ) {
    res.status(200).json({message: 'no review exist'})
  }else{
    return res.status(200).json({book: result.reviews});
  }
   
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorbooks = Object.values(books)
  const all = authorbooks.filter((book)=> book.author === req.params.author)
  return res.status(200).json(all);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const allbooks = Object.values(books)
  const all = allbooks.filter((book)=> book.title === req.params.title)
  return res.status(200).json(all);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const reviewarray = Object.values(books)
  const allreview = reviewarray.find((book)=> book.isbn === req.params.isbn)
  const review = allreview.reviews
  if(Object.values(review).length > 0){
    return res.status(200).json({message:'success',review:review});
  }else{
    return res.status(201).json({
      message: 'no reviews exist'
    })
  }
});

module.exports.general = public_users;
