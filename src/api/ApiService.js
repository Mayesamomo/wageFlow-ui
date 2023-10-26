
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    });

    export const login = async (email, password) => {
        const url = `${API_URL}/auth/login`;
        const response = await api.post(url, {
            email,
            password,
        });
        return response.data;
    };
    
    //@desc register user
    //@route POST /api/auth/register

    export const register = async (name, email, password,confirmPassword) => {
        const url = `${API_URL}/auth/register`;
        const response = await api.post(url, {
            name,
            email,
            password,
            confirmPassword,
        });
        return response.data;
    };
    export const logout = async () => {
        const response = await api.post("auth/logout");
        return response.data;
    };
    

    //invoice api calls

    //@desc get all invoices
    //@route GET /api/invoices
    export const getAllInvoices = async () => {
        const url = `${API_URL}/invoices`;
        const response = await api.get(url);
        return response.data;
    };


    //@desc get invoice by id
    //@route GET /api/invoices/:id
    export const getInvoiceById = async (invoiceId) => {
        const url = `${API_URL}/invoices/${invoiceId}`;
        const response = await api.get(url);
        return response.data;
    };

    //@desc get recent invoices
    //@route GET /api/invoices/recent
    export const getRecentInvoices = async () => {
        const url = `${API_URL}/invoices/recent`;
        const response = await api.get(url);
        return response.data;
    };

    //@desc delete invoice by id
    //@route DELETE /api/invoices/:id/
    export const deleteInvoice = async (invoiceId) => {
        const url = `${API_URL}/invoices/${invoiceId}`;
        const response = await api.delete(url);
        return response.data;
    };

    //@desc update invoice
    //@route PUT /api/invoices/:id
    export const updateInvoice = async (invoiceId, updatedInvoiceData) => {
        const url = `${API_URL}/invoices/${invoiceId}`;
        const response = await api.put(url, updatedInvoiceData);
        return response.data;
    };

    //@desc create invoice
    //@route POST /api/invoices
    export const createInvoice = async (invoiceData) => {
        const url = `${API_URL}/invoices`;
        const response = await api.post(url, invoiceData);
        return response.data;
    };