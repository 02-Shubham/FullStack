import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/appError.js';

const buildTaskWhere = ({ userId, completed, search }) => {
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (completed !== undefined) {
    where.completed = completed;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
};

const selectTask = {
  id: true,
  title: true,
  description: true,
  completed: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
};

export const listTasks = async ({ userId, page, limit, completed, search }) => {
  const where = buildTaskWhere({ userId, completed, search });
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: selectTask,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const listAllTasks = async ({ page, limit, completed, search }) => {
  const where = buildTaskWhere({ completed, search });
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        ...selectTask,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async ({ id, user }) => {
  const task = await prisma.task.findUnique({
    where: { id },
    select: selectTask,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (user.role !== 'ADMIN' && task.userId !== user.id) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

export const createTask = async ({ userId, title, description, completed }) => {
  return prisma.task.create({
    data: {
      title,
      description,
      completed,
      userId,
    },
    select: selectTask,
  });
};

export const updateTask = async ({ id, userId, data }) => {
  const existingTask = await prisma.task.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!existingTask || existingTask.userId !== userId) {
    throw new AppError('Task not found', 404);
  }

  return prisma.task.update({
    where: { id },
    data,
    select: selectTask,
  });
};

export const deleteTask = async ({ id, userId }) => {
  const existingTask = await prisma.task.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!existingTask || existingTask.userId !== userId) {
    throw new AppError('Task not found', 404);
  }

  await prisma.task.delete({ where: { id } });
};
