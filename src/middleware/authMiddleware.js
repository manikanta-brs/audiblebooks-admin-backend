import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler";
dotenv.config();

const verifyToken = expressAsyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  console.log("secret keyy", process.env.JWT_SECRET);
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});
export default verifyToken;
