"use client"

import { useState, useEffect } from "react"
import { FiX, FiUsers, FiUser, FiSearch, FiPlus, FiAlertCircle, FiCheck } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
// import { json } from "stream/consumers"

interface User {
  id: string
  name: string
  phone: string
  avatar: string | null
}

interface CreateChatModalProps {
  onClose: () => void
  onCreateChat: (chatData: any) => void
}

export function CreateChatModal({ onClose, onCreateChat }: CreateChatModalProps) {
  const [chatType, setChatType] = useState<"direct" | "group">("direct")
  const [title, setTitle] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [phoneValid, setPhoneValid] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [groupMembers, setGroupMembers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("direct")
  const [labels, setLabels] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [adminIds, setAdminIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data.users) ? data.users : [])
      })
  }, [])

  useEffect(() => {
  setPhone("")
  setPhoneError(null)
  setPhoneValid(false)
  setSelectedUser(null)
  setTitle("")
}, [chatType])

  const validatePhoneFormat = (phoneNumber: string) => phoneNumber.length >= 10

  const checkPhoneExists = (phoneNumber: string) => {
    return users.find((user) =>
      user.phone.replace(/\s/g, "").includes(phoneNumber.replace(/\s/g, ""))
    )
  }

  const toggleAdmin = (userId: string) => {
  setAdminIds((prev) =>
    prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
  )
}



  useEffect(() => {
    if (!phone) {
      setPhoneError(null)
      setPhoneValid(false)
      setSelectedUser(null)
      return
    }

    if (!validatePhoneFormat(phone)) {
      setPhoneError("Please enter a valid phone number")
      setPhoneValid(false)
      setSelectedUser(null)
      return
    }

    const user = checkPhoneExists(phone)
    if (!user) {
      setPhoneError("No user found with this number")
      setPhoneValid(false)
      setSelectedUser(null)
      return
    }

    setPhoneError(null)
    setPhoneValid(true)
    setSelectedUser(user)
    if (!title) {
      setTitle(user.name)
    }
  }, [phone, users])

  const handleLabelChange = (label: string) => {
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.replace(/\s/g, "").includes(searchTerm.replace(/\s/g, ""))
  )

  const addMemberToGroup = (user: User) => {
    if (!groupMembers.find((member) => member.id === user.id)) {
      setGroupMembers([...groupMembers, user])
      setSearchTerm("")
    }
  }

  const removeMemberFromGroup = (id: string) => {
    setGroupMembers(groupMembers.filter((member) => member.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (chatType === "direct" && !phoneValid) return
    if (chatType === "group" && groupMembers.length === 0) return

    const chatData = {
      name: title || (selectedUser ? selectedUser.name : "New Chat"),
      type: chatType === "group"? "group" : "direct",
      phone: chatType === "direct" ? selectedUser?.phone : undefined,
      memberIds:  [...groupMembers.map((member) => member.id), JSON.parse(localStorage.getItem("user") || "{}").id],
      labels,
      adminIds: chatType === "group" ? adminIds : [],
      createdBy: JSON.parse(localStorage.getItem("user") || "{}").id || "",
    }
    onCreateChat(chatData)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-semibold">Create New Chat</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <FiX />
          </Button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="direct" onClick={() => setChatType("direct")}>
              <FiUser className="mr-2" /> Direct
            </TabsTrigger>
            <TabsTrigger value="group" onClick={() => setChatType("group")}>
              <FiUsers className="mr-2" /> Group
            </TabsTrigger>
          </TabsList>

          {/* Direct Chat */}
          <TabsContent value="direct">
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="relative">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setSelectedUser(null)
                      setPhoneValid(false)
                    }}
                    placeholder="+91 99999 99999"
                    className={`pl-4 pr-10 ${phoneError ? "border-red-500" : phoneValid ? "border-green-500" : ""}`}
                    autoComplete="off"
                  />
                  {phoneValid && <FiCheck className="absolute right-3 top-3 text-green-500" />}
                  {phoneError && <FiAlertCircle className="absolute right-3 top-3 text-red-500" />}
                </div>
                {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}

                {/* Suggestions Dropdown */}
                {!phoneValid && phone.length >= 3 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow max-h-40 overflow-y-auto">
                    {users
                      .filter((user) =>
                        user.phone.replace(/\s/g, "").includes(phone.replace(/\s/g, ""))
                      )
                      .slice(0, 5)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user)
                            addMemberToGroup(user)
                            setPhone(user.phone)
                            setPhoneValid(true)
                            setPhoneError(null)
                            if (!title) setTitle(user.name)
                          }}
                        >
                          <Avatar className="h-8 w-8 mr-2">
                            <div className="bg-gray-300 h-full w-full flex items-center justify-center text-white text-xs">
                              {user.name.charAt(0)}
                            </div>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.phone}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {selectedUser && (
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Avatar className="h-10 w-10 mr-3">
                    <div className="bg-gray-300 h-full w-full flex items-center justify-center text-white">
                      {selectedUser.name.charAt(0)}
                    </div>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500">{selectedUser.phone}</p>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="name">Contact Name</Label>
                <Input
                  id="name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter contact name"
                />
              </div>

              <Label>Chat Labels</Label>
              <div className="flex flex-col space-y-2">
                {["Demo", "Internal", "Signup"].map((label) => (
                  <label key={label} className="flex items-center space-x-2 border p-3 rounded-md">
                    <input
                      type="checkbox"
                      checked={labels.includes(label)}
                      onChange={() => handleLabelChange(label)}
                      className="accent-green-600"
                    />
                    <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
                  </label>
                ))}
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 mt-4" disabled={!phoneValid}>
                Create Chat
              </Button>
            </form>
          </TabsContent>

          {/* Group Chat */}
          <TabsContent value="group">
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div>
                <Label htmlFor="group-name">Group Name *</Label>
                <Input
                  id="group-name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div>
                <Label>Add Members *</Label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by name or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {searchTerm && (
                  <div className="border rounded-md max-h-40 overflow-y-auto mt-2">
                    {filteredUsers.length ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 border-b last:border-none"
                          onClick={() => addMemberToGroup(user)}
                        >
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <div className="bg-gray-300 h-full w-full flex items-center justify-center text-white text-xs">
                                {user.name.charAt(0)}
                              </div>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.phone}</p>
                            </div>
                          </div>
                          <FiPlus />
                        </div>
                      ))
                    ) : (
                      <p className="text-center p-3 text-sm text-gray-500">No users found</p>
                    )}
                  </div>
                )}
              </div>

              {groupMembers.length > 0 && (
                <div>
                  <Label>Selected Members ({groupMembers.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {groupMembers.map((member) => (
                      <Badge key={member.id} variant="secondary" className="flex items-center gap-1 py-1 pl-1 pr-2">
                        <Avatar className="h-5 w-5">
                          <div className="bg-gray-300 h-full w-full flex items-center justify-center text-white text-[10px]">
                            {member.name.charAt(0)}
                          </div>
                        </Avatar>
                        <span className="text-xs">{member.name}</span>

                        {/* Admin Toggle */}
                        <Button
                          variant={adminIds.includes(member.id) ? "default" : "ghost"}
                          size="sm"
                          className="h-4 px-1 text-[10px]"
                          onClick={() => toggleAdmin(member.id)}
                          type="button"
                        >
                          {adminIds.includes(member.id) ? "Admin" : "Make Admin"}
                        </Button>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            removeMemberFromGroup(member.id)
                            setAdminIds((prev) => prev.filter((id) => id !== member.id)) // also remove from adminIds
                          }}
                          type="button"
                        >
                          <FiX size={12} />
                        </Button>
                      </Badge>
                    ))}

                  </div>
                </div>
              )}

              <Label>Chat Labels</Label>
              <div className="flex flex-col space-y-2">
                {["Demo", "Internal", "Signup"].map((label) => (
                  <label key={label} className="flex items-center space-x-2 border p-3 rounded-md">
                    <input
                      type="checkbox"
                      checked={labels.includes(label)}
                      onChange={() => handleLabelChange(label)}
                      className="accent-green-600"
                    />
                    <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
                  </label>
                ))}
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 mt-4">
                Create Chat
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
