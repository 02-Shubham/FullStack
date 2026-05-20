import { Router } from 'express';
import {
  createMyTask,
  deleteMyTask,
  getAllTasksForAdmin,
  getMyTasks,
  getTask,
  updateMyTask,
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} from '../validations/task.validation.js';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: List authenticated user's tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 */
router.get('/', validate(listTasksSchema), getMyTasks);

/**
 * @openapi
 * /tasks/admin/all:
 *   get:
 *     summary: List all tasks as an admin
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All tasks fetched successfully
 *       403:
 *         description: Admin role required
 */
router.get('/admin/all', requireRole('ADMIN'), validate(listTasksSchema), getAllTasksForAdmin);

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish internship assignment
 *               description:
 *                 type: string
 *                 example: Build Commit 2 task APIs
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', validate(createTaskSchema), createMyTask);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by id
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       404:
 *         description: Task not found
 */
router.get('/:id', validate(taskIdSchema), getTask);

/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     summary: Update an owned task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.patch('/:id', validate(updateTaskSchema), updateMyTask);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Delete an owned task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', validate(taskIdSchema), deleteMyTask);

export default router;
