import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function ChatButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button className="bg-statefarmRed hover:bg-statefarmRed/90 text-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg">
        <MessageCircle className="h-6 w-6 mb-1" />
        <span className="text-sm font-semibold">Chat</span>
      </Button>
    </div>
  )
}
