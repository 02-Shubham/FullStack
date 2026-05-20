import { loginUser, registerUser } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    return sendSuccess(res, 201, 'User registered successfully', data);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    return sendSuccess(res, 200, 'Login successful', data);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  return sendSuccess(res, 200, 'Authenticated user fetched successfully', {
    user: req.user,
  });
};
