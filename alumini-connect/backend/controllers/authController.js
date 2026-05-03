const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "default_secret_key",
    { expiresIn: "7d" }
  );

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      graduationYear,
      company,
      course,
      institution,
      location,
      bio,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      graduationYear,
      company,
      course,
      institution,
      location,
      bio,
    });
    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        graduationYear: user.graduationYear,
        company: user.company,
        course: user.course,
        institution: user.institution,
        location: user.location,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        graduationYear: user.graduationYear,
        company: user.company,
        course: user.course,
        institution: user.institution,
        location: user.location,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        graduationYear: user.graduationYear,
        company: user.company,
        course: user.course,
        institution: user.institution,
        location: user.location,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "course",
      "institution",
      "company",
      "graduationYear",
      "location",
      "bio",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    });

    if (!updates.name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        graduationYear: user.graduationYear,
        company: user.company,
        course: user.course,
        institution: user.institution,
        location: user.location,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
