import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Internship Task API v1',
    data: {
      health: '/api/v1/health',
      docs: '/api-docs',
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        me: 'GET /api/v1/auth/me',
      },
      tasks: {
        list: 'GET /api/v1/tasks',
        create: 'POST /api/v1/tasks',
        detail: 'GET /api/v1/tasks/:id',
        update: 'PATCH /api/v1/tasks/:id',
        delete: 'DELETE /api/v1/tasks/:id',
        adminList: 'GET /api/v1/tasks/admin/all',
      },
    },
  });
});

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;
