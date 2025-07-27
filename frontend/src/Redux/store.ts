import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './Slice/AuthSlice'

const store = configureStore({
  reducer: {
    auth: authSliceReducer
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export default store;