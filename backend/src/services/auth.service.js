// import sequelize from "@models/db/postgresProvider.js";
import User from "@models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Sequelize } from "sequelize";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use env var in production

const signup = async ({ username, email, password }) => {
  // Check if user already exists
  console.log({username, email, password})
  const existingUser = await User.findOne({
    where: {
      [Sequelize.Op.or]: [{ username }, { email }],
    },
  });
  if (existingUser) {
    throw new Error("Username or email already in use");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({ username, email, passwordHash });

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

const login = async ({ usernameOrEmail, password }) => {
  // Find user by username or email
  const user = await User.findOne({
    where: {
      [Sequelize.Op.or]: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    // Remove "Bearer " if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

const AuthService = {
  signup,
  login,
  getUserFromToken,
};

export default AuthService;
