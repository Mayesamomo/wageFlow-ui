import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClient, createClient, updateClient, deleteClient } from '../../api/index'; 

const initialState = {
  clients: [],
  status: 'idle',
  error: null,
};

export const fetchClientsAsync = createAsyncThunk('clients/fetchClients', async () => {
  const response = await fetchClient();
  return response;
});

export const createClientAsync = createAsyncThunk('clients/createClient', async (client) => {
  const response = await createClient(client);
  return response;
});

export const updateClientAsync = createAsyncThunk('clients/updateClient', async ({ id, client }) => {
  const response = await updateClient(id, client);
  return response;
});

export const deleteClientAsync = createAsyncThunk('clients/deleteClient', async (id) => {
  const response = await deleteClient(id);
  return response;
});

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClientsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createClientAsync.fulfilled, (state, action) => {
        state.clients.push(action.payload);
      })
      .addCase(updateClientAsync.fulfilled, (state, action) => {
        const updatedIndex = state.clients.findIndex((client) => client.id === action.payload.id);
        if (updatedIndex !== -1) {
          state.clients[updatedIndex] = action.payload;
        }
      })
      .addCase(deleteClientAsync.fulfilled, (state, action) => {
        state.clients = state.clients.filter((client) => client.id !== action.payload.id);
      });
  },
});

export default clientSlice.reducer;
