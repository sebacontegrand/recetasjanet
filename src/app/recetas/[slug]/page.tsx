import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, ChefHat, Printer, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export default async function RecipePage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const recipe = await prisma.recipe.findUnique({
        where: { slug: params.slug },
        include: {
            category: true,
            tags: true,
            media: true,
            ingredients: { orderBy: { order: 'asc' } },
            steps: { orderBy: { order: 'asc' }, include: { media: true } },
        }
    })

    if (!recipe || !recipe.isPublished) {
        notFound()
    }

    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
    const heroImage = recipe.media.length > 0
        ? recipe.media[0].url
        : "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop"

    return (
        <main className="min-h-screen bg-warm-50 pb-20">
            <div className="w-full h-[40vh] md:h-[60vh] relative bg-warm-200">
                <Image
                    src={heroImage}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-900/80 via-warm-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {recipe.category && (
                                <Badge className="bg-brand-primary border-none">{recipe.category.name}</Badge>
                            )}
                            {recipe.tags.map((tag: any) => (
                                <Badge key={tag.id} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{recipe.title}</h1>
                        {recipe.description && (
                            <p className="text-lg md:text-xl text-warm-50/90 max-w-2xl font-light">
                                {recipe.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-sm border border-warm-200 p-6 flex flex-wrap items-center justify-between gap-6 mb-12">
                    <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center text-warm-800">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-warm-800/60 uppercase font-semibold">Tiempo total</p>
                                <p className="font-medium">{totalTime > 0 ? `${totalTime} min` : 'Variables'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center text-warm-800">
                                <ChefHat className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-warm-800/60 uppercase font-semibold">Dificultad</p>
                                <p className="font-medium">{recipe.difficulty || 'Media'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center text-warm-800 text-lg font-serif italic">
                                R
                            </div>
                            <div>
                                <p className="text-xs text-warm-800/60 uppercase font-semibold">Rinde</p>
                                <p className="font-medium">{recipe.portions ? `${recipe.portions} porciones` : 'A gusto'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2">
                            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Imprimir</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2">
                            <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Compartir</span>
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-1">
                        <div className="sticky top-6">
                            <h2 className="text-2xl font-serif text-warm-900 mb-6">Ingredientes</h2>
                            <ul className="space-y-4">
                                {recipe.ingredients.map((ing: any) => (
                                    <li key={ing.id} className="flex items-start gap-3 border-b border-warm-200/50 pb-3 last:border-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-warm-900">
                                                {ing.quantity && <span className="font-medium">{ing.quantity}</span>}{' '}
                                                {ing.unit && <span className="text-warm-800 font-medium">{ing.unit}</span>}{' '}
                                                {ing.item}
                                            </p>
                                            {ing.note && <p className="text-sm text-warm-800/70 italic mt-0.5">{ing.note}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-serif text-warm-900 mb-6">Paso a paso</h2>
                        <div className="space-y-10">
                            {recipe.steps.map((step: any, idx: number) => (
                                <div key={step.id} className="relative pl-12 flex flex-col gap-4">
                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-serif font-bold text-lg">
                                        {idx + 1}
                                    </div>

                                    <div className="text-warm-900 leading-relaxed text-lg">
                                        {step.text}
                                    </div>

                                    {step.timer && (
                                        <div className="inline-flex items-center gap-2 text-sm text-brand-secondary bg-brand-secondary/10 px-3 py-1.5 rounded-md w-fit">
                                            <Clock className="w-4 h-4" />
                                            Timer recomendado: <strong>{step.timer} min</strong>
                                        </div>
                                    )}

                                    {step.media.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {step.media.map((m: any) => (
                                                <div key={m.id} className="relative aspect-video rounded-lg overflow-hidden bg-warm-200">
                                                    <Image src={m.url} fill alt={m.alt || `Paso ${idx + 1}`} className="object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {recipe.notes && (
                            <div className="mt-12 bg-warm-100 rounded-2xl p-6 md:p-8 border border-warm-200 text-warm-900">
                                <h3 className="text-xl font-serif font-bold mb-3 flex items-center gap-2">
                                    <span className="text-brand-primary">★</span> Tips que no fallan
                                </h3>
                                <div className="whitespace-pre-line text-warm-800 leading-relaxed">
                                    {recipe.notes}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
