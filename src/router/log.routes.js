import { Router } from 'express';
import { getAllLog, postLog } from '../controller/log.controller.js'

const router = Router();

// Get All
router.get('/api/logs', getAllLog);

// Create
router.post('/api/logs', postLog);

export const Logs = router;