import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API  = process.env.REACT_APP_API_URL || 'https://social-ai-backend.vercel.app';

export const fetchAnalytics = createAsyncThunk('analytics/fetch',
  async (token) =>
    (await axios.get(`${API}/api/analytics/overview`, { headers: { Authorization: `Bearer ${token}` } })).data);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { data: null, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchAnalytics.pending,   (s) => { s.loading = true; })
      .addCase(fetchAnalytics.fulfilled, (s, a) => { s.data = a.payload; s.loading = false; });
  }
});
export default analyticsSlice.reducer;