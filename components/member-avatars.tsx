"use client"

import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ChatMember } from "@/lib/types"

interface MemberAvatarsProps {
  members: ChatMember[]
  maxVisible?: number
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}

export function MemberAvatars({ members, maxVisible = 5, size = "md", onClick }: MemberAvatarsProps) {
  const visibleMembers = members.slice(0, maxVisible)
  const remainingCount = members.length - maxVisible

  const getSize = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6"
      case "lg":
        return "h-10 w-10"
      case "md":
      default:
        return "h-8 w-8"
    }
  }

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return "text-[10px]"
      case "lg":
        return "text-sm"
      case "md":
      default:
        return "text-xs"
    }
  }

  return (
    <div
      className={`flex -space-x-2 ${onClick ? "cursor-pointer" : ""}`}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation()
              onClick()
            }
          : undefined
      }
    >
      <TooltipProvider>
        {visibleMembers.map((member) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <Avatar className={`${getSize()} border-2 border-white`}>
                {member.avatar ? (
                  <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                ) : (
                  <div
                    className={`h-full w-full rounded-full flex items-center justify-center`}
                    style={{ backgroundColor: member.color || "#6b7280" }}
                  >
                    <span className={`${getFontSize()} text-white font-medium`}>
                      {(member.name?.charAt(0) ?? "?")}
                    </span>
                  </div>
                )}
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.name}</p>
              {member.phone && <p className="text-xs text-gray-500">{member.phone}</p>}
              {member.isAdmin && <p className="text-xs text-green-500">Admin</p>}
            </TooltipContent>
          </Tooltip>
        ))}

        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className={`${getSize()} border-2 border-white bg-gray-200`}>
                <div className="h-full w-full rounded-full flex items-center justify-center">
                  <span className={`${getFontSize()} text-gray-600 font-medium`}>+{remainingCount}</span>
                </div>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} more members</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  )
}
