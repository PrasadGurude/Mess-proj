"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TbLayoutSidebarFilled, TbListDetails } from "react-icons/tb"
import {LuRefreshCw , LuPenLine} from 'react-icons/lu'
import { FaBarsStaggered , FaHubspot} from "react-icons/fa6"
import { HiUserGroup } from "react-icons/hi"
import { MdAlternateEmail } from "react-icons/md"
import {RiFolderImageFill} from 'react-icons/ri'
import { RiListSettingsLine } from "react-icons/ri"
import { FileText, RotateCw, Pencil, ArrowDownUp, Users, AtSign, Settings, Mail } from "lucide-react"

export function ActionSidebar() {
  const actions = [
    { icon: TbLayoutSidebarFilled, tooltip: "Sidebar" },
    { icon: LuRefreshCw, tooltip: "Refresh" },
    { icon: LuPenLine, tooltip: "Edit" },
    { icon: FaBarsStaggered, tooltip: "Sort" },
    { icon: TbListDetails, tooltip: "Contacts" },
    { icon: FaHubspot, tooltip: "Mentions" },
    { icon: HiUserGroup, tooltip: "Settings" },
    { icon: MdAlternateEmail, tooltip: "Email" },
    { icon: RiFolderImageFill, tooltip: "Email" },
    { icon: RiListSettingsLine, tooltip: "Email" },
  ]

  return (
    <div className="w-12 border-l flex flex-col items-center py-4 bg-white">
      <div className="flex flex-col items-center space-y-3 flex-1">
        {actions.map((action, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                  <action.icon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">{action.tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  )
}
