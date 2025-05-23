import { Home, MessageCircle, FileText, BarChart2, List, Bell, Settings, Users, ImageIcon, Folder } from "lucide-react"
import { AiFillHome } from "react-icons/ai";
import { BsChatDotsFill, BsStars , BsGearFill } from "react-icons/bs";
import { IoTicketSharp } from "react-icons/io5";
import { FaChartLine } from "react-icons/fa6";
import { IoIosList } from "react-icons/io";
import { BiGitRepoForked } from 'react-icons/bi'
import { HiSpeakerphone } from "react-icons/hi";
import { MdChecklist } from "react-icons/md";
import {TbStarsFilled , TbLayoutSidebarLeftExpandFilled} from 'react-icons/tb'
import { RiContactsBookFill , RiFolderImageFill } from "react-icons/ri";

import Link from "next/link"

export function Sidebar() {
  return (
    <div className="w-16 bg-white border-r flex flex-col items-center py-4 h-screen">
      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mb-6">
        <span className="text-white text-xs font-bold">P</span>
      </div>

      <div className="flex flex-col items-center space-y-2 flex-1">
        <Link href="/chats" className="text-gray-500 hover:text-green-600 text-lg p-1 hover:bg-gray-100 rounded-lg ">
          <AiFillHome />
        </Link>
        <Link href="/chats" className="text-gray-500 hover:text-green-600 text-lg p-1">
          <BsChatDotsFill />
        </Link>
        <Link href="#" className="text-gray-500 hover:text-green-600 text-lg p-1 hover:bg-gray-100 rounded-lg">
          <IoTicketSharp />
        </Link>
        <Link href="#" className="text-gray-500 hover:text-green-600 text-lg p-1 hover:bg-gray-100 rounded-lg font-bold">
          <FaChartLine />
        </Link>
        <Link href="#" className="text-gray-500 hover:text-green-600 text-lg p-1 hover:bg-gray-100 rounded-lg font-bold">
          <IoIosList />
        </Link>
        <Link href="#" className="text-gray-500 hover:text-green-600 text-lg p-1 hover:bg-gray-100 rounded-lg">
          <HiSpeakerphone />
        </Link>
        <Link href="#" className="text-gray-500 relative hover:text-green-600 text-xl py-1 pl-4 hover:bg-gray-100 rounded-lg flex">
          <BiGitRepoForked className="rotate-180"/>
          <BsStars className="text-yellow-300 text-sm" />
        </Link>
        <Link href="#" className="text-gray-500 relative hover:text-green-600 text-xl p-1 hover:bg-gray-100 rounded-lg flex">
          <RiContactsBookFill/>
        </Link>
        <Link href="#" className="text-gray-500 relative hover:text-green-600 text-xl p-2 hover:bg-gray-100 rounded-lg flex">
          <RiFolderImageFill/>
        </Link>
        <Link href="#" className="text-gray-500 relative hover:text-green-600 text-xl p-2 hover:bg-gray-100 rounded-lg flex">
          <MdChecklist/>
        </Link>
        <Link href="#" className="text-gray-500 relative hover:text-green-600 text-xl p-2 hover:bg-gray-100 rounded-lg flex">
          <BsGearFill/>
        </Link>

      </div>

      <div className="mt-auto flex flex-col items-center space-y-6 mb-4">
        <Link href="#" className="text-gray-500 hover:text-green-600 text-xl">
          <TbStarsFilled/>
        </Link>
        <Link href="#" className="text-gray-500 hover:text-green-600">
          <TbLayoutSidebarLeftExpandFilled className="text-xl" />
        </Link>
      </div>
    </div>
  )
}
