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
import { authorizedRole, isLoggedIn } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';

const courseRouter = Router();

courseRouter
  .route('/')
  .get(isLoggedIn, getAllCourses)
  .post(isLoggedIn, authorizedRole('ADMIN'), upload.single('thumbnail'), createCourse);

courseRouter
  .route('/:id')
  .get(isLoggedIn, getLecturesByCourseId)
  .put(isLoggedIn, authorizedRole('ADMIN'), updateCourse)
  .delete(isLoggedIn, authorizedRole('ADMIN'), removeCourse)
  .post(isLoggedIn, authorizedRole('ADMIN'), upload.single('lecture'), addLectureToCourseId);

courseRouter.get('/getCourse/:id', isLoggedIn, getCourseByCourseId);

export default courseRouter;
