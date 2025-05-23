import type { Chat, ChatMember, Message } from "./types"

// Define some members that can be reused across chats
const members: Record<string, ChatMember> = {
  roshnagAirtel: {
    id: "member1",
    name: "Roshnag Airtel",
    phone: "+91 83646 47925",
    email:"member1@gmail.com",
    color: "#6b7280", // gray
  },
  roshnagJio: {
    id: "member2",
    name: "Roshnag Jio",
    phone: "+91 83646 47926",
    color: "#3b82f6", // blue
  },
  bharatKumar: {
    id: "member3",
    name: "Bharat Kumar Ramesh",
    phone: "+91 92896 65999",
    color: "#f97316", // orange
  },
  periskope: {
    id: "member4",
    name: "Periskope",
    phone: "+91 99718 44008",
    color: "#22c55e", // green
    isAdmin: true,
  },
  ahmadpor: {
    id: "member5",
    name: "Ahmadpor",
    phone: "+91 99718 44009",
    color: "#8b5cf6", // purple
  },
  swapnika: {
    id: "member6",
    name: "Swapnika",
    phone: "+91 99999 99999",
    color: "#ec4899", // pink
  },
  rohosen: {
    id: "member7",
    name: "Rohosen",
    phone: "+91 99718 44010",
    color: "#14b8a6", // teal
  },
  yasin: {
    id: "member8",
    name: "Yasin",
    phone: "+91 99718 44011",
    color: "#f43f5e", // rose
  },
  
}

export const dummyChats: Chat[] = [
  {
    id: "chat1",
    name: "Test Skope Final 5",
    lastMessage: "This doesn't go on Tuesday...",
    lastMessageTime: "Yesterday",
    phone: "+91 99718 44008",
    unreadCount: 1,
    labels: ["Demo"],
    status: true,
    isVerified: false,
    supportId: "Support2",
    // One-to-one chat (just the user and one other person)
    members: [members.periskope, members.roshnagAirtel],
  },
  {
    id: "chat2",
    name: "Periskope Team Chat",
    lastMessage: "Periskope: Test message",
    lastMessageTime: "28-Feb-25",
    phone: "+91 99718 44008",
    unreadCount: 3,
    labels: ["Demo", "Internal"],
    isVerified: true,
    // Group chat with multiple members
    members: [
      members.periskope,
      members.roshnagAirtel,
      members.bharatKumar,
      members.roshnagJio,
      members.ahmadpor,
      members.swapnika,
      members.rohosen,
      members.yasin,
    ],
  },
  {
    id: "chat3",
    name: "+91 99999 99999",
    lastMessage: "Hi there, I'm Swapnika, Co-Founder of ...",
    lastMessageTime: "25-Feb-25",
    phone: "+91 92896 65999",
    unreadCount: 1,
    labels: ["Demo", "Signup"],
    isVerified: true,
    // One-to-one chat
    members: [members.swapnika, members.periskope],
  },
  {
    id: "chat4",
    name: "Test Demo17",
    lastMessage: "Rohosen: 123",
    lastMessageTime: "25-Feb-25",
    phone: "+91 99718 44008",
    unreadCount: 1,
    labels: ["Content", "Demo"],
    isVerified: false,
    // Group chat
    members: [members.rohosen, members.periskope, members.bharatKumar],
  },
  {
    id: "chat5",
    name: "Test El Centro",
    lastMessage: "Roshnag: Hello, Livonia!",
    lastMessageTime: "04-Feb-25",
    phone: "+91 99718 44008",
    unreadCount: 0,
    labels: ["Demo"],
    status: true,
    isVerified: false,
    // Group chat with multiple members
    members: [
      members.roshnagAirtel,
      members.roshnagJio,
      members.bharatKumar,
      members.periskope,
      members.ahmadpor,
      members.swapnika,
      members.rohosen,
      members.yasin,
    ],
  },
  {
    id: "chat6",
    name: "Testing group",
    lastMessage: "Testing 12345",
    lastMessageTime: "27-Jan-25",
    phone: "+91 92896 65999",
    unreadCount: 0,
    labels: ["Demo"],
    isVerified: false,
    // Group chat
    members: [members.periskope, members.bharatKumar, members.roshnagAirtel],
  },
  {
    id: "chat7",
    name: "Yasin 3",
    lastMessage: "First Bulk Message",
    lastMessageTime: "25-Nov-24",
    phone: "+91 99718 44008",
    unreadCount: 3,
    labels: ["Demo", "Dont Send"],
    isVerified: false,
    // One-to-one chat
    members: [members.yasin, members.periskope],
  },
  {
    id: "chat8",
    name: "Test Skope Final 9473",
    lastMessage: "Heyy",
    lastMessageTime: "01-Jan-25",
    phone: "+91 99718 44008",
    unreadCount: 1,
    labels: ["Demo"],
    status: true,
    isVerified: false,
    // Group chat
    members: [members.periskope, members.roshnagAirtel, members.bharatKumar],
  },
  {
    id: "chat9",
    name: "Skope Demo",
    lastMessage: "test 123",
    lastMessageTime: "20-Dec-24",
    phone: "+91 92896 65999",
    unreadCount: 0,
    labels: ["Demo"],
    isVerified: false,
    // One-to-one chat
    members: [members.periskope, members.bharatKumar],
  },
  {
    id: "chat10",
    name: "Test Demo15",
    lastMessage: "test 123",
    lastMessageTime: "20-Dec-24",
    phone: "+91 92896 65999",
    unreadCount: 0,
    labels: ["Demo"],
    isVerified: false,
    // One-to-one chat
    members: [members.periskope, members.roshnagAirtel],
  },
]

