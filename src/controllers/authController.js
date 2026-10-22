const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtExpiresIn, jwtSecret } = require("../config/env");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return typeof email === "string" && email.length <= 254 && emailPattern.test(email);
}

function createToken(userId) {
  return jwt.sign({}, jwtSecret, {
    subject: userId.toString(),
    expiresIn: jwtExpiresIn,
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 80 ||
      !isValidEmail(email) ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message:
          "Provide a name (2-80 characters), a valid email, and a password (at least 8 characters and at most 72 bytes).",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      token: createToken(user.id),
      user: publicUser(user),
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!isValidEmail(email) || typeof password !== "string" || password.length === 0) {
      return res.status(400).json({ message: "Provide a valid email and password." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "+passwordHash",
    );
    const passwordMatches =
      user && (await bcrypt.compare(password, user.passwordHash));

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({
      message: "Logged in successfully.",
      token: createToken(user.id),
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { signup, login };
