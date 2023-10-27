import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    isLoading: true,
};

export const clientReducer = createReducer(initialState, {  
    clientCreateRequest:(state)=>{
        state.isLoading=true;
       
    },
    clientCreateSuccess:(state,action)=>{
        state.isLoading=false;
        state.client=action.payload;
        state.success = true;
    },
    clientCreateFail:(state,action)=>{
        state.isLoading=false;
        state.error=action.payload;
        state.success = false;
    },


    //@desc get all clients
    getAllclient: (state) => {
        state.isLoading = true;
    },
    getAllclientSuccess: (state, action) => {
        state.isLoading = false;
        state.clients = action.payload;
        state.success = true;
    },
    getAllclientFail: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
    },

    //@desc get client by id
    getClientById: (state) => {
        state.isLoading = true;
    },
    getClientByIdSuccess: (state, action) => {
        state.isLoading = false;
        state.client = action.payload;
        state.success = true;
    },

    getClientByIdFail: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
    },

    //@desc get client's invoices
    getClientInvoices: (state) => {
        state.isLoading = true;
    },

    getClientInvoicesSuccess: (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload;
        state.success = true;
    },

    getClientInvoicesFail: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
    },
 });