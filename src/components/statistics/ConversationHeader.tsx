interface ConversationDetailHeaderProps {
    groupName: string
    createdAt: string
}

export function ConversationDetailHeader({ groupName, createdAt }: ConversationDetailHeaderProps) {
    return (
        <>
            <div className="mb-4">
                <h2 className="mb-2 text-4xl font-bold text-slate-900">{groupName}</h2>
                <p className="text-slate-600">
                    Conversación del{" "}
                    {new Date(createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>
        </>
    )
}
