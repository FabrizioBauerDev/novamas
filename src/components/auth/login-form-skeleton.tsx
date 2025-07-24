export default function LoginFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Email field skeleton */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-md"></div>
      </div>

      {/* Password field skeleton */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-md"></div>
      </div>

      {/* Submit button skeleton */}
      <div className="h-10 bg-gray-300 rounded-md"></div>

      {/* Error message placeholder (optional) */}
      <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
    </div>
  )
}
