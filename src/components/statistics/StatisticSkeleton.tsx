export function StatisticSkeleton() {
    return (
        <>
            {/* Pie Charts Row Skeleton */}
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                        <div className="flex items-center justify-center">
                            <div className="h-[180px] w-[180px] animate-pulse rounded-full bg-slate-200" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bar Charts Row Skeleton */}
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((j) => (
                                <div
                                    key={j}
                                    className="h-8 animate-pulse rounded bg-slate-200"
                                    style={{ width: `${0.5 * 40 + 60}%` }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
