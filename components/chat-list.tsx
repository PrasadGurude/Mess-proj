"use client"

import { useState } from "react"
import { Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { HiFolderDownload } from "react-icons/hi"
import { TbMessageCirclePlus } from "react-icons/tb"
import { BsFilter } from "react-icons/bs"
import type { Chat } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateChatModal } from "./create-chat-modal"

interface ChatListProps {
  chats: Chat[]
  setChats: React.Dispatch<React.SetStateAction<Chat[]>> // ✅ Add this
  selectedChat: Chat | null
  onSelectChat: (chat: Chat) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterActive: boolean
  setFilterActive: (active: boolean) => void
}

export function ChatList({
  chats,
  setChats,
  selectedChat,
  onSelectChat,
  searchQuery,
  setSearchQuery,
  filterActive,
  setFilterActive,
}: ChatListProps) {
  const [customFilterActive, setCustomFilterActive] = useState(false)
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false)

  async function handleCreateChat(chatData: Partial<Chat>) {
    if (!chatData.name) {
      console.warn("Chat name is required.")
      return
    }

    try {
      setIsCreateChatOpen(false)

      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(chatData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert(errorData.message || "Failed to create chat")
        return
      }

      const data = await res.json()

      // ✅ Append new chat without reload
      setChats((prevChats) => [data.chat, ...prevChats])
    } catch (error) {
      console.error("Network error:", error)
      alert("Network error while creating chat")
    }
  }

  return (
    <div className="w-[26%] border-r flex flex-col h-full relative">
      <div className="flex flex-row justify-between items-center py-2 h-12 border-b pl-1 pr-1">
        <div className="flex items-center gap-1 justify-center">
          <div className="flex items-center gap-1 px-1 py-1 rounded-md text-green-600">
            <HiFolderDownload />
            <span className="text-xs font-bold"> Custom filter</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-7">
            Save
          </Button>
        </div>

        <div className="flex items-center gap-2 w-6/12">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-6 h-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 text-green-600">
            <BsFilter />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Array.isArray(chats) && chats.length > 0 ? (
          chats.map((chat: Chat) => (
            <div
              key={chat.id}
              className={cn(
                "p-3 border-b hover:bg-gray-50 cursor-pointer",
                selectedChat?.id === chat.id && "bg-gray-50"
              )}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    {chat.avatar ? (
                      <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                    ) : (
                      <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center">
                        <span className="text-sm text-gray-600">{chat.name.charAt(0)}</span>
                      </div>
                    )}
                  </Avatar>
                  {chat.status && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate">{chat.name}</div>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    {chat.isVerified && <Check className="h-3 w-3 text-green-500" />}
                    <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-xs text-gray-500">{chat.phone}</div>
                    {chat.unreadCount > 0 && (
                      <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px]">
                        +{chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between h-[62px] items-end">
                  <div className="flex items-center">
                    <div className="flex flex-row items-end gap-1">
                      {chat.labels.slice(0, 2).map((label: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={cn(
                            "text-[10px] px-2 py-0.5",
                            label === "Demo" && "border-orange-300 text-orange-600",
                            label === "Internal" && "border-green-300 text-green-600",
                            label === "Signup" && "border-green-300 text-green-600",
                            label === "Content" && "border-blue-300 text-blue-600",
                            label === "Dont Send" && "border-red-300 text-red-600"
                          )}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                    {chat.labels.length > 2 && (
                      <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px]">
                        +{chat.labels.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{chat.lastMessageTime}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 text-center text-gray-500 text-sm">
            No chats found. Try creating a new chat!
          </div>
        )}
      </div>

      {/* Floating Button */}
      <div className="bg-green-600 w-10 h-10 overflow-hidden rounded-full flex items-center justify-center absolute bottom-8 right-4 text-white text-xl">
        <button
          onClick={() => setIsCreateChatOpen(true)}
          className="block text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="button"
        >
          <TbMessageCirclePlus />
        </button>
      </div>

      {isCreateChatOpen && (
        <CreateChatModal
          onClose={() => setIsCreateChatOpen(false)}
          onCreateChat={handleCreateChat}
        />
      )}
    </div>
  )
}
