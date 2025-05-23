"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Smile, Clock, Search } from "lucide-react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

const emojiCategories = {
  recent: ["😀", "😂", "❤️", "👍", "🙏", "🔥", "✨", "🎉"],
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  people: ["👶", "👧", "🧒", "👦", "👩", "🧑", "👨", "👵", "🧓", "👴", "👲", "👳‍♀️", "👳‍♂️", "🧕", "👮‍♀️", "👮‍♂️"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"],
  food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥"],
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEmojis = searchQuery
    ? Object.values(emojiCategories)
        .flat()
        .filter((emoji) => emoji.includes(searchQuery))
    : null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Smile className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emojis"
              className="pl-8 h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {searchQuery ? (
          <div className="p-2 grid grid-cols-8 gap-1 max-h-[300px] overflow-y-auto">
            {filteredEmojis?.map((emoji, index) => (
              <Button key={index} variant="ghost" className="h-8 w-8 p-0" onClick={() => onEmojiSelect(emoji)}>
                {emoji}
              </Button>
            )) || <div className="col-span-8 py-4 text-center text-gray-500">No emojis found</div>}
          </div>
        ) : (
          <Tabs defaultValue="recent">
            <div className="border-b">
              <TabsList className="w-full justify-start p-0 h-10">
                <TabsTrigger value="recent" className="h-10 px-3">
                  <Clock className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="smileys" className="h-10 px-3">
                  😀
                </TabsTrigger>
                <TabsTrigger value="people" className="h-10 px-3">
                  👨
                </TabsTrigger>
                <TabsTrigger value="animals" className="h-10 px-3">
                  🐶
                </TabsTrigger>
                <TabsTrigger value="food" className="h-10 px-3">
                  🍎
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-2 max-h-[250px] overflow-y-auto">
              <TabsContent value="recent" className="grid grid-cols-8 gap-1 m-0">
                {emojiCategories.recent.map((emoji, index) => (
                  <Button key={index} variant="ghost" className="h-8 w-8 p-0" onClick={() => onEmojiSelect(emoji)}>
                    {emoji}
                  </Button>
                ))}
              </TabsContent>

              <TabsContent value="smileys" className="grid grid-cols-8 gap-1 m-0">
                {emojiCategories.smileys.map((emoji, index) => (
                  <Button key={index} variant="ghost" className="h-8 w-8 p-0" onClick={() => onEmojiSelect(emoji)}>
                    {emoji}
                  </Button>
                ))}
              </TabsContent>

              <TabsContent value="people" className="grid grid-cols-8 gap-1 m-0">
                {emojiCategories.people.map((emoji, index) => (
                  <Button key={index} variant="ghost" className="h-8 w-8 p-0" onClick={() => onEmojiSelect(emoji)}>
                    {emoji}
                  </Button>
                ))}
              </TabsContent>

              <TabsContent value="animals" className="grid grid-cols-8 gap-1 m-0">
                {emojiCategories.animals.map((emoji, index) => (
                  <Button key={index} variant="ghost" className="h-8 w-8 p-0" onClick={() => onEmojiSelect(emoji)}>
                    {emoji}
                  </Button>
                ))}
              </TabsContent>

              <TabsContent value="food" className="grid grid-cols-8 gap-1 m-0">
                {emojiCategories.food.map((emoji, index) => (
                  <Button key={index} variant="ghost" className="h-8 w-8 p-0" onClick={() => onEmojiSelect(emoji)}>
                    {emoji}
                  </Button>
                ))}
              </TabsContent>
            </div>
          </Tabs>
        )}
      </PopoverContent>
    </Popover>
  )
}
