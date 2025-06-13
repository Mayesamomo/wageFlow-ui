import { MileageForm } from "@/components/mileage/mileage-form"

export default function NewMileagePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Mileage Entry</h1>
      <MileageForm />
    </div>
  )
}
