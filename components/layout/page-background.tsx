import { cn } from "@/lib/utils"

interface PageBackgroundProps {
  withGradient?: boolean
  imageType: 'hero' | 'body'
  className?: string
}

export function PageBackground({
  withGradient = false,
  imageType,
  className
}: PageBackgroundProps) {
  return (
    <>
      {withGradient && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#5386A4]/100 to-[#1F333E]/100 z-0 h-screen" />
      )}
      <div
        className={cn(
          "absolute inset-0 bg-cover opacity-30 bg-top z-0",
          imageType === 'hero' ? 'bg-hero_img' : 'bg-body_img',
          className
        )}
      />
    </>
  )
} 
