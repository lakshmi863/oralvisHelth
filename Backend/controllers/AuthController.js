import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // ✅ Register
  register = async (req, res) => {
    try {
      const { email, password, role } = req.body;
      console.log("📥 Incoming register:", { email, role });

      if (!email || !password || !role) {
        return res.status(400).json({ error: "All fields required" });
      }

      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔑 now matches UserModel
      await this.userModel.createUser(email, hashedPassword, role);

      res.json({ message: "User registered successfully" });
    } catch (err) {
      console.error("❌ Register error:", err);
      res.status(500).json({ error: err.message });
    }
  };

  // ✅ Login
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await this.userModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role, // 🔑 frontend depends on this
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}
