"use client";

import { useRouter } from "next/navigation";
import { newChatNova } from "@/lib/utils";

interface ChatButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function ChatButton({ className, children }: ChatButtonProps) {
  const router = useRouter();

  const handleChatNavigation = () => {
    const chatId = newChatNova();
    router.push(`/chatNova/${chatId}`);
  };

  return (
    <button
      onClick={handleChatNavigation}
      className={`${className ?? ""} cursor-pointer`}
    >
      {children}
    </button>
  );
}
