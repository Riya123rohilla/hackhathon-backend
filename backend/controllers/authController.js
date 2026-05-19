const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const mailSender = require("../config/mailSender");

const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

exports.register = async (req, res) => {

  try {

    const { name, email, password, otp} = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (recentOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash( password, 10 );


    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully", user });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare( password, user.password );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    // save refresh token
    user.refreshToken = refreshToken;

    await user.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.sendOtp = async (req, res) => {

  try {

    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    await Otp.create({ email, otp });

    await mailSender( email, "Verification Email", `<h2>Your OTP is ${otp}</h2>` );

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const recentOtp = await Otp.findOne({
      email
    }).sort({
      createdAt: -1
    });

    if (!recentOtp) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    console.log("OTP VERIFIED");

    return res.status(200).json({
      message: "OTP verified"
    });

  } catch (error) {

    console.log("ERROR:", error);

    return res.status(500).json({
      message: error.message
    });

  }

};

exports.refreshToken = async (req, res) => {

  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {

      return res.status(403).json({
        message: "Invalid refresh token"
      });

    }

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken: newAccessToken
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.logout = async (req, res) => {

  try {

    const { refreshToken } = req.body;
    const user = await User.findOne({refreshToken});

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};