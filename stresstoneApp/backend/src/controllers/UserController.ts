import User from '../models/User';
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firebaseId, email } = req.body;
    let user = await User.findOne({ firebaseId });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
    }
    user = await User.create({
      firebaseId,
      email
    });

    res.status(201).json({ message: 'User registered in mongodb!', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
