"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Plus,
  MessageSquare,
  Clock,
  FileText,
  ImageIcon,
  Paperclip,
  Download,
  Trash2,
  Tag,
  Check,
  Users,
  X,
} from "lucide-react"
import type { Chat } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MemberAvatars } from "@/components/member-avatars"

interface ContactDetailsProps {
  chat: Chat
  onClose: () => void
}

export function ContactDetails({ chat, onClose }: ContactDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [contactName, setContactName] = useState(chat.name)
  const [contactPhone, setContactPhone] = useState(chat.phone)

  // Check if this is a group chat (more than 2 members including the user)
  const isGroupChat = chat.members && chat.members.length > 2

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{isGroupChat ? "Group Info" : "Contact Info"}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex gap-4 py-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20">
              {chat.avatar ? (
                <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
              ) : (
                <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center">
                  <span className="text-xl text-gray-600">{chat.name.charAt(0)}</span>
                </div>
              )}
            </Avatar>
            <Button variant="ghost" size="sm" className="mt-2">
              <Edit className="h-3 w-3 mr-1" />
              Change
            </Button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input id="contact-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setIsEditing(false)}>
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{chat.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {isGroupChat ? (
                        <>
                          <Users className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{chat.members?.length} members</span>
                        </>
                      ) : (
                        <>
                          <Phone className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{chat.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {chat.labels.map((label, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className={cn(
                        "text-xs px-2 py-1",
                        label === "Demo" && "border-orange-300 text-orange-600",
                        label === "Internal" && "border-green-300 text-green-600",
                        label === "Signup" && "border-green-300 text-green-600",
                        label === "Content" && "border-blue-300 text-blue-600",
                        label === "Dont Send" && "border-red-300 text-red-600",
                      )}
                    >
                      {label}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {isGroupChat && chat.members && chat.members.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Members</h4>
              <Button variant="ghost" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex items-center mb-2">
              <MemberAvatars members={chat.members} maxVisible={8} size="md" />
            </div>
            <ScrollArea className="h-[100px]">
              <div className="space-y-2">
                {chat.members.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {member.avatar ? (
                          <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        ) : (
                          <div
                            className="h-full w-full rounded-full flex items-center justify-center"
                            style={{ backgroundColor: member.color || "#6b7280" }}
                          >
                            <span className="text-[10px] text-white">{member.name.charAt(0)}</span>
                          </div>
                        )}
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                      {member.isAdmin && <Badge className="ml-1 text-[10px] px-1 py-0">Admin</Badge>}
                    </div>
                  </div>
                ))}
                {chat.members.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View all members
                  </Button>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Not available</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Not available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Added on {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {chat.supportId && (
              <div>
                <h4 className="text-sm font-medium mb-2">Support Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Support ID: {chat.supportId}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="media">
            <ScrollArea className="h-[300px]">
              <div className="p-4">
                <h4 className="text-sm font-medium mb-2">Shared Media</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                    <Paperclip className="h-6 w-6 text-gray-400" />
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Download All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete All
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notes">
            <div className="p-4">
              <h4 className="text-sm font-medium mb-2">Private Notes</h4>
              <div className="border rounded-md p-3 bg-gray-50">
                <p className="text-sm text-gray-500">No notes available</p>
              </div>
              <Button className="mt-4 w-full" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Add Note
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-3">
                <h4 className="text-sm font-medium mb-2">Recent Activity</h4>

                <div className="border-l-2 border-gray-200 pl-3 py-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Message Sent</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Today, 10:30 AM</p>
                </div>

                <div className="border-l-2 border-gray-200 pl-3 py-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Chat Opened</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Today, 10:15 AM</p>
                </div>

                <div className="border-l-2 border-gray-200 pl-3 py-1">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Label Added: Demo</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Yesterday, 3:45 PM</p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
