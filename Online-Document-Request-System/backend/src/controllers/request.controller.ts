import { Request, Response } from 'express';
import { RequestModel } from '../models/request.model';
import { UserModel } from '../models/user.model';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.userId;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await UserModel.findById(studentId).select('name email role');

    const recentRequests = await RequestModel.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('documentType purpose status createdAt');

    res.json({ user, recentRequests });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ message: 'Failed to load dashboard data.' });
  }
};

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { documentType, purpose } = req.body;
    const studentId = req.user?.userId;

    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const newRequest = await RequestModel.create({
      studentId,
      documentType,
      purpose,
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error('❌ Error creating request:', err);
    res.status(500).json({ message: 'Failed to create request', error: err });
  }
};

export const getMyRequests = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.userId;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const requests = await RequestModel.find({ studentId });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get requests', error: err });
  }
};

export const updateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.userId;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const request = await RequestModel.findOne({ _id: req.params.id, studentId });

    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'Pending')
      return res.status(400).json({ message: 'Cannot edit after approval/decline' });

    request.documentType = req.body.documentType || request.documentType;
    request.purpose = req.body.purpose || request.purpose;
    await request.save();

    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update request', error: err });
  }
};

export const deleteRequest = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.userId;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const request = await RequestModel.findOne({ _id: req.params.id, studentId });

    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'Pending')
      return res.status(400).json({ message: 'Cannot delete after approval/decline' });

    await request.remove();
    res.status(200).json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete request', error: err });
  }
};