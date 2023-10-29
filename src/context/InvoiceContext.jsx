/* eslint-disable react/prop-types */
import { createContext, useReducer } from 'react'

export const InvoiceContext = createContext();

export const InvoiceReducer = (state, action) => { 
    switch (action.type) {
        case 'SET_INVOICE':
            return {
               invoices: action.payload
            }
        case 'ADD_INVOICE':
            return {
               invoices: [action.payload, ...state.invoices]
            }
        case 'UPDATE_INVOICE': {
            const updatedInvoice = action.payload;

            const updatedInvoices = state.invoices.map(invoice => {
                if (invoice.id === updatedInvoice.id) {
                    return updatedInvoice;
                }
                return invoice;
            });

            return {
                ...state,
                invoices: updatedInvoices
            };
        }

        case 'DELETE_INVOICE':
            return {
                ...state,
                invoices: state.invoices.filter(invoice => invoice.id !== action.payload)
            }
        default:
            return state;
    }
}

export const InvoiceContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(InvoiceReducer, { 
        invoices: null 
    });

    return (
        <InvoiceContext.Provider value={{...state, dispatch}}>
            {children}
        </InvoiceContext.Provider>
    )
}