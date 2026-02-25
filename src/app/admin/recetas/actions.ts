'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createRecipe(formData: FormData) {
    // Extract simple fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const prepTime = parseInt(formData.get('prepTime') as string) || 0
    const cookTime = parseInt(formData.get('cookTime') as string) || 0
    const portions = parseInt(formData.get('portions') as string) || 0
    const difficulty = formData.get('difficulty') as string
    const isPublished = formData.get('isPublished') === 'on'
    const notes = formData.get('notes') as string
    const rawTags = formData.get('tags') as string

    // Simple slug generation
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    // Extract array fields using a hacky prefix methodology or JSON
    const ingredientsStr = formData.get('ingredientsJson') as string
    const stepsStr = formData.get('stepsJson') as string

    const ingredients = ingredientsStr ? JSON.parse(ingredientsStr) : []
    const steps = stepsStr ? JSON.parse(stepsStr) : []

    // Process tags
    const tagsList = rawTags.split(',').map(t => t.trim()).filter(Boolean)
    const tagsConnectOrCreate = tagsList.map(tag => ({
        where: { name: tag },
        create: { name: tag, slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
    }))

    const id = formData.get('id') as string
    const mainImageUrl = formData.get('mainImageUrl') as string
    const recipeData = {
        title,
        slug,
        description,
        prepTime,
        cookTime,
        portions,
        difficulty,
        isPublished,
        notes,
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
        tags: {
            connectOrCreate: tagsConnectOrCreate
        }
    }

    const stepsCreateData = steps.map((step: any, i: number) => {
        const stepData: any = {
            order: i,
            text: step.text,
            timer: parseInt(step.timer) || null,
        }
        if (step.mediaUrl) {
            stepData.media = {
                create: {
                    url: step.mediaUrl,
                    type: 'IMAGE',
                    alt: `Paso ${i + 1} de ${title}`
                }
            }
        }
        return stepData
    })

    const mediaCreateData = mainImageUrl ? {
        create: {
            url: mainImageUrl,
            type: 'IMAGE',
            alt: title
        }
    } : undefined

    if (id) {
        // Update existing
        // We must rebuild relations, specifically ingredients and steps 
        // Usually easier to delete existing nested items and recreate them for simple arrays
        await prisma.recipe.update({
            where: { id },
            data: {
                ...recipeData,
                ingredients: {
                    deleteMany: {},
                    create: ingredients.map((ing: any, i: number) => ({
                        order: i,
                        quantity: ing.quantity,
                        unit: ing.unit,
                        item: ing.item,
                        note: ing.note,
                    }))
                },
                steps: {
                    deleteMany: {},
                    create: stepsCreateData
                },
                media: {
                    deleteMany: {},
                    ...(mediaCreateData ? mediaCreateData : {})
                }
            }
        })
    } else {
        // Create new
        await prisma.recipe.create({
            data: {
                ...recipeData,
                ingredients: {
                    create: ingredients.map((ing: any, i: number) => ({
                        order: i,
                        quantity: ing.quantity,
                        unit: ing.unit,
                        item: ing.item,
                        note: ing.note,
                    }))
                },
                steps: {
                    create: stepsCreateData
                },
                media: mediaCreateData
            }
        })
    }

    revalidatePath('/')
    revalidatePath('/recetas')
    revalidatePath('/admin')
    redirect('/admin')
}
