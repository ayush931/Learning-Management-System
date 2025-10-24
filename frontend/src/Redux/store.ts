import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './Slice/AuthSlice'
import courseSliceReducer from './Slice/CourseSlice';

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    courses: courseSliceReducer
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export default store;