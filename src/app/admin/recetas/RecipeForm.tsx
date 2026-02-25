'use client'

import { Key, useState } from 'react'
import { Plus, Trash2, GripVertical, Save, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { createRecipe } from '../recetas/actions'
import Link from 'next/link'

type IngredientItem = {
    id: string | number;
    quantity: string;
    unit: string;
    item: string;
    note: string;
};

type RecipeStep = {
    id: string | number;
    text: string;
    timer: string;
    mediaUrl: string;
};

export function RecipeForm({ categories, initialData }: { categories: any[], initialData?: any }) {
    const [ingredients, setIngredients] = useState<IngredientItem[]>(() => {
        if (initialData?.ingredients?.length) return initialData.ingredients.map((ing: any) => ({ ...ing, id: ing.id || Date.now() + Math.random() }))
        return [{ id: 1, quantity: '', unit: '', item: '', note: '' }]
    })

    const [steps, setSteps] = useState<RecipeStep[]>(() => {
        if (initialData?.steps?.length) return initialData.steps.map((step: any) => ({ ...step, id: step.id || Date.now() + Math.random(), mediaUrl: step.media?.[0]?.url || '' }))
        return [{ id: 1, text: '', timer: '', mediaUrl: '' }]
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mainImageUrl, setMainImageUrl] = useState(initialData?.media?.[0]?.url || '')

    const addIngredient = () => {
        setIngredients([...ingredients, { id: Date.now(), quantity: '', unit: '', item: '', note: '' }])
    }

    const removeIngredient = (id: string | number) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter(ing => ing.id !== id))
        }
    }

    const addStep = () => {
        setSteps([...steps, { id: Date.now(), text: '', timer: '', mediaUrl: '' }])
    }

    const removeStep = (id: string | number) => {
        if (steps.length > 1) {
            setSteps(steps.filter(step => step.id !== id))
        }
    }

    return (
        <form action={async (formData) => {
            setIsSubmitting(true)
            try {
                formData.append('ingredientsJson', JSON.stringify(ingredients))
                formData.append('stepsJson', JSON.stringify(steps))
                formData.append('mainImageUrl', mainImageUrl)
                if (initialData) {
                    formData.append('id', initialData.id)
                    // updateRecipe action would be called here
                }
                await createRecipe(formData) // Ideally this should branch, but let's just use createRecipe to also handle updates
            } catch (error) {
                console.error(error)
                setIsSubmitting(false)
            }
        }} className="max-w-4xl mx-auto pb-24">

            <div className="flex items-center justify-between mb-8 sticky top-0 bg-warm-50/90 backdrop-blur-md py-4 z-10 border-b border-warm-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" type="button">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-serif text-warm-900">{initialData ? 'Editar Receta' : 'Crear Receta'}</h1>
                </div>
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? 'Guardando...' : <><Save className="w-4 h-4 mr-2" /> Guardar</>}
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Main Info */}
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-warm-200 shadow-sm space-y-6">
                        <h2 className="text-xl font-serif text-warm-900 border-b border-warm-100 pb-2">Información Básica</h2>

                        <div className="space-y-4 mb-6">
                            <label className="text-sm font-medium text-warm-900 block">Imagen Principal</label>
                            <ImageUpload value={mainImageUrl} onChange={setMainImageUrl} folder="recipes/main" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-warm-900">Título de la receta *</label>
                            <Input name="title" defaultValue={initialData?.title} required placeholder="Ej: Milanesas a la napolitana con puré" className="text-lg" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-warm-900">Historia o descripción breve</label>
                            <Textarea name="description" defaultValue={initialData?.description || ''} placeholder="Un clásico de los domingos que nunca falla..." rows={3} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-warm-900">Prep (min)</label>
                                <Input name="prepTime" defaultValue={initialData?.prepTime || ''} type="number" min="0" placeholder="15" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-warm-900">Cocción (min)</label>
                                <Input name="cookTime" defaultValue={initialData?.cookTime || ''} type="number" min="0" placeholder="45" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-warm-900">Porciones</label>
                                <Input name="portions" defaultValue={initialData?.portions || ''} type="number" min="1" placeholder="4" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-warm-900">Dificultad</label>
                                <select name="difficulty" defaultValue={initialData?.difficulty || 'Media'} className="w-full h-10 px-3 rounded-md border border-warm-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                    <option value="Fácil">Fácil</option>
                                    <option value="Media">Media</option>
                                    <option value="Difícil">Difícil</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-warm-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-warm-100 pb-2">
                            <h2 className="text-xl font-serif text-warm-900">Ingredientes</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="gap-2">
                                <Plus className="w-4 h-4" /> Agregar
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {ingredients.map((ing, i) => (
                                <div key={ing.id} className="flex gap-2 items-start group">
                                    <div className="pt-2 text-warm-400 cursor-move">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="grid grid-cols-12 gap-2 flex-1">
                                        <Input
                                            placeholder="Cant."
                                            className="col-span-3 sm:col-span-2"
                                            value={ing.quantity}
                                            onChange={e => {
                                                const newIngs = [...ingredients];
                                                newIngs[i].quantity = e.target.value;
                                                setIngredients(newIngs);
                                            }}
                                        />
                                        <Input
                                            placeholder="Uni (gr, cdta)"
                                            className="col-span-3 sm:col-span-3"
                                            value={ing.unit}
                                            onChange={e => {
                                                const newIngs = [...ingredients];
                                                newIngs[i].unit = e.target.value;
                                                setIngredients(newIngs);
                                            }}
                                        />
                                        <Input
                                            placeholder="Ingrediente principal *"
                                            className="col-span-6 sm:col-span-4"
                                            required
                                            value={ing.item}
                                            onChange={e => {
                                                const newIngs = [...ingredients];
                                                newIngs[i].item = e.target.value;
                                                setIngredients(newIngs);
                                            }}
                                        />
                                        <Input
                                            placeholder="Nota (ej: picada)"
                                            className="col-span-12 sm:col-span-3"
                                            value={ing.note}
                                            onChange={e => {
                                                const newIngs = [...ingredients];
                                                newIngs[i].note = e.target.value;
                                                setIngredients(newIngs);
                                            }}
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-warm-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={() => removeIngredient(ing.id as string | number)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-warm-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-warm-100 pb-2">
                            <h2 className="text-xl font-serif text-warm-900">Paso a Paso</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-2">
                                <Plus className="w-4 h-4" /> Agregar
                            </Button>
                        </div>

                        <div className="space-y-6 pl-2 border-l-2 border-warm-100 ml-4">
                            {steps.map((step, i) => (
                                <div key={step.id} className="relative flex gap-3 group">
                                    <div className="absolute -left-[27px] top-2 w-6 h-6 rounded-full bg-white border-2 border-brand-primary flex items-center justify-center text-xs font-bold text-brand-primary">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 space-y-2 ml-4">
                                        <Textarea
                                            placeholder="Describí este paso..."
                                            className="min-h-[100px]"
                                            required
                                            value={step.text}
                                            onChange={e => {
                                                const newSteps = [...steps];
                                                newSteps[i].text = e.target.value;
                                                setSteps(newSteps);
                                            }}
                                        />
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Tiempo en timer (min) opcional"
                                                type="number"
                                                className="w-64 max-w-full"
                                                value={step.timer}
                                                onChange={e => {
                                                    const newSteps = [...steps];
                                                    newSteps[i].timer = e.target.value;
                                                    setSteps(newSteps);
                                                }}
                                            />
                                        </div>
                                        <div className="mt-4 border-t border-warm-100 pt-4">
                                            <label className="text-xs font-semibold text-warm-800 uppercase block mb-2">Imagen del paso (opcional)</label>
                                            <ImageUpload
                                                value={step.mediaUrl}
                                                onChange={(url) => {
                                                    const newSteps = [...steps];
                                                    newSteps[i].mediaUrl = url;
                                                    setSteps(newSteps);
                                                }}
                                                folder="recipes/steps"
                                            />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-warm-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-2" onClick={() => removeStep(step.id as string | number)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-xl border border-warm-200 shadow-sm space-y-4">
                        <h2 className="text-xl font-serif text-warm-900 border-b border-warm-100 pb-2">Tips / Notas Finales</h2>
                        <Textarea name="notes" defaultValue={initialData?.notes || ''} placeholder="Se puede freezar usando tuppers herméticos..." rows={4} />
                    </div>
                </div>

                {/* Sidebar settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-warm-200 shadow-sm space-y-6 sticky top-24">
                        <h3 className="font-serif font-bold text-warm-900 border-b border-warm-100 pb-2">Publicación</h3>

                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors">
                            <input type="checkbox" name="isPublished" defaultChecked={initialData ? initialData.isPublished : true} className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary border-warm-300" />
                            <div>
                                <p className="font-medium text-brand-800">Publicar ahora</p>
                                <p className="text-xs text-brand-800/70">Si se desmarca, quedará en borradores.</p>
                            </div>
                        </label>

                        <div className="space-y-4 pt-4 border-t border-warm-100">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-warm-900">Categoría</label>
                                <select name="categoryId" defaultValue={initialData?.categoryId || ''} className="w-full h-10 px-3 rounded-md border border-warm-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" required>
                                    <option value="">Seleccionar...</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-warm-900">Etiquetas (separadas por coma)</label>
                                <Input name="tags" defaultValue={initialData?.tags?.map((t: any) => t.name).join(', ') || ''} placeholder="Sin TACC, Vegetariano, Rápido..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
