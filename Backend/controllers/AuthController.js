import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // ✅ Register user
  async register(req, res) {
    try {
      const { email, password, role } = req.body;

      // Check if exists
      const existingUser = await this.userModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user
      const newUser = await this.userModel.createUser(
        email,
        hashedPassword,
        role || "Dentist"
      );

      return res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
      });
    } catch (err) {
      console.error("❌ Register error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // ✅ Login user (your existing code, keep it as is but make sure you use getUserByEmail)
  async login(req, res) {
    try {
      console.log("🟢 Login body:", req.body);
      const { email, password } = req.body;

      // Find user
      const user = await this.userModel.getUserByEmail(email);
      console.log("🔎 Found user:", user);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("🔑 Password match:", isMatch);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("✅ Token generated:", token.substring(0, 25) + "...");

      return res.json({
        user: { id: user.id, email: user.email, role: user.role },
        token,
      });
    } catch (err) {
      console.error("❌ Login error:", err);
      return res.status(500).json({ error: "Server error", details: err.message });
    }
  }



  // SIGNUP
  async signup(req, res) {
    try {
      const { email, password, role } = req.body;

      const existingUser = this.userModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userModel.createUser(email, hashedPassword, role);

      return res.status(201).json({
        user: {
          id: newUser.id,
          email,
          role,
        },
      });
    } catch (err) {
      console.error("❌ Signup error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
}
