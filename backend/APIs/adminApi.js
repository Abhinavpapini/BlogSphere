const express = require("express");
const adminApp = express.Router();
const UserAuthor = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler");
const { requireAuth } = require("@clerk/express");

// Register first admin (use this only once to create the first admin)
adminApp.post("/register-admin", expressAsyncHandler(async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await UserAuthor.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return res.status(400).send({ message: "Admin already exists" });
    }

    // Create new admin
    const newAdmin = new UserAuthor({
      email,
      firstName,
      lastName,
      role: "admin",
      isActive: true
    });

    const savedAdmin = await newAdmin.save();
    res.status(201).send({ message: "Admin created successfully", admin: savedAdmin });
  } catch (error) {
    res.status(500).send({ message: "Error creating admin", error: error.message });
  }
}));

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
  try {
    // Debug auth information
    console.log('Auth Object:', {
      sessionClaims: req.auth.sessionClaims,
      userId: req.auth.userId,
      session: req.auth.session
    });

    // Get the user's email from Clerk auth - try multiple possible locations
    const userEmail = req.auth.sessionClaims?.email || 
                     req.auth.sessionClaims?.metadata?.email ||
                     req.auth?.claims?.email;

    console.log('Looking for admin with email:', userEmail);
    
    if (!userEmail) {
      return res.status(400).send({ 
        message: "No email found in session claims. Please ensure you're properly logged in.",
        auth: req.auth,
        tip: "Try logging out and logging back in."
      });
    }

    const admin = await UserAuthor.findOne({ 
      email: userEmail,
      role: "admin"
    });
    
    console.log('Found admin:', admin);
    
    if (admin) {
      res.status(200).send(admin);
    } else {
      res.status(404).send({ 
        message: "Admin not found", 
        searchedEmail: userEmail,
        tip: "Make sure the email matches exactly with the one in your database"
      });
    }
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).send({ 
      message: "Error fetching admin profile",
      error: error.message
    });
  }
}));

adminApp.get("/users", requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
  try {
    console.log("\n=== Admin Users Request ===");
    console.log("Headers:", req.headers);
    
    const userEmail = req.auth.sessionClaims?.email || 
                     req.auth.sessionClaims?.metadata?.email ||
                     req.auth?.claims?.email;

    console.log("\nAuth email:", userEmail);
    console.log("Full auth object:", req.auth);

    if (!userEmail) {
      console.log("No email found in session claims");
      return res.status(400).send({ 
        message: "No email found in session claims. Please ensure you're properly logged in."
      });
    }

    const admin = await UserAuthor.findOne({ 
      email: userEmail,
      role: "admin"
    });

    console.log("\nFound admin:", admin ? "Yes" : "No");
    if (admin) {
      console.log("Admin details:", {
        email: admin.email,
        name: `${admin.firstName} ${admin.lastName}`,
        role: admin.role
      });
    }

    if (!admin) {
      console.log("Unauthorized: Not an admin");
      return res.status(403).send({ message: "Unauthorized: Admin access required" });
    }

    const users = await UserAuthor.find({ 
      $and: [
        { role: { $ne: "admin" } },
        { email: { $ne: userEmail } }
      ]
    });
    
    console.log("\nFound users:", users.length);
    console.log("User roles breakdown:", users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {}));

    res.status(200).send(users);
  } catch (error) {
    console.error("\nError in /users endpoint:", error);
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
}));

adminApp.put("/block-unblock/:id", requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
  const userEmail = req.auth.sessionClaims?.email || 
                   req.auth.sessionClaims?.metadata?.email ||
                   req.auth?.claims?.email;

  if (!userEmail) {
    return res.status(400).send({ 
      message: "No email found in session claims. Please ensure you're properly logged in."
    });
  }

  const admin = await UserAuthor.findOne({ 
    email: userEmail,
    role: "admin"
  });

  if (!admin) {
    return res.status(403).send({ message: "Unauthorized: Admin access required" });
  }

  const id = req.params.id;
  const { blocked } = req.body;
  if (blocked === undefined) {
    return res.status(400).send({ message: "Blocked status is required" });
  }
  try {
    const userAuthor = await UserAuthor.findByIdAndUpdate(id, { blocked }, { new: true });
    if (!userAuthor) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: `User ${blocked ? 'blocked' : 'unblocked'} successfully`, payload: userAuthor });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}));

adminApp.get('/unauthorized', (req, res) => {
  res.send({ message: "Unauthorized request" });
});

module.exports = adminApp;
