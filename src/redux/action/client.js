import axios from "axios";  
import API_URL from "../../api/server";

// @desc create client
export const createClient =(
    company,
    address,
    country,
    tel,
    email,
    invoiceId
    )=>
    async(dispatch)=>{
        try {
           dispatch({
               type:"clientCreateRequest",
           });
           const {data}=await axios.post(`${API_URL}clients`,
           company,
            address,
            country,
            tel,
            email,
            invoiceId
            ); 
            dispatch({
                type:"clientCreateSuccess",
                payload:data.client,
            });
           
        } catch (error) {
            dispatch({
                type:"clientCreateFail",
                payload:error.response.data.message,
            }); 
        }
    }

    //@desc get all clients

    export const getAllClients =()=>async(dispatch)=>{
        try {
            dispatch({
                type:"getAllClientsRequest",
            });
            const {data}=await axios.get(`${API_URL}clients`);
            dispatch({
                type:"getAllClientsSuccess",
                payload:data.clients,
            });
        } catch (error) {
            dispatch({
                type:"getAllClientsFail",
                payload:error.response.data.message,
            });
        }
    }

    //@desc get client by id

    export const getClientById =(id)=>async(dispatch)=>{
        try {
            dispatch({
                type:"getClientByIdRequest",
            });
            const {data}=await axios.get(`${API_URL}clients/${id}`);
            dispatch({
                type:"getClientByIdSuccess",
                payload:data.client,
            });
        } catch (error) {
            dispatch({
                type:"getClientByIdFail",
                payload:error.response.data.message,
            });
        }
    }

    //@desc update client
    
    export const updateClient =(id,company,address,country,tel,email)=>async(dispatch)=>{
        try {
            dispatch({
                type:"updateClientRequest",
            });
            const {data}=await axios.put(`${API_URL}clients/${id}`,company,address,country,tel,email);
            dispatch({
                type:"updateClientSuccess",
                payload:data.client,
            });
        } catch (error) {
            dispatch({
                type:"updateClientFail",
                payload:error.response.data.message,
            });
        }
    } 
    
    //@desc delete client
    export const deleteClient =(id)=>async(dispatch)=>{
        try {
            dispatch({
                type:"deleteClientRequest",
            });
            const {data}=await axios.delete(`${API_URL}clients/${id}`);
            dispatch({
                type:"deleteClientSuccess",
                payload:data.client,
            });
        } catch (error) {
            dispatch({
                type:"deleteClientFail",
                payload:error.response.data.message,
            });
        }
    }

    //@desc get clients invoices list

    export const getClientsInvoices =(id)=>async(dispatch)=>{
        try {
            dispatch({
                type:"getClientsInvoicesRequest",
            });
            const {data}=await axios.get(`${API_URL}clients/${id}/invoices`);
            dispatch({
                type:"getClientsInvoicesSuccess",
                payload:data.invoices,
            });
        } catch (error) {
            dispatch({
                type:"getClientsInvoicesFail",
                payload:error.response.data.message,
            });
        }
    }