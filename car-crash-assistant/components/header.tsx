import Link from "next/link"

export default function Header() {
  return (
    <header className="w-full">
      {/* Top utility bar */}
      <div className="w-full bg-[#f5f5f5] text-sm text-gray-700 flex justify-end items-center h-8 px-6">
        <nav className="flex space-x-6">
          <Link href="#" className="hover:underline">Search</Link>
          <Link href="#" className="hover:underline">Help</Link>
          <Link href="#" className="hover:underline">Español</Link>
        </nav>
      </div>
      {/* Main header */}
      <div className="w-full flex items-center justify-between h-16 px-8 border-b border-gray-200">
        {/* Logo left */}
        <div className="flex-none flex items-center">
          <Link href="#" className="flex items-center">
            <img className="-oneX-header-logo" id="oneX-sf-logo" src="https://static1.st8fm.com/en_US/dxl-1x/prod/css/images/header/state-farm-logo-4.svg" alt="State Farm Insurance and Financial Services" style={{ height: '32px', width: 'auto' }} />
          </Link>
        </div>
        {/* Nav center */}
        <nav className="flex-auto flex justify-center overflow-x-auto">
          <ul className="flex space-x-8 font-semibold text-base text-black whitespace-nowrap">
            <li><Link href="#" className="hover:underline">Insurance</Link></li>
            <li><Link href="#" className="hover:underline">Banking</Link></li>
            <li><Link href="#" className="hover:underline">Investments</Link></li>
            <li><Link href="#" className="hover:underline">Claims</Link></li>
            <li><Link href="#" className="hover:underline">Get a Quote</Link></li>
            <li><Link href="#" className="hover:underline">Pay a Bill</Link></li>
            <li><Link href="#" className="hover:underline">Find an Agent</Link></li>
          </ul>
        </nav>
        {/* Log in right */}
        <div className="flex-none flex justify-end">
          <Link href="#" className="font-bold text-[#E41B23] hover:underline">Log in</Link>
        </div>
      </div>
    </header>
  )
}
