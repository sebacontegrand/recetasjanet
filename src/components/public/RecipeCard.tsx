import Image from "next/image"
import Link from "next/link"
import { Clock, ChefHat } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecipeCardProps {
    recipe: {
        id: string
        title: string
        slug: string
        description: string | null
        prepTime: number | null
        cookTime: number | null
        difficulty: string | null
        category: { name: string } | null
        tags: { name: string }[]
        media: { url: string }[]
    }
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

    // placeholder for MVP
    const fallbackImage = "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop"
    const imageUrl = recipe.media && recipe.media.length > 0 ? recipe.media[0].url : fallbackImage

    return (
        <Link href={`/recetas/${recipe.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-xl transition-transform hover:-translate-y-1">
            <Card className="h-full border-transparent shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-warm-200">
                    <Image
                        src={imageUrl}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {recipe.category && (
                        <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-white/90 text-warm-900 border-none backdrop-blur-sm hover:bg-white shadow-sm">
                                {recipe.category.name}
                            </Badge>
                        </div>
                    )}
                </div>

                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xl group-hover:text-brand-primary transition-colors line-clamp-2">
                        {recipe.title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                    <p className="text-sm text-warm-800 line-clamp-2 mb-4 h-10">
                        {recipe.description || "Una receta clásica que no falla, ideal para compartir en cualquier ocasión."}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-2">
                        {recipe.tags.slice(0, 3).map(tag => (
                            <Badge key={tag.name} variant="outline" className="text-xs py-0 h-5 font-normal">
                                {tag.name}
                            </Badge>
                        ))}
                        {recipe.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0 h-5 font-normal text-warm-800/60 border-none">
                                +{recipe.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 text-warm-800/80 text-sm flex items-center justify-between border-t border-warm-100 mt-auto">
                    {totalTime > 0 ? (
                        <div className="flex items-center gap-1.5 mt-3">
                            <Clock className="w-4 h-4" />
                            <span>{totalTime} min</span>
                        </div>
                    ) : (
                        <div className="flex items-center md:gap-1.5 mt-3 opacity-0">
                            <Clock className="w-4 h-4" />
                            <span>- min</span>
                        </div>
                    )}

                    {recipe.difficulty && (
                        <div className="flex items-center gap-1.5 mt-3">
                            <ChefHat className="w-4 h-4 text-brand-secondary" />
                            <span>{recipe.difficulty}</span>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Link>
    )
}
