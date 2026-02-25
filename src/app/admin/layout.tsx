import Link from 'next/link'
import { UtensilsCrossed, Settings, FolderOpen, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-warm-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-warm-200 flex flex-col md:sticky md:top-0 md:h-screen">
                <div className="h-16 flex items-center px-6 border-b border-warm-200 shrink-0 bg-warm-800 text-warm-50">
                    <UtensilsCrossed className="w-5 h-5 mr-3" />
                    <span className="font-serif font-bold text-lg tracking-wide shadow-sm">Dashboard</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-warm-100 text-warm-900 font-medium">
                        <UtensilsCrossed className="w-4 h-4" />
                        Recetas
                    </Link>
                    <Link href="/admin/categorias" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-warm-100 text-warm-800 transition-colors">
                        <FolderOpen className="w-4 h-4" />
                        Categorías
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-warm-100 text-warm-800 transition-colors">
                        <Settings className="w-4 h-4" />
                        Configuración
                    </Link>
                </nav>

                <div className="p-4 border-t border-warm-200">
                    <Link href="/" className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-warm-800 hover:text-warm-900 border border-warm-200 rounded-md transition-colors hover:bg-warm-50">
                        <LogOut className="w-4 h-4" />
                        Salir al sitio
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
                {children}
            </main>
        </div>
    )
}
