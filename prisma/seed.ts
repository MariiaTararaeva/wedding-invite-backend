// Data seeding is the process of populating a database with an initial set of data. This is often done to set up a development or testing environment with some sample data. In this case, we are seeding a database with templates for wedding invitations.
// This script uses Prisma, an ORM (Object-Relational Mapping) tool, to interact with the database. It creates two templates: "Classic" and "Modern", each with a set of fields that can be filled out by users.
// The script first deletes any existing data in the relevant tables to ensure a clean slate. Then, it creates the templates and their associated fields. Finally, it logs the seeded templates to the console.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Delete existing data (optional, to clean your dev DB)
  await prisma.filledField.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.templateField.deleteMany({});
  await prisma.template.deleteMany({});

  // Create "Classic" template
  const classicTemplate = await prisma.template.create({
    data: {
      name: "Classic",
      description: "A traditional wedding invitation layout",
      imageUrl: "",
      fields: {
        create: [
          {
            name: "names",
            label: "Couple Names",
            isEditable: true,
            defaultText: "",
          },
          {
            name: "venue",
            label: "Venue",
            isEditable: true,
            defaultText: "",
          },
          {
            name: "footer",
            label: "Footer Note",
            isEditable: false, // user can't change this
            defaultText: "We can't wait to celebrate with you!",
          },
        ],
      },
    },
  });

  // Create "Modern" template
  const modernTemplate = await prisma.template.create({
    data: {
      name: "Modern",
      description: "A sleek and contemporary design",
      imageUrl: "",
      fields: {
        create: [
          {
            name: "title",
            label: "Title",
            isEditable: true,
            defaultText: "You're Invited!",
          },
          {
            name: "date",
            label: "Date",
            isEditable: true,
            defaultText: "",
          },
          {
            name: "rsvp",
            label: "RSVP Instructions",
            isEditable: false,
            defaultText: "Please RSVP by May 1st",
          },
        ],
      },
    },
  });

  console.log("Seeded templates:", { classicTemplate, modernTemplate });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
