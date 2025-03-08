const exp = require("express")
const userApp = exp.Router();
const UserAuthor = require("../models/userAuthorModel")
const expressAsyncHandler = require("express-async-handler")
const createUserOrAuthor = require("../APIs/createUserOrAuthor")
const Article = require("../models/articleModel")
//API
//create new user
userApp.post("/user", expressAsyncHandler(createUserOrAuthor))

//post comment
userApp.put("/comment/:articleId", expressAsyncHandler(async (req, res) => {
  const commentObj = req.body;

  const articleWithComment = await Article.findOneAndUpdate(
    { articleId: req.params.articleId },
    { $push: { comments: commentObj } },
    { new: true } // Ensures the updated document is returned
  );
  res.status(200).send({ message: "Comment added", payload: articleWithComment });
}));

//fetch all users
userApp.get("/users", expressAsyncHandler(async (req, res) => {
  const userId = req.headers.authorization?.split(" ")[1]
  const users = await UserAuthor.find({ _id: { $ne: userId }, role: { $ne: 'admin' } }).select("-password");
  res.status(200).send({ message: "Users fetched successfully", payload: users });
}))

module.exports = userApp;