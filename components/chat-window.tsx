"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  Paperclip,
  Clock,
  Hash,
  ChevronDown,
  Star,
  Search,
  MessageSquare,
  Reply,
  Copy,
  Forward,
  Trash2,
  Check,
  Smile,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Chat, Message } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ContactDetails } from "@/components/contact-details"
import { MemberAvatars } from "@/components/member-avatars"
import { MemberListDialog } from "@/components/member-list-dialog"
import { FiPaperclip } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineAccessTime } from "react-icons/md";
import { PiClockClockwiseFill } from "react-icons/pi";
import { HiOutlineSparkles } from "react-icons/hi";
import { BiSolidBarChartSquare } from "react-icons/bi";
import { FaMicrophone } from "react-icons/fa6";


interface ChatWindowProps {
  chat: Chat | null
  messages: Message[]
  onSendMessage: (content: string) => void
}

export function ChatWindow({ chat, messages, onSendMessage }: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearchBar, setShowSearchBar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null)
  const [showContactDetails, setShowContactDetails] = useState(false)
  const [showMemberList, setShowMemberList] = useState(false)
  const [liveMessages, setLiveMessages] = useState<Message[]>(messages);

  useEffect(() => {
    setLiveMessages(messages);
  }, [messages]);

  // 🔄 poll backend every 3 s for new messages of the current chat
  useEffect(() => {
    if (!chat) return;                // no chat selected → nothing to poll

    const fetchMessages = async () => {
      try {
        console.log("Polling for new messages...");
        const res = await fetch(`/api/chats/${chat.id}/messages`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) return;          // optionally handle errors
        const data = await res.json(); // expected { messages: Message[] }

        // --- simple freshness check (last id changed) ---
        const lastKnownId = liveMessages.at(-1)?.id;
        const lastFetchedId = data.messages?.at(-1)?.id;
        if (lastKnownId !== lastFetchedId) {
          setLiveMessages(data.messages);
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    };

    // initial fetch + start interval
    fetchMessages();
    const poller = setInterval(fetchMessages, 10000);

    // cleanup when chat changes / component unmounts
    return () => clearInterval(poller);
  }, [chat, liveMessages]);            // re-create interval if chat changes



  const getSenderName = (sender: unknown) =>
    typeof sender === "string"
      ? sender
      : (sender as { name?: string })?.name ?? "Unknown";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      onSendMessage(messageInput)
      setMessageInput("")
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji)
  }

  const handleTemplateSelect = (content: string) => {
    setMessageInput(content)
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Select a chat to start messaging</h3>
          <p className="text-sm text-gray-500 mt-2">Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Extract all messages (from messages prop only, since Chat type does not have messages field)
  const allMessages: Message[] = Array.isArray(liveMessages) ? liveMessages : [];

  // Filter messages by search term (case-insensitive, in content or sender)
  const filteredMessages = searchTerm.trim()
    ? allMessages.filter(
      (msg) =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSenderName(msg.sender).toLowerCase().includes(searchTerm.toLowerCase())
    )
    : allMessages

  // Group filtered messages by date
  const groupedMessages: { [key: string]: Message[] } = {}
    ; (Array.isArray(filteredMessages) ? filteredMessages : []).forEach((message) => {
      const date = formatDate(message.timestamp)
      if (!groupedMessages[date]) {
        groupedMessages[date] = []
      }
      groupedMessages[date].push(message)
    })

  // Check if this is a group chat (type === "group")
  //@ts-ignore
  const isGroupChat = chat.type === "group"

  // Format member names for display - only for group chats
  let memberNames = ""
  let memberAvatars = []
  if (isGroupChat && Array.isArray(chat.members)) {
    // If members are in the format [{ user: { ... } }], flatten to ChatMember[]
    const flatMembers = chat.members.map((m: any) => m.user ? {
      id: m.user.id,
      name: m.user.name,
      avatar: m.user.avatarUrl || m.user.avatar,
      phone: m.user.phone,
      email: m.user.email,
      color: m.user.color,
      isAdmin: m.isAdmin || m.user.isAdmin,
    } : m)
    memberNames = flatMembers.map((member) => member.name).filter(Boolean).join(", ")
    memberAvatars = flatMembers
  } else if (Array.isArray(chat.members)) {
    memberAvatars = chat.members
  } else if (typeof chat.phone === "string") {
    memberNames = chat.phone
  } else {
    memberNames = ""
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat header */}
      <div className="p-[6px] border-b flex items-center h-12">
        <div
          className={`flex items-center gap-3 ${isGroupChat ? "cursor-pointer" : ""}`}
          onClick={isGroupChat ? () => setShowContactDetails(true) : undefined}
        >
          <Avatar className="h-8 w-8">
            {chat.avatar ? (
              <img src={chat.avatar || "/placeholder.svg"} alt={typeof chat.name === "string" ? chat.name : "Chat"} />
            ) : (
              <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center">
                <span className="text-sm text-gray-600">{typeof chat.name === "string" ? chat.name.charAt(0) : "?"}</span>
              </div>
            )}
          </Avatar>

          <div>
            <div className="font-medium text-sm">
              {typeof chat.name === "string" ? chat.name : JSON.stringify(chat.name)}
            </div>
            {isGroupChat ? (
              <div className="text-xs text-gray-500 truncate max-w-[200px]">{typeof memberNames === "string" ? memberNames : JSON.stringify(memberNames)}</div>
            ) : (
              <div className="text-xs text-gray-500 ">{typeof chat.phone === "string" ? chat.phone : JSON.stringify(chat.phone)}</div>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Only show member avatars for group chats */}
          {isGroupChat && memberAvatars.length > 0 && (
            <MemberAvatars members={memberAvatars} maxVisible={5} size="sm" onClick={() => setShowMemberList(true)} />
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSearchBar((v) => !v)}>
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search in conversation</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Star conversation</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search bar for messages (toggle) */}
      {showSearchBar && (
        <div className="px-4 py-2 border-b bg-white flex items-center">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in chat..."
            className="w-64 h-8 text-xs"
            autoFocus
          />
          <Button variant="ghost" size="icon" className="ml-1 h-8 w-8" onClick={() => setShowSearchBar(false)}>
            ✕
          </Button>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-white text-xs text-gray-500 px-2 py-1 rounded-md shadow-sm">{date}</div>
            </div>

            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.isOutgoing ? "justify-end" : "justify-start")}
                onMouseEnter={() => setShowMessageActions(message.id)}
                onMouseLeave={() => setShowMessageActions(null)}
              >
                <div className="relative group">
                  {/* Message Actions */}
                  {showMessageActions === message.id && (
                    <div
                      className={cn(
                        "absolute top-0 flex items-center gap-1 bg-white border rounded-md shadow-sm px-1 py-0.5",
                        message.isOutgoing ? "right-full mr-2" : "left-full ml-2",
                      )}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Reply className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reply</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Forward className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Forward</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[400px] rounded-lg p-3 shadow-sm",
                      message.isOutgoing ? "bg-green-100 text-gray-800" : "bg-white border text-gray-800",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn("text-xs font-medium", message.isOutgoing ? "text-green-600" : "text-gray-600")}
                      >
                        {getSenderName(message.sender)}
                        {message.senderPhone && (
                          <span className="text-xs text-gray-500 ml-1 font-normal">{message.senderPhone}</span>
                        )}
                      </span>
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    </div>

                    <div className="text-sm break-words">
                      {message.metadata?.isEmail ? (
                        <div className="text-blue-500 underline">{message.content}</div>
                      ) : (
                        message.content
                      )}
                    </div>

                    {message.isOutgoing && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <Check className="h-3 w-3 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-3 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="outline" size="sm" className="text-xs h-7 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            WhatsApp
            <ChevronDown className="h-3 w-3" />
          </Button>

          <Button variant="outline" size="sm" className="text-xs h-7 flex items-center gap-1">
            Private Note
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="flex-1 border rounded-lg p-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Message..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <FiPaperclip className="h-4 w-4 text-gray-500" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <BsEmojiSmile className="h-4 w-4 text-gray-500" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <MdOutlineAccessTime className="h-4 w-4 text-gray-500" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <PiClockClockwiseFill className="h-4 w-4 text-gray-500" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <FaMicrophone className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
              <div className="flex items-center">
                <Avatar className="h-5 w-5">
                  <div className="bg-green-600 h-full w-full rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white">P</span>
                  </div>
                </Avatar>
              </div>
            </div>
          </div>

          <Button type="submit" size="icon" className="h-10 w-10 rounded-full bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Contact/Group Details Dialog */}
      {showContactDetails && <ContactDetails chat={chat} onClose={() => setShowContactDetails(false)} />}

      {/* Member List Dialog */}
      {isGroupChat && chat.members && (
        <MemberListDialog
          isOpen={showMemberList}
          onClose={() => setShowMemberList(false)}
          members={chat.members}
          groupName={chat.name}
        />
      )}
    </div>
  )
}
