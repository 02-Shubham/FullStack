import {
  createTask,
  deleteTask,
  getTaskById,
  listAllTasks,
  listTasks,
  updateTask,
} from '../services/task.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getMyTasks = async (req, res, next) => {
  try {
    const data = await listTasks({
      userId: req.user.id,
      ...req.query,
    });

    return sendSuccess(res, 200, 'Tasks fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getAllTasksForAdmin = async (req, res, next) => {
  try {
    const data = await listAllTasks(req.query);
    return sendSuccess(res, 200, 'All tasks fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await getTaskById({
      id: req.params.id,
      user: req.user,
    });

    return sendSuccess(res, 200, 'Task fetched successfully', { task });
  } catch (error) {
    next(error);
  }
};

export const createMyTask = async (req, res, next) => {
  try {
    const task = await createTask({
      userId: req.user.id,
      ...req.body,
    });

    return sendSuccess(res, 201, 'Task created successfully', { task });
  } catch (error) {
    next(error);
  }
};

export const updateMyTask = async (req, res, next) => {
  try {
    const task = await updateTask({
      id: req.params.id,
      userId: req.user.id,
      data: req.body,
    });

    return sendSuccess(res, 200, 'Task updated successfully', { task });
  } catch (error) {
    next(error);
  }
};

export const deleteMyTask = async (req, res, next) => {
  try {
    await deleteTask({
      id: req.params.id,
      userId: req.user.id,
    });

    return sendSuccess(res, 200, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};
