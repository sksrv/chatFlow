import User from "../models/User.js";

//Get all users except the logged-in user
//GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("-password")
      .sort({ isOnline: -1, name: 1 });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
