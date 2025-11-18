import { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  className?: string
}

export default function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white ${className}`}>
      {/* Premium background with subtle effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Radial gradient orb */}
        <div 
          className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full opacity-[0.03] blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, transparent 70%)'
          }}
        ></div>
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(0 0 0 / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(0 0 0 / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
