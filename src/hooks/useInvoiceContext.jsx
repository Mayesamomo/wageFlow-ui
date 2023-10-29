import { InvoiceContext } from "../context/InvoiceContext";
import { useContext } from "react"; 

export const useInvoiceContext = () => {
    const context = useContext(InvoiceContext);

    if (!context) {
        throw new Error('useInvoiceContext must be used within a InvoiceContextProvider');
    }

    return context;
}