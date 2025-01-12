const express = require('express');
const { registerUser, activateUser, loginUser, getUserData, forgotUserPassword, resetPassword } = require('../controllers/userController');
const activateUserMiddleWare = require('../middlewares/activateUser');
const userAuth = require('../middlewares/auth');
const userRouter = express.Router();


//Register Route
userRouter.post('/register', registerUser);

//Activate user Route
userRouter.get("/activate/:token", activateUserMiddleWare, activateUser);


//Login Route
userRouter.post("/login", loginUser);

//Get user Data route
userRouter.get("/get-user-data",userAuth, getUserData);


//Forgot password route
userRouter.post("/forgot-password", forgotUserPassword);


//Reset password Route
userRouter.post("/reset-password/:resetToken", resetPassword);
module.exports  = userRouter;