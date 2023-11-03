// @desc: Redux store for the application
import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './reducers/clientSlice';
import invoiceReducer from './reducers/invoiceSlice';
import userReducer from './reducers/authSlice';

const store = configureStore({
    reducer: {
        clients: clientReducer,
        invoices: invoiceReducer,
        users: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true,
});

export default store;
