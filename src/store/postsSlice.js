import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API  = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const getH = (t) => ({ headers: { Authorization: `Bearer ${t}` } });

export const fetchPosts   = createAsyncThunk('posts/fetch',
  async ({ token, params = {} }) => {
    const q = new URLSearchParams(params).toString();
    return (await axios.get(`${API}/api/posts?${q}`, getH(token))).data;
  });

export const createPost   = createAsyncThunk('posts/create',
  async ({ data, token }) => (await axios.post(`${API}/api/posts`, data, getH(token))).data);

export const updatePost   = createAsyncThunk('posts/update',
  async ({ id, data, token }) => (await axios.put(`${API}/api/posts/${id}`, data, getH(token))).data);

export const deletePost   = createAsyncThunk('posts/delete',
  async ({ id, token }) => { await axios.delete(`${API}/api/posts/${id}`, getH(token)); return id; });

export const generatePost = createAsyncThunk('posts/generate',
  async ({ data, token }) => (await axios.post(`${API}/api/ai/generate`, data, getH(token))).data);

export const generateIdeas = createAsyncThunk('posts/ideas',
  async ({ data, token }) => (await axios.post(`${API}/api/ai/ideas`, data, getH(token))).data);

const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [], generated: null, ideas: [], loading: false, aiLoading: false },
  reducers: { clearGenerated: (s) => { s.generated = null; } },
  extraReducers: (b) => {
    b
      .addCase(fetchPosts.pending,     (s) => { s.loading = true; })
      .addCase(fetchPosts.fulfilled,   (s, a) => { s.items = a.payload; s.loading = false; })
      .addCase(createPost.fulfilled,   (s, a) => { s.items.unshift(a.payload); })
      .addCase(updatePost.fulfilled,   (s, a) => { s.items = s.items.map(p => p._id === a.payload._id ? a.payload : p); })
      .addCase(deletePost.fulfilled,   (s, a) => { s.items = s.items.filter(p => p._id !== a.payload); })
      .addCase(generatePost.pending,   (s) => { s.aiLoading = true; })
      .addCase(generatePost.fulfilled, (s, a) => { s.generated = a.payload; s.aiLoading = false; })
      .addCase(generatePost.rejected,  (s) => { s.aiLoading = false; })
      .addCase(generateIdeas.fulfilled,(s, a) => { s.ideas = a.payload.ideas || []; });
  }
});
export const { clearGenerated } = postsSlice.actions;
export default postsSlice.reducer;