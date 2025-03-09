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
  try {
    const commentObj = req.body;
    const articleId = req.params.articleId;

    // Validate comment object
    if (!commentObj.comment || !commentObj.nameOfUser) {
      return res.status(400).send({ 
        message: "Comment and user name are required",
        error: "Missing required fields" 
      });
    }

    // Create a clean comment object that exactly matches the schema
    const newComment = {
      nameOfUser: commentObj.nameOfUser,
      comment: commentObj.comment
    };
    
    // First find the article to confirm it exists
    const article = await Article.findOne({ articleId: articleId });
    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }

    const articleWithComment = await Article.findOneAndUpdate(
      { articleId: articleId },
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!articleWithComment) {
      return res.status(500).send({ message: "Failed to update article with comment" });
    }

    res.status(200).send({ message: "comment added", payload: articleWithComment });
  } catch (error) {
    res.status(500).send({ 
      message: "Failed to add comment", 
      error: error.message 
    });
  }
}));

//fetch all users
userApp.get("/users", expressAsyncHandler(async (req, res) => {
  const userId = req.headers.authorization?.split(" ")[1]
  const users = await UserAuthor.find({ _id: { $ne: userId }, role: { $ne: 'admin' } }).select("-password");
  res.status(200).send({ message: "Users fetched successfully", payload: users });
}))

module.exports = userApp;