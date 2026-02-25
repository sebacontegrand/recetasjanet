import { prisma } from '@/lib/prisma'
import { RecipeCard } from '@/components/public/RecipeCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60

export default async function RecetasPage(props: { searchParams: Promise<{ q?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || '';

    const recipes = await prisma.recipe.findMany({
        where: {
            isPublished: true,
            ...(q ? {
                OR: [
                    { title: { contains: q } },
                    { description: { contains: q } },
                ]
            } : {})
        },
        orderBy: { createdAt: 'desc' },
        include: {
            category: true,
            tags: true,
            media: true,
        }
    })

    return (
        <main className="min-h-screen bg-warm-50 pb-20 pt-10">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-serif text-warm-900 mb-4">Explorar Recetas</h1>
                    <p className="text-warm-800 max-w-xl mx-auto">
                        {q ? `Mostrando resultados para "${q}"` : 'Encontrá tu próxima receta favorita para la sobremesa familiar.'}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-warm-200 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <form action="/recetas" method="GET" className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-800/50" />
                        <Input
                            type="search"
                            name="q"
                            defaultValue={q}
                            placeholder="Buscar por nombre, ingrediente..."
                            className="pl-9 bg-warm-50/50 border-warm-200"
                        />
                    </form>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        <Button variant="outline" size="sm" className="whitespace-nowrap shrink-0">Todas</Button>
                        <Button variant="ghost" size="sm" className="whitespace-nowrap shrink-0 text-warm-800">Dulce</Button>
                        <Button variant="ghost" size="sm" className="whitespace-nowrap shrink-0 text-warm-800">Salado</Button>
                        <Button variant="ghost" size="sm" className="whitespace-nowrap shrink-0 text-warm-800">Panificados</Button>
                    </div>
                </div>

                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe: any) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-warm-200 border-dashed">
                        <p className="text-warm-800 text-lg">No encontramos recetas con esos criterios.</p>
                        <Link href="/recetas">
                            <Button variant="outline" className="mt-4">
                                Limpiar búsqueda
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}
