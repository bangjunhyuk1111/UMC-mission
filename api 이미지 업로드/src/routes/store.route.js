// src/routes/store.route.js

import express from "express";
import asyncHandler from 'express-async-handler';

import { reviewPreview } from "../controllers/store.controller.js";
import { imageUploader } from "../middleware/image.uploader.js";
import { addReview } from "../controllers/store.controller.js";
export const storeRouter = express.Router({mergeParams: true});

storeRouter.post('/review', imageUploader.single('image'), asyncHandler(addReview));
storeRouter.get('/reviews', asyncHandler(reviewPreview));