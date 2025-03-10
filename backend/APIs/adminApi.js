const express = require("express");
const adminApp = express.Router();
const UserAuthor = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler");
const { requireAuth } = require("@clerk/express");

// Create new admin
adminApp.post("/admin", expressAsyncHandler(async (req, res) => {
  const newUserAuthor = req.body;
  const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });
  if (userInDb !== null) {
    if (newUserAuthor.role === userInDb.role) {
      res.status(200).send({ message: newUserAuthor.role, payload: userInDb });
    } else {
      res.status(200).send({ message: "Invalid role" });
    }
  } else {
    let newUser = new UserAuthor(newUserAuthor);
    let newUserOrAuthorDoc = await newUser.save();
    res.status(201).send({ message: newUserOrAuthorDoc.role, payload: newUserOrAuthorDoc });
  }
}));

adminApp.get("/profile", requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
  const admin = await UserAuthor.findOne({ 
    email: req.auth.userId,
    role: "admin"
  })
  
  if (admin) {
    res.status(200).send(admin)
  } else {
    res.status(404).send({ message: "Admin not found" })
  }
}))

adminApp.get("/users", requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
  const admin = await UserAuthor.findOne({ 
    email: req.auth.userId,
    role: "admin"
  })

  if (!admin) {
    return res.status(403).send({ message: "Unauthorized: Admin access required" })
  }

  const users = await UserAuthor.find({ role: { $ne: "admin" } })
  res.status(200).send(users)
}))

adminApp.put("/block-unblock/:id", requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
  const admin = await UserAuthor.findOne({ 
    email: req.auth.userId,
    role: "admin"
  })

  if (!admin) {
    return res.status(403).send({ message: "Unauthorized: Admin access required" })
  }

  const id = req.params.id
  const { blocked } = req.body
  if (blocked === undefined) {
    return res.status(400).send({ message: "Blocked status is required" })
  }
  try {
    const userAuthor = await UserAuthor.findByIdAndUpdate(id, { blocked }, { new: true })
    if (!userAuthor) {
      return res.status(404).send({ message: "User not found" })
    }
    res.status(200).send({ message: `User ${blocked ? 'blocked' : 'unblocked'} successfully`, payload: userAuthor })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}))

adminApp.get('/unauthorized', (req, res) => {
  res.send({ message: "Unauthorized request" });
});

module.exports = adminApp;
