import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function NewInvoicePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Invoice</h1>
      <InvoiceForm />
    </div>
  )
}
