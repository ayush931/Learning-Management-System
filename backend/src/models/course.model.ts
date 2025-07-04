import { model, Schema } from "mongoose";

const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    minLength: [8, 'Title must be atleast 8 characters'],
    maxLength: [60, 'Title should be less than 60 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minLength: [8, 'Description must be atleast 8 characters'],
    maxLength: [300, 'Description should be less than 300 characters'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true
    },
    secure_url: {
      type: String,
      required: true
    }
  },
  lectures: [
    {
      title: String,
      description: String,
      lecture: {
        public_id: {
          type: String,
          required: true
        },
        secure_url: {
          type: String,
          required: true
        }
      }
    }
  ],
  numberOfLectures: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Course = model("Course", courseSchema);
export default Course;