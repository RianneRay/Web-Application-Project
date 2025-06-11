import { Router } from 'express';
import {
  getDashboardStats,
  getRecentRequests,
  getAdminStats,
  getAllRequests,
  approveRequest,
  declineRequest,
  markReady,
} from '../controllers/admin.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/recent', getRecentRequests);
router.get('/dashboard', getDashboardStats);
router.get('/requests', getAllRequests);
router.patch('/requests/:id/approve', approveRequest);
router.patch('/requests/:id/decline', declineRequest);
router.patch('/requests/:id/ready', markReady);

export default router;