"use client"

import { TbRefreshDot } from 'react-icons/tb'
import { IoHelpCircleOutline } from "react-icons/io5"
import {HiChevronUpDown} from 'react-icons/hi2'
import {MdInstallDesktop , MdNotificationsOff} from 'react-icons/md'
import { BsStars , BsListTask } from "react-icons/bs"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BsChatDotsFill } from "react-icons/bs";

interface TopNavProps {
  className?: string
}

export function TopNav({ className }: TopNavProps) {
  return (
    <div className={cn("h-10 border-b flex items-center justify-between px-4 bg-white", className)}>
      <div className="flex items-center">
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <BsChatDotsFill />
          <span className="text-sm font-medium ">chats</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {/* <RefreshCw className="h-4 w-4 text-gray-600" /> */}
                <TbRefreshDot />
                <span>Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-black">
                <IoHelpCircleOutline className="" />
                <span>Help</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-1 mx-1 px-1">
          <Button variant='outline' size='sm' className="h-8" >
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-xs font-medium text-gray-600">5 / 6 phones</span>
            <HiChevronUpDown/>
          </Button>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 ">
                <MdInstallDesktop/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Install</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8">
                <MdNotificationsOff/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <BsStars className="text-yellow-300"/>
                <BsListTask/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Menu</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
