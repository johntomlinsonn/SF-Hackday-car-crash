import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 md:px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} State Farm Mutual Automobile Insurance Company</p>
          <p>Bloomington, IL</p>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
          <Link href="#" className="hover:underline">
            Privacy
          </Link>
          <Link href="#" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="#" className="hover:underline">
            Accessibility
          </Link>
          <Link href="#" className="hover:underline">
            Site Map
          </Link>
          <Link href="#" className="hover:underline">
            Careers
          </Link>
        </nav>
      </div>
    </footer>
  )
}
