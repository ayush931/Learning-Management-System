import { Router } from 'express';
import {
  addLectureToCourseId,
  createCourse,
  getAllCourses,
  getCourseByCourseId,
  getLecturesByCourseId,
  removeCourse,
  updateCourse,
} from '../controllers/course.controller';
import { authorizedRole, authorizedSubscriber, isLoggedIn } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';

const courseRouter = Router();

courseRouter
  .route('/')
  .get(isLoggedIn, getAllCourses)
  // only access through admin
  .post(isLoggedIn, authorizedRole('ADMIN'), upload.single('thumbnail'), createCourse);

courseRouter
  .route('/:id')
  // only access through subscriber
  .get(isLoggedIn, authorizedSubscriber, getLecturesByCourseId)
  // only access through admin
  .put(isLoggedIn, authorizedRole('ADMIN'), updateCourse)
  // only access through admin
  .delete(isLoggedIn, authorizedRole('ADMIN'), removeCourse)
  // only access through admin
  .post(isLoggedIn, authorizedRole('ADMIN'), upload.single('lecture'), addLectureToCourseId);

courseRouter.get('/getCourse/:id', isLoggedIn, getCourseByCourseId);

export default courseRouter;
