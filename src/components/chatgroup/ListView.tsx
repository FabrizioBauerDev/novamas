"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import ChatGroupList from "./ChatGroupList";
import Pagination from "./Pagination";
import DeleteDialog from "./DeleteDialog";
import {
  getChatGroupsAction,
  deleteChatGroupAction,
} from "@/lib/actions/actions-chatgroup";
import { ChatGroupWithCreator } from "@/types/types";

interface ListViewProps {
  isStudent?: boolean;
}

export default function ListView({ isStudent = false }: ListViewProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  const [chatGroups, setChatGroups] = useState<ChatGroupWithCreator[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] =
    useState<ChatGroupWithCreator | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Cargar ChatGroups al montar el componente
  useEffect(() => {
    const loadChatGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getChatGroupsAction();
        if (result.success) {
          setChatGroups(result.data || []);
        } else {
          setError(result.error || "Error desconocido");
        }
      } catch (err) {
        setError("Error al cargar las sesiones grupales");
        console.error("Error loading chat groups:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChatGroups();
  }, []);

  // Filtrar grupos por término de búsqueda
  const filteredGroups = chatGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.creatorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleView = (group: ChatGroupWithCreator) => {
    router.push(`/chatgroup/${group.id}`)
  };

  const handleDeleteClick = (group: ChatGroupWithCreator) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (groupToDelete) {
      try {
        const result = await deleteChatGroupAction(groupToDelete.id);
        if (result.success) {
          setChatGroups((prev) =>
            prev.filter((group) => group.id !== groupToDelete.id)
          );
          setDeleteDialogOpen(false);
          setGroupToDelete(null);
          const newTotalPages = Math.ceil(
            (filteredGroups.length - 1) / itemsPerPage
          );
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }
        } else {
          setError(result.error || "Error al eliminar la sesión grupal");
        }
      } catch (err) {
        console.error("Error deleting chat group:", err);
        setError("Error al eliminar la sesión grupal");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Skeleton component para el contenido
  const ContentSkeleton = () => (
    <div className="space-y-4">
      {/* Search bar skeleton */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      
      {/* Chat groups skeleton */}
      <div className="space-y-4">
        {[...Array(itemsPerPage)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-foreground">
          Sesiones Grupales - NoVa+
        </h1>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <ContentSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              isStudent={isStudent}
            />

            <ChatGroupList
              groups={paginatedGroups}
              searchTerm={searchTerm}
              onView={handleView}
              onDelete={handleDeleteClick}
              isStudent={isStudent}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredGroups.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        groupToDelete={groupToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
