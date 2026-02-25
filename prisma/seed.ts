import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import fs from 'fs';
import path from 'path';

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    const dataPath = '/Users/sebastianconte-grand/Downloads/recipes_seed_db_friendly.json';
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const seedData = JSON.parse(rawData);

    console.log('Seeding categories...');
    for (const cat of seedData.categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: {},
            create: {
                id: cat.id,
                name: cat.name,
                slug: cat.name.toLowerCase().replace(/\\s+/g, '-'),
            },
        });
    }

    console.log('Seeding tags...');
    for (const tag of seedData.tags) {
        await prisma.tag.upsert({
            where: { id: tag.id },
            update: {},
            create: {
                id: tag.id,
                name: tag.name,
                slug: tag.name.toLowerCase().replace(/\\s+/g, '-'),
            },
        });
    }

    console.log('Seeding recipes...');
    for (const r of seedData.recipes) {
        // Flatten ingredients
        const ingredientsToCreate: any[] = [];
        let ingOrder = 1;
        for (const sec of r.ingredient_sections || []) {
            for (const item of sec.items || []) {
                ingredientsToCreate.push({
                    order: ingOrder++,
                    item: `[${sec.name}] ${item.name}`,
                    quantity: item.qty,
                    unit: item.unit,
                    note: item.note,
                });
            }
        }

        // Map steps
        const stepsToCreate = (r.steps || []).map((s: any) => ({
            order: s.order,
            text: s.text,
            timer: s.timer_minutes,
        }));

        // Connect tags
        const tagConnects = (r.tag_ids || []).map((tid: string) => ({ id: tid }));

        await prisma.recipe.upsert({
            where: { slug: r.slug },
            update: {},
            create: {
                id: r.id,
                title: r.title,
                slug: r.slug,
                description: r.summary,
                story: null,
                portions: r.yield?.value || null,
                prepTime: r.times?.prep_minutes || null,
                cookTime: r.times?.bake_minutes_min || null,
                notes: r.tips ? r.tips.join('\\n') : null,
                isPublished: r.status === 'published',
                categoryId: r.category_id,
                tags: {
                    connect: tagConnects,
                },
                ingredients: {
                    create: ingredientsToCreate,
                },
                steps: {
                    create: stepsToCreate,
                },
            },
        });
    }

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
