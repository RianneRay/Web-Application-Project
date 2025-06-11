import { Request, Response } from 'express';
import { RequestModel } from '../models/request.model';
import { UserModel } from '../models/user.model';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalStudents = await UserModel.countDocuments({ role: 'student' });
    const totalRequests = await RequestModel.countDocuments();
    const recentRequests = await RequestModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name email');

    res.json({ stats: { totalStudents, totalRequests }, recentRequests });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err });
  }
};

export const getRecentRequests = async (req: Request, res: Response) => {
  try {
    const recentRequests = await RequestModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name email');

    res.status(200).json(recentRequests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recent requests', error: err });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const studentCount = await UserModel.countDocuments({ role: 'student' });
    const requestCount = await RequestModel.countDocuments();

    res.status(200).json({ studentCount, requestCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find().populate('studentId', 'name email');
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests', error: err });
  }
};

export const approveRequest = async (req: Request, res: Response) => {
  try {
    const request = await RequestModel.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'Approved';
    await request.save();
    res.status(200).json({ message: 'Request approved', request });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve request', error: err });
  }
};

export const declineRequest = async (req: Request, res: Response) => {
  try {
    const request = await RequestModel.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'Declined';
    await request.save();
    res.status(200).json({ message: 'Request declined', request });
  } catch (err) {
    res.status(500).json({ message: 'Failed to decline request', error: err });
  }
};

export const markReady = async (req: Request, res: Response) => {
  try {
    const request = await RequestModel.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'Ready';
    await request.save();
    res.status(200).json({ message: 'Marked as ready for pickup', request });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err });
  }
};