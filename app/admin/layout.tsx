import type { ReactNode } from "react"
import { AdminNav } from "@/components/admin-nav"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 flex-shrink-0">
        <AdminNav />
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
