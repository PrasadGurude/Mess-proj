"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatList } from "@/components/chat-list"
import { ChatWindow } from "@/components/chat-window"
import { ActionSidebar } from "@/components/action-sidebar"
import { TopNav } from "@/components/top-nav"
import type { Chat, Message, Filter } from "@/lib/types"

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<any | null>(null)
  const [chats, setChats] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredChats, setFilteredChats] = useState<any[]>([])
  const [filterActive, setFilterActive] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Filter[]>([])

  // ✅ Load chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No auth token, please login");
          return;
        }
        const res = await fetch("/api/chats", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json()
        setChats(data.chats)
        setFilteredChats(data.chats)
        console.log("Fetched chats:", data.chats)

      } catch (error) {
        alert("Failed to fetch chats")
        console.error("Failed to fetch chats:", error)
      }
    }

    fetchChats()
  }, [])

  useEffect(() => {
    console.log("Updated chats:", chats)
  }, [chats])

  useEffect(() => {
    console.log("Updated filteredChats:", filteredChats)
  }, [filteredChats])

  // ✅ Load messages when a chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return
      try {
        // Ensure selectedChat is a valid Chat object
        // If selectedChat is an object with only id, fetch the full chat from chats
        let chatObj = selectedChat
        if (selectedChat && (!selectedChat.name || !selectedChat.phone)) {
          const found = chats.find((c) => c.id === selectedChat.id)
          if (found) chatObj = found
        }
        console.log("Fetching messages for chat:", chatObj)
        const res = await fetch(`/api/chats/${selectedChat.id}/messages`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()
        console.log("Fetched messages:", data)
        setMessages(data.messages || [])
        // Always set selectedChat to the full chat object (with all fields)
        setSelectedChat(chatObj)
      } catch (error) {
        alert("Failed to fetch messages")
        console.error("Failed to fetch messages:", error)
      }
    }

    fetchMessages()
  }, [selectedChat])

  // ✅ Filter chats
  useEffect(() => {
    let filtered = chats

    if (searchQuery) {
      filtered = filtered.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.phone.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterActive && activeFilters.length > 0) {
      filtered = filtered.filter((chat) =>
        activeFilters.some((filter) =>
          filter.criteria.every((criterion) => {
            const value = chat[criterion.field]
            if (typeof value === "string") {
              const val = value.toLowerCase()
              const crit = String(criterion.value).toLowerCase()
              switch (criterion.operator) {
                case "contains":
                  return val.includes(crit)
                case "equals":
                  return val === crit
                case "starts_with":
                  return val.startsWith(crit)
                case "ends_with":
                  return val.endsWith(crit)
              }
            }
            return true
          }),
        ),
      )
    }

    setFilteredChats(filtered)
  }, [searchQuery, chats, filterActive, activeFilters])

  const handleSendMessage = async (content: string) => {
    if (!selectedChat || !content.trim()) return

    try {
      const res = await fetch(`/api/chats/${selectedChat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (data.success) {
        // Re-fetch messages after sending
        const msgRes = await fetch(`/api/chats/${selectedChat.id}/messages`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const msgData = await msgRes.json()
        setMessages(msgData.messages || [])
      } else {
        alert(data.error || "Failed to send message")
      }
    } catch (error) {
      alert("Failed to send message")
      console.error("Failed to send message:", error)
    }
  }

  const handleApplyFilter = (filter: Filter) => {
    setActiveFilters((prev) => [...prev, filter])
    setFilterActive(true)
  }

  // Patch: Ensure selectedChat is always a full Chat object for ChatList
  const handleSelectChat = (chat: any) => {
    // If chat is only an id or partial, find the full chat from chats
    let chatObj = chat
    if (chat && (!chat.name || !chat.phone)) {
      const found = chats.find((c) => c.id === chat.id)
      if (found) chatObj = found
    }
    setSelectedChat(chatObj)
  }

  // Defensive: Only pass a valid Chat object or null to ChatWindow
  const validSelectedChat = selectedChat && selectedChat.id && selectedChat.name && selectedChat.phone && selectedChat.lastMessage && selectedChat.lastMessageTime && Array.isArray(selectedChat.labels)
    ? selectedChat
    : null;

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen">
        <TopNav />
        <div className="flex flex-1 overflow-hidden">
          <ChatList
            chats={filteredChats}
            setChats={setChats}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterActive={filterActive}
            setFilterActive={setFilterActive}
          />
          <div className="flex flex-1">
            <ChatWindow
              chat={validSelectedChat}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
            <ActionSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
