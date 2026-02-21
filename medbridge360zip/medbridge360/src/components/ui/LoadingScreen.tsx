'use client'

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        <p className="text-slate-500 font-medium text-sm">{message}</p>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      <div className="h-48 shimmer"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 shimmer rounded-lg w-3/4"></div>
        <div className="h-4 shimmer rounded-lg w-1/2"></div>
        <div className="h-4 shimmer rounded-lg w-2/3"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 shimmer rounded-lg flex-1"></div>
          <div className="h-9 shimmer rounded-lg flex-1"></div>
        </div>
      </div>
    </div>
  )
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-3 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-blue-600 animate-spin"
            style={{ borderWidth: '3px' }}
          ></div>
        </div>
        <p className="text-slate-500 text-sm animate-pulse">Searching hospitals...</p>
      </div>
    </div>
  )
}
