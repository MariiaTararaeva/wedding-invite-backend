// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Delete existing data (optional, to clean your dev DB)
  await prisma.filledField.deleteMany({})
  await prisma.invitation.deleteMany({})
  await prisma.templateField.deleteMany({})
  await prisma.template.deleteMany({})

  // Create "Classic" template
  const classicTemplate = await prisma.template.create({
    data: {
      name: 'Classic',
      description: 'A traditional wedding invitation layout',
      imageUrl: 'https://example.com/classic.jpg',
      fields: {
        create: [
          {
            name: 'names',
            label: 'Couple Names',
            isEditable: true,
            defaultText: ''
          },
          {
            name: 'venue',
            label: 'Venue',
            isEditable: true,
            defaultText: ''
          },
          {
            name: 'footer',
            label: 'Footer Note',
            isEditable: false, // user can't change this
            defaultText: "We can't wait to celebrate with you!"
          }
        ]
      }
    }
  })

  // Create "Modern" template
  const modernTemplate = await prisma.template.create({
    data: {
      name: 'Modern',
      description: 'A sleek and contemporary design',
      imageUrl: 'https://example.com/modern.jpg',
      fields: {
        create: [
          {
            name: 'title',
            label: 'Title',
            isEditable: true,
            defaultText: "You're Invited!"
          },
          {
            name: 'date',
            label: 'Date',
            isEditable: true,
            defaultText: ''
          },
          {
            name: 'rsvp',
            label: 'RSVP Instructions',
            isEditable: false,
            defaultText: 'Please RSVP by May 1st'
          }
        ]
      }
    }
  })

  console.log('Seeded templates:', { classicTemplate, modernTemplate })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
