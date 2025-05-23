"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, MessageSquare, Clock, Star, ChevronRight } from "lucide-react"

interface Template {
  id: string
  name: string
  content: string
  category: string
  isFavorite: boolean
}

const dummyTemplates: Template[] = [
  {
    id: "template1",
    name: "Welcome Message",
    content: "Hello! Welcome to Periskope. How can we help you today?",
    category: "Greeting",
    isFavorite: true,
  },
  {
    id: "template2",
    name: "Follow-up",
    content: "Just following up on our previous conversation. Do you have any questions?",
    category: "Follow-up",
    isFavorite: false,
  },
  {
    id: "template3",
    name: "Thank You",
    content: "Thank you for your message. We appreciate your feedback!",
    category: "Greeting",
    isFavorite: true,
  },
  {
    id: "template4",
    name: "Out of Office",
    content: "I'm currently out of the office and will respond to your message when I return.",
    category: "Away",
    isFavorite: false,
  },
]

interface MessageTemplatesProps {
  onSelectTemplate: (content: string) => void
}

export function MessageTemplates({ onSelectTemplate }: MessageTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [templates, setTemplates] = useState<Template[]>(dummyTemplates)

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const favoriteTemplates = filteredTemplates.filter((template) => template.isFavorite)

  const toggleFavorite = (id: string) => {
    setTemplates(
      templates.map((template) => (template.id === id ? { ...template, isFavorite: !template.isFavorite } : template)),
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MessageSquare className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Message Templates</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 p-1">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectTemplate(template.content)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(template.id)
                          }}
                        >
                          <Star
                            className={`h-4 w-4 ${template.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{template.category}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No templates found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="favorites">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 p-1">
                {favoriteTemplates.length > 0 ? (
                  favoriteTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectTemplate(template.content)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(template.id)
                          }}
                        >
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{template.category}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No favorite templates</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="recent">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 p-1">
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent templates</p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Scheduled
          </Button>
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
            <Plus className="h-3 w-3" />
            Create Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
