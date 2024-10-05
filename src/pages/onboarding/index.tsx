import DashboardLayout from "@/components/Dashboard"
import OnboardingForm from "@/components/OnboardingForm"

export default function OnboardingPage() {
  return (
    <DashboardLayout>
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center">
        <OnboardingForm />
      </div>
    </DashboardLayout>
  )
}