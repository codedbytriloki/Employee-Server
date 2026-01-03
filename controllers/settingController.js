import User from "../models/User.js";
import bcrypt from 'bcrypt';

const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const id = req.user && req.user._id ? req.user._id : userId;
    if (!id) {
      return res.status(400).json({ success: false, error: "User id not provided" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Wrong old password" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashPassword });

    const updatedUser = await User.findById(id).select('-password');
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    return res.status(200).json({ success: true, token, user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "setting server error" });
  }
}

export { changePassword };