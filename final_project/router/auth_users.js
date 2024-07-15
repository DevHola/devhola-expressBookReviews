const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const user = users.filter((user)=> user.username === username)
if(user.length > 0){
  return true
}else{
  return false
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.filter((user)=> user.username === username && user.password === password)
if(user.length > 0) {
  return true
}else{
  return false
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
   const username = req.body.username
   const password = req.body.password
   const data = {
    username:username,
    password:password
   }
   if(!username && !password){
    res.status(404).json({
      message: 'Enter username and password'
    })
   }
   if(authenticatedUser(username,password)){
    const accessToken = jwt.sign(data,'fingerprint_customer',{expiresIn: 60 * 60})
    req.session.authorization = {
      accessToken, username
    }
    res.status(200).json({
      message:'Authenticated'
    })

   }else{
    res.status(208).json({message: 'Inavlid credentials'})
   }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookarray = Object.values(books)
  const book = bookarray.find((book) => book.isbn === req.params.isbn)
  if(Object.keys(book.reviews).length === 0) {
    book.reviews.data = []
    const author = req.session.authorization['username']
    book.reviews.data.push({author:author,usercomment:req.body.comment})
    return res.status(200).json({message: "Review added",book:book});
  }else{
    const author = req.session.authorization['username']
    const checkpastreview = book.reviews.data.filter((review)=> review.author === author )
    if(checkpastreview.length < 0){
    book.reviews.data.push({author:author,usercomment:req.body.comment})
    return res.status(200).json({message: "Review added",book:book});
    }else{
      book.reviews.data[0].usercomment = req.body.comment
      console.log(book.reviews.data)
      return res.status(200).json({message: "Review added",book:book});
    
    }

  }
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
  const bookarray = Object.values(books)
  const book = bookarray.find((book) => book.isbn === req.params.isbn)
  const author = req.session.authorization['username']
  if(Object.keys(book.reviews).length > 0){
    const newbooks = book.reviews.data.filter((review)=> review.author != author )
    if(newbooks) res.status(200).json({message:'review deleted'})
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
