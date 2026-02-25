import { prisma } from '@/lib/prisma'
import { RecipeCard } from '@/components/public/RecipeCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export const revalidate = 60 // Revalidate every minute

export default async function Home() {
  const recipes = await prisma.recipe.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      tags: true,
      media: true,
    }
  })

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-warm-100 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-primary/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-secondary/10 blur-3xl rounded-full"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif text-warm-900 mb-6 tracking-tight">
            Recetas de <span className="font-extrabold text-brand-primary italic text-5xl md:text-7xl mx-1">Janet</span> que no fallan
          </h1>
          <p className="text-lg md:text-xl text-warm-800 mb-10 max-w-2xl mx-auto font-light">
            Cocinar es una forma de decir te quiero. Encontrá inspiración casera, simple y bien explicada para tu próxima sobremesa.
          </p>

          <form action="/recetas" method="GET" className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-800/50" />
              <Input
                type="search"
                name="q"
                placeholder="Buscar galletitas, milanesas, pan casero..."
                className="w-full pl-10 h-12 text-base rounded-full border-warm-200 shadow-sm"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-full h-12 px-8 shadow-sm">
              Buscar
            </Button>
          </form>
        </div>
      </section>

      {/* Latest Recipes Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif text-warm-900 mb-2">Domingo, mate y algo rico</h2>
            <p className="text-warm-800">Las últimas recetas publicadas para inspirarte.</p>
          </div>
          <Button variant="outline" className="hidden sm:inline-flex">
            Ver todas
          </Button>
        </div>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-warm-100/50 rounded-2xl border border-warm-200 border-dashed">
            <p className="text-warm-800 text-lg">Todavía no hay recetas publicadas.</p>
            <p className="text-warm-800/70 mt-2">¡Pronto habrá muchas delicias por descubrir!</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="w-full">
            Ver todas las recetas
          </Button>
        </div>
      </section>

      {/* Categories / Tags generic teaser */}
      <section className="bg-warm-800 text-warm-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">¿Buscando algo específico?</h2>
          <p className="text-warm-200 mb-8 max-w-xl mx-auto">Explorá nuestras colecciones pensadas para cada momento del día.</p>

          <div className="flex flex-wrap justify-center gap-4">
            {['Desayunos', 'Almuerzos', 'Meriendas', 'Cenas', 'Pastelería', 'Panificados', 'Clásicos Argentinos'].map((cat) => (
              <Button key={cat} variant="outline" className="border-warm-200/20 bg-white/5 hover:bg-white/10 text-warm-50 hover:text-white rounded-full">
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
