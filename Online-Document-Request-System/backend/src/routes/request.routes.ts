import { Router } from 'express';
import {
  createRequest,
  getMyRequests,
  updateRequest,
  deleteRequest,
  getStudentDashboard
} from '../controllers/request.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', createRequest);
router.get('/dashboard', getStudentDashboard);
router.get('/', getMyRequests);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

export default router;