import { validationResult } from 'express-validator';

export function validateRequest(req, res, next) {
  validationResult(req).throw();
  next();
}