export const dummyMessages: Message[] = [
  // Test El Centro chat messages
  {
    id: "msg1",
    chatId: "chat5",
    content: "CVFER",
    sender: "Test El Centro",
    timestamp: "2025-02-04T11:51:00",
    status: "read",
    isOutgoing: false,
  },
  {
    id: "msg2",
    chatId: "chat5",
    content: "CDERT",
    sender: "Test El Centro",
    timestamp: "2025-02-04T11:54:00",
    status: "read",
    isOutgoing: false,
  },
  {
    id: "msg3",
    chatId: "chat5",
    content: "Hello, South Euna!",
    sender: "Roshnag Airtel",
    timestamp: "2025-02-04T08:01:00",
    status: "read",
    isOutgoing: false,
    senderPhone: "+91 83646 47925",
  },
  {
    id: "msg4",
    chatId: "chat5",
    content: "Hello, Livonia!",
    sender: "Test El Centro",
    timestamp: "2025-02-04T08:01:00",
    status: "read",
    isOutgoing: false,
  },
  {
    id: "msg5",
    chatId: "chat5",
    content: "test el centro",
    sender: "Periskope",
    timestamp: "2025-02-04T09:49:00",
    status: "read",
    isOutgoing: true,
    senderPhone: "+91 99718 44008",
  },
  {
    id: "msg6",
    chatId: "chat5",
    content: "CDERT",
    sender: "Roshnag Airtel",
    timestamp: "2025-02-04T09:40:00",
    status: "read",
    isOutgoing: false,
    senderPhone: "+91 83646 47925",
  },

  // Periskope Team Chat messages
  {
    id: "msg7",
    chatId: "chat2",
    content: "hello",
    sender: "Periskope",
    timestamp: "2025-02-28T12:07:00",
    status: "read",
    isOutgoing: true,
    senderPhone: "+91 99718 44008",
  },

  // Test Skope Final 9473 messages
  {
    id: "msg8",
    chatId: "chat8",
    content: "testing",
    sender: "Periskope",
    timestamp: "2025-01-01T09:49:00",
    status: "read",
    isOutgoing: true,
    senderPhone: "+91 99718 44008",
  },

  // Additional messages for Test El Centro
  {
    id: "msg9",
    chatId: "chat5",
    content: "testing",
    sender: "Periskope",
    timestamp: "2025-02-23T09:49:00",
    status: "read",
    isOutgoing: true,
    senderPhone: "+91 99718 44008",
  },
  {
    id: "msg10",
    chatId: "chat5",
    content: "bharath@hashlabs.dev",
    sender: "Periskope",
    timestamp: "2025-02-23T09:49:00",
    status: "read",
    isOutgoing: true,
    senderPhone: "+91 99718 44008",
    metadata: {
      isEmail: true,
    },
  },
]


