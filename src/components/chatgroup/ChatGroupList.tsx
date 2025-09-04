"use client"

import ChatGroupCard from "./ChatGroupCard"
import EmptyState from "./EmptyState"
import { ChatGroupWithCreator } from "@/types/types"

interface ChatGroupListProps {
  groups: ChatGroupWithCreator[]
  searchTerm: string
  onView: (group: ChatGroupWithCreator) => void
  onDelete: (group: ChatGroupWithCreator) => void
}

export default function ChatGroupList({ groups, searchTerm, onView, onDelete }: ChatGroupListProps) {
  return (
    <div className="space-y-2">
      {groups.length === 0 ? (
        <EmptyState hasSearchTerm={!!searchTerm} />
      ) : (
        groups.map((group) => (
          <ChatGroupCard
            key={group.id}
            group={group}
            onView={onView}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}
