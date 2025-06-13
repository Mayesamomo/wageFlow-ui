import { ClientForm } from "@/components/clients/client-form"

export default function NewClientPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
          <p className="text-muted-foreground">Create a new client profile for your healthcare services.</p>
        </div>
        <ClientForm />
      </div>
    </div>
  )
}
