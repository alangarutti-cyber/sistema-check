import { Router } from 'express';
import healthCheck from './health-check.js';
import companiesRouter from './companies.js';
import unitsRouter from './units.js';
import sectorsRouter from './sectors.js';
import usersRouter from './users.js';

const router = Router();

export default () => {
  router.get('/health', healthCheck);
  router.use('/companies', companiesRouter);
  router.use('/units', unitsRouter);
  router.use('/sectors', sectorsRouter);
  router.use('/users', usersRouter);

  return router;
};
