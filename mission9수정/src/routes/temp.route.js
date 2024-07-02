// temp.route.js

import express from 'express';
import { tempTest } from '../controllers/temp.controller.js';

export const tempRouter = express.Router();

import { tempException } from '../controllers/temp.controller.js';

tempRouter.get('/test', tempTest);

tempRouter.get('/exception/:flag',tempException);