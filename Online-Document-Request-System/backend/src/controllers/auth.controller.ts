import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { env_vars } from '../config/envVar';
import bcrypt from 'bcryptjs'

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, env_vars.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = await UserModel.create({ name, email, password, role });
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message || err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email: emailOrUsername, password } = req.body;

  try {
    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { name: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};