import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";

export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid Email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should contain atleast 6 characters" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    let token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log("registration error");
    return res.status(500).json({ message: `registration error : ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User is not Found" });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    let token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ message: "login successfull" });
  } catch (error) {
    console.log("registration error");
    return res.status(500).json({ message: `login error : ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout successfull" });
  } catch (error) {
    console.log("logout error");
    return res.status(500).json({ message: `logout error : ${error}` });
  }
};
