import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '../feature/auth/authSlice'

export default configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
})