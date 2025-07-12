import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

export const register = async (req, res, next) => {
  try {
    const { fullname, username, password, email } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const user = await User.create({
      fullname,
      username,
      password: hashedPassword,
      email,
      verificationToken,
      isVerified: false
    });
    // Ethereal Email setup
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    try {
      const info = await transporter.sendMail({
        from: 'Express API <no-reply@ethereal.email>',
        to: email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}">here</a> to verify your email.</p>`
      });
      console.log('Verification email sent to', email);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr);
    }
    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first.' });
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return res.status(400).json({ message: 'Invalid Verification Token' });
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    res.json({ message: 'Email Verified Successfully' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ message: 'Email verification failed', error: err.message });
  }
}; 