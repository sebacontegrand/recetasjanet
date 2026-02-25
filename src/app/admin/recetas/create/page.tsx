import { prisma } from '@/lib/prisma'
import { RecipeForm } from './RecipeForm'

export default async function CreateRecipePage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })

    return <RecipeForm categories={categories} />
}
