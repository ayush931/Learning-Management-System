import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helpers/axiosInstance"
import toast from "react-hot-toast"

const initialState = {
  courseData: []
}

export const getAllCourses = createAsyncThunk('/course/get', async () => {
  try {
    const res = axiosInstance.get('/course');
    toast.promise(res, {
      loading: 'Loading courses data...',
      success: 'Courses loaded successfully...',
      error: 'Failed to load course...'
    })

    return (await res).data.courses;
  } catch (error) {
    toast.error(String(error?.response?.data?.message))
  }
})

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCourses.fulfilled, (state, action) => {
        if (action.payload) {
          state.courseData = [...action.payload]
        }
      })
  }
})

export default courseSlice.reducer;