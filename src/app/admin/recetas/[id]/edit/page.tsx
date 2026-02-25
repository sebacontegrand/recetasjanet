import { prisma } from '@/lib/prisma'
import { RecipeForm } from '../../RecipeForm'
import { notFound } from 'next/navigation'

export default async function EditRecipePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })

    const recipe = await prisma.recipe.findUnique({
        where: { id: params.id },
        include: {
            tags: true,
            ingredients: { orderBy: { order: 'asc' } },
            steps: { orderBy: { order: 'asc' } },
        }
    })

    if (!recipe) {
        notFound()
    }

    return <RecipeForm categories={categories} initialData={recipe} />
}
