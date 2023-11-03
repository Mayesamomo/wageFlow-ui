import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getClientInvoices,
    getWeeklyEarnings
} from '../../api/index';

//@desc initial state
const initialState = {
    invoices: [],
    status: 'idle',
    error: null,
  };
  
  //@desc fetch invoice
  export const fetchInvoicesAsync = createAsyncThunk('invoices/fetchInvoices', async () => {
    const response = await fetchInvoices();
    return response;
  });

 
  
  //@desc create invoice
  export const createInvoiceAsync = createAsyncThunk('invoices/createInvoice', async (invoice) => {
    const response = await createInvoice(invoice);
    return response;
  });
  
  //@desc update invoice
  export const updateInvoiceAsync = createAsyncThunk('invoices/updateInvoice', async ({ id, invoice }) => {
    const response = await updateInvoice(id, invoice);
    return response;
  });
  
  //@desc delete invoice
  export const deleteInvoiceAsync = createAsyncThunk('invoices/deleteInvoice', async (id) => {
    const response = await deleteInvoice(id);
    return response;
  });

  //@desc get client's invoices
  export const fetchInvoiceByIdAsync = createAsyncThunk('invoices/fetchInvoiceById', async (id) => { 
    const response = await fetchInvoice(id);
    return response;
    });

    //@desc get client's invoices
    export const getClientInvoicesAsync = createAsyncThunk('invoices/getClientInvoices', async (id) => {
        const response = await getClientInvoices(id);
        return response;
    });

    //@desc get invoice's monthly earnings

    export const getWeeklyEarningsAsync = createAsyncThunk('invoices/getWeeklyEarnings', async () => {
        const response = await getWeeklyEarnings();
        return response;
    });

  const invoiceSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchInvoicesAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchInvoicesAsync.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.invoices = action.payload;
        })
        .addCase(fetchInvoicesAsync.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(createInvoiceAsync.fulfilled, (state, action) => {
          state.invoices.push(action.payload);
        })
        .addCase(updateInvoiceAsync.fulfilled, (state, action) => {
          const updatedIndex = state.invoices.findIndex((invoice) => invoice.id === action.payload.id);
          if (updatedIndex !== -1) {
            state.invoices[updatedIndex] = action.payload;
          }
        }).addCase(fetchInvoiceByIdAsync.fulfilled, (state, action) => {
            state.invoices = action.payload;

        }).addCase(getClientInvoicesAsync.fulfilled, (state, action) => {
            state.invoices = action.payload;

        }).addCase(getWeeklyEarningsAsync.fulfilled, (state, action) => {
            state.invoices = action.payload;
        })
        .addCase(deleteInvoiceAsync.fulfilled, (state, action) => {
          state.invoices = state.invoices.filter((invoice) => invoice.id !== action.payload.id);
        });
    },
  });
  
  export default invoiceSlice.reducer;