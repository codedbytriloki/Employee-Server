import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: "Token Not Provided" })
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: "Token Not Provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_Key);
    if (!decoded) {
      return res.status(401).json({ success: false, error: "Token Not Valid" })
    }
    const user = await User.findOne({ _id: decoded._id }).select('-password')
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }
    req.user = user
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(500).json({ success: false, error: "server error" })
  }
}

export default verifyUser;