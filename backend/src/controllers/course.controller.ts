import { NextFunction, Request, Response } from 'express';
import Course from '../models/course.model';
import AppError from '../utils/error.util';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

type RequestMethod = (req: Request, res: Response, next: NextFunction) => any;

const getAllCourses: RequestMethod = async (req, res, next) => {
  try {
    // getting all the courses excluding the lectures
    const courses = await Course.find({}).select('-letures');

    return res.status(200).json({
      success: true,
      message: 'Courses details',
      courses,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const getLecturesByCourseId: RequestMethod = async (req, res, next) => {
  try {
    // getting the user id through params
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Provide course id', 400));
    }

    // finding course through the the id
    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError('Course is not available', 400));
    }

    return res.status(200).json({
      success: true,
      message: 'Available course lectures',
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const getCourseByCourseId: RequestMethod = async (req, res, next) => {
  try {
    // getting the id through params
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Provide course id', 400));
    }

    // finding the course through the id
    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError('Course not available', 400));
    }

    return res.status(200).json({
      success: true,
      message: 'Course detail',
      course,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const createCourse: RequestMethod = async (req, res, next) => {
  try {
    // getting the details through body
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError('Provide all the details', 400));
    }

    // creating the new course into the database
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: 'Dummy',
        secure_url: 'Dummy',
      },
    });

    if (!course) {
      return next(new AppError('Course could not created, please try again', 400));
    }

    // uploading the photo into the cloudinary
    try {
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms',
        });

        if (result) {
          if (course.thumbnail) {
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url;
          }
        }
        // deleting the file from local folder after the uploading in cloudinary
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError(String(error), 500));
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const updateCourse: RequestMethod = async (req, res, next) => {
  try {
    // getting the course id through params
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Provide the user id', 400));
    }

    // finding the course through id and updating it
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body, // upadte any data that is being given in the body by the user
      },
      {
        runValidators: true, // check the mongoose validation before saving the data
      }
    );

    if (!course) {
      return next(new AppError('Course with given id does not exists', 400));
    }

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const removeCourse: RequestMethod = async (req, res, next) => {
  try {
    // getting the course id through params
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Provide the course id', 400));
    }

    // finding the course with id
    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError('Course with given id is not available', 400));
    }

    // deleting the course of given id
    await Course.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Course deleted with provided id',
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const addLectureToCourseId: RequestMethod = async (req, res, next) => {
  try {
    // getting the details through request
    const { title, description } = req.body;
    const { id } = req.params;

    if (!title || !description) {
      return next(new AppError('Provide all the details to create lecture', 400));
    }

    if (!id) {
      return next(new AppError('Provide the course id', 400));
    }

    // finding the course through the id
    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError('Course with the given id does not exists', 400));
    }

    // updating the data in this variable
    const lectureData = {
      title,
      description,
      lecture: {
        public_id: 'Dummy',
        secure_url: 'Dummy',
      },
    };

    // uploading the file in the cloudinary
    try {
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms',
        });

        if (result) {
          lectureData.lecture.public_id = result.public_id;
          lectureData.lecture.secure_url = result.secure_url;
        }

        // deleting the photo from the local system after uploading
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError(String(error), 500));
    }

    // push the data from the above variable to the course module
    course.lectures.push(lectureData);

    // giving the total number of the lectures created
    course.numberOfLectures = course.lectures.length;

    await course.save();

    return res.status(200).json({
      success: true,
      message: 'Lecture created successfully',
      course,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  getCourseByCourseId,
  addLectureToCourseId,
};
