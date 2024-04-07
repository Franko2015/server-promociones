import { Router } from 'express';
import { validate, reset } from '../controller/email.controller.js'

const router = Router();

router.post('/api/recover', validate);
router.post('/api/reset/', reset);

export const Email = router;