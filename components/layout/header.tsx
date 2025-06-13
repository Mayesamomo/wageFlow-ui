"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/auth-provider"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex-1" />

      {/* Navigation */}
      <nav className="flex items-center gap-8">
        <Link href="/dashboard" className="text-sm font-medium text-gray-900">
          Dashboard
        </Link>
        <Link href="/shifts" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Shifts
        </Link>
        <Link href="/clients" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Clients
        </Link>
        <Link href="/mileage" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Mileage
        </Link>
        <Link href="/invoices" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Invoices
        </Link>
        <Link href="/reports" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Reports
        </Link>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-blue-600">
            <span className="sr-only">1 notification</span>
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full bg-gray-200 p-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user?.name?.charAt(0) || "U"}</span>
              </div>
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
