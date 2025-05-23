export interface Chat {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  lastMessageTime: string
  phone: string
  unreadCount: number
  labels: string[]
  status?: boolean
  isVerified?: boolean
  members?: ChatMember[]
  assignees?: string[]
  supportId?: string

}

export interface ChatMember {
  id: string
  name: string
  avatar?: string
  phone?: string
  email?: string
  color?: string
  isAdmin?: boolean
}

export interface Message {
  id: string
  chatId: string
  content: string
  sender: string
  timestamp: string
  status: "sent" | "delivered" | "read"
  isOutgoing: boolean
  senderPhone?: string
  metadata?: {
    isEmail?: boolean
    isMedia?: boolean
    mediaType?: string
    mediaUrl?: string
  }
}

export interface Filter {
  id: string
  name: string
  criteria: FilterCriteria[]
}

export interface FilterCriteria {
  field: string
  operator: string
  value: string | number | boolean
}
