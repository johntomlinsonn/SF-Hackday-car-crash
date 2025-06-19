import Link from "next/link"
import Image from "next/image"
import { Search, HelpCircle, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="w-full bg-white border-b">
      {/* Top utility bar */}
      <div className="flex justify-end items-center h-10 px-4 md:px-6 text-sm text-gray-600 border-b">
        <nav className="flex space-x-4">
          <Link href="#" className="hover:underline flex items-center gap-1">
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Link href="#" className="hover:underline flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            Help
          </Link>
          <Link href="#" className="hover:underline flex items-center gap-1">
            <Globe className="h-4 w-4" />
            Español
          </Link>
        </nav>
      </div>

      {/* Main navigation */}
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center space-x-8">
          <Link href="#" className="flex items-center">
            <Image
              src="/placeholder.svg?height=24&width=120"
              alt="State Farm Logo"
              width={120}
              height={24}
              className="h-6 w-auto"
            />
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link href="#" className="hover:text-statefarmRed">
              Insurance
            </Link>
            <Link href="#" className="hover:text-statefarmRed">
              Banking
            </Link>
            <Link href="#" className="hover:text-statefarmRed">
              Investments
            </Link>
            <Link href="#" className="hover:text-statefarmRed">
              Claims
            </Link>
            <Link href="#" className="hover:text-statefarmRed">
              Get a Quote
            </Link>
            <Link href="#" className="hover:text-statefarmRed">
              Pay a Bill
            </Link>
            <Link href="#" className="hover:text-statefarmRed">
              Find an Agent
            </Link>
          </nav>
        </div>
        <Button className="bg-statefarmRed hover:bg-statefarmRed/90 text-white px-6 py-2 rounded-md">Log in</Button>
      </div>
    </header>
  )
}
