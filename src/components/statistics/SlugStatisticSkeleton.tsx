export function SlugStatisticSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl p-6 space-y-6">
                {/* Header Skeleton */}
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
                    <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
                </div>

                {/* Tabs Skeleton */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                    <div className="h-10 w-32 rounded-lg bg-slate-200 animate-pulse" />
                    <div className="h-10 w-40 rounded-lg bg-slate-200 animate-pulse" />
                    <div className="h-10 w-36 rounded-lg bg-slate-200 animate-pulse" />
                </div>

                {/* Content Skeleton */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
