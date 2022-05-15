const {
  login,
  register,
  getAllUsers,
  logout,
} = require("../controllers/userController");

const authRouter = require("express").Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/allusers/:id", getAllUsers);
authRouter.post("/logout", logout);

module.exports = authRouter;
