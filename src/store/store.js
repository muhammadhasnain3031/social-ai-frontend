import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './authSlice';
import postsReducer    from './postsSlice';
import analyticsReducer from './analyticsSlice';

export const store = configureStore({
  reducer: { auth: authReducer, posts: postsReducer, analytics: analyticsReducer }
});