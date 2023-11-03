// @desc: Redux slice for user authentication
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUser, loginUser, registerUser, fetchUserById, logoutUser } from '../../api/index'; 

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

export const fetchUserAsync = createAsyncThunk('users/fetchUser', async () => {
  const response = await fetchUser();
  return response;
});

export const loginUserAsync = createAsyncThunk('users/loginUser', async (user) => {
  const response = await loginUser(user);
  return response;
});

export const registerUserAsync = createAsyncThunk('users/registerUser', async (user) => {
  const response = await registerUser(user);
  return response;
});

export const fetchUserByIdAsync = createAsyncThunk('users/fetchUserById', async (id) => {
  const response = await fetchUserById(id);
  return response;
});

export const logoutUserAsync = createAsyncThunk('users/logoutUser', async () => {
  const response = await logoutUser();
  return response;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      }).addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';

      }).addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      }).addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      }).addCase(registerUserAsync.pending, (state) => {
        state.status = 'loading';
      }).addCase(registerUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      }).addCase(registerUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      }).addCase(fetchUserByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      });
  },
});

export default userSlice.reducer;
