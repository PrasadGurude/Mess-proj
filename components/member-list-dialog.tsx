"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, MoreHorizontal, Crown } from "lucide-react"
import type { ChatMember } from "@/lib/types"

interface MemberListDialogProps {
  isOpen: boolean
  onClose: () => void
  members: ChatMember[]
  groupName: string
}

export function MemberListDialog({ isOpen, onClose, members, groupName }: MemberListDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = searchQuery
    ? members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (member.phone && member.phone.includes(searchQuery)),
      )
    : members

  const admins = filteredMembers.filter((member) => member.isAdmin)
  const regularMembers = filteredMembers.filter((member) => !member.isAdmin)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Group Members ({members.length})</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {admins.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Admins</h3>
              <div className="space-y-3">
                {admins.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {member.avatar ? (
                          <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        ) : (
                          <div
                            className="h-full w-full rounded-full flex items-center justify-center"
                            style={{ backgroundColor: member.color || "#6b7280" }}
                          >
                            <span className="text-sm text-white">{member.name?.charAt(0) ?? "?"}</span>
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-1">
                          {member.name}
                          <Crown className="h-3 w-3 text-yellow-500 ml-1" />
                        </div>
                        {member.phone && <div className="text-xs text-gray-500">{member.phone}</div>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Members</h3>
            <div className="space-y-3">
              {regularMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {member.avatar ? (
                        <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      ) : (
                        <div
                          className="h-full w-full rounded-full flex items-center justify-center"
                          style={{ backgroundColor: member.color || "#6b7280" }}
                        >
                          <span className="text-sm text-white">{member.name?.charAt(0) ?? "?"}</span>
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{member.name}</div>
                      {member.phone && <div className="text-xs text-gray-500">{member.phone}</div>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Members
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
