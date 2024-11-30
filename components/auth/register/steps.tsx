import { cn } from "@/lib/utils"

interface StepsProps {
  currentStep: number
}

const steps = [
  { id: 1, name: 'Personal' },
  { id: 2, name: 'Professional' },
  { id: 3, name: 'Contact' },
  { id: 4, name: 'Photo' },
]

export function Steps({ currentStep }: StepsProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center space-x-5 text-sm font-medium">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center">
            <span className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              currentStep === step.id
                ? "bg-[#FACE30] text-black"
                : currentStep > step.id
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            )}>
              {currentStep > step.id ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.id
              )}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {step.name}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
} 
