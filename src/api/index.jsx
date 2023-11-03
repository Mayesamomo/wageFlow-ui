import axios from "axios";
const api = axios.create({baseURL: import.meta.env.VITE_API_URL});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

//@desc invoices api calls 

export const fetchInvoice=(id)=> api.get(`/invoices/${id}`);
export const fetchInvoices=()=> api.get('/invoices');
export const createInvoice=(invoice)=> api.post('/invoices', invoice);
export const updateInvoice=(id, invoice)=> api.patch(`/invoices/${id}`, invoice);
export const deleteInvoice=(id)=> api.delete(`/invoices/${id}`);
export const getTotals=()=> api.get('/invoices/count');
export const getInvoiceByUser=(searchQuery)=> api.get(`/invoices?searchQuery=${searchQuery.search}`);
export const getWeeklyEarnings=()=> api.get('/invoices/earnings');
export const getRecentInvoices=()=> api.get('/invoices/recent');
export const  getClientInvoices=(id)=> api.get(`/invoices/client/${id}`);


//@desc clients api calls
export const fetchClients=()=> api.get('/clients');
export const fetchClient=(id)=> api.get(`/clients/${id}`);
export const createClient=(client)=> api.post('/clients', client);
export const updateClient=(id, client)=> api.patch(`/clients/${id}`, client);
export const deleteClient=(id)=> api.delete(`/clients/${id}`);
export const getClientByUser=(searchQuery)=> api.get(`/clients/user?searchQuery=${searchQuery.search}`);

//@desc get user
//@route GET /api/user
export const fetchUser = async () => {
  const { data } = await api.get("/users");
  return data;
};

//@desc auth api calls
export const loginUser = (formData)=> api.post('auth/login', formData);
export const registerUser =(formData)=> api.post('auth/register', formData)
export const forgot = (formData) => api.post('/users/forgot', formData);
export const reset = (formData) => api.post('/users/reset', formData);
export const logoutUser = () => api.get('/auth/logout');
export const fetchUserById = async (id) => {
  const { data } = await api.get(`/user/${id}`);
  return data;
};

//@desc profile api calls
export const createProfile = (profile)=> api.post('/user', profile);
export const fetchProfile = (id)=> api.get(`/user/${id}`);
export const updateProfile = (id, profile)=> api.patch(`/user/${id}`, profile);
