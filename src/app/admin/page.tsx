import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit3, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const revalidate = 0 // Admin dashboard should always be fresh

export default async function AdminDashboard() {
    const recipes = await prisma.recipe.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            category: true,
        }
    })

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-warm-900 mb-1">Mis Recetas</h1>
                    <p className="text-warm-800 text-sm">Gestioná las recetas publicadas y borradores.</p>
                </div>

                <Link href="/admin/recetas/create">
                    <Button className="gap-2 shadow-sm">
                        <Plus className="w-4 h-4" /> Nueva receta
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-warm-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-warm-50 border-b border-warm-200 text-warm-800/80 font-medium tracking-wide">
                            <tr>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Creación</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-100">
                            {recipes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-warm-800/60 italic">
                                        No hay recetas. ¡Creá la primera!
                                    </td>
                                </tr>
                            ) : (
                                recipes.map((recipe: any) => (
                                    <tr key={recipe.id} className="hover:bg-warm-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-warm-900 truncate max-w-[250px]">
                                            {recipe.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {recipe.isPublished ? (
                                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">Publicada</Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Borrador</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-warm-800">
                                            {recipe.category?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-warm-800">
                                            {new Date(recipe.createdAt).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/recetas/${recipe.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-warm-800/60 hover:text-brand-primary">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/recetas/${recipe.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-warm-800/60 hover:text-brand-secondary">
                                                        <Edit3 className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-warm-800/60 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
