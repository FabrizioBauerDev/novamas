import { FeedBack } from "@/types/types"

interface FeedBackProps {
    feedBack: FeedBack;
}

export function FeedBackTab({ feedBack }: FeedBackProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    FeedBack del Asistente
                </h2>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-slate-600 mb-3 text-center">
                    Calificación
                </h3>
                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            className={`w-8 h-8 ${
                                star <= feedBack.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 fill-gray-300"
                            } transition-colors duration-150`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                    ))}
                </div>
                <p className="text-center mt-2 text-lg font-semibold text-slate-700">
                    {feedBack.rating} de 5 estrellas
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Comentario
                </h3>
                <p className="text-base leading-relaxed text-slate-600">
                    {feedBack.comment || "El usuario no dejó comentario"}
                </p>
            </div>
        </div>
    )
}