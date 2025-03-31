/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `names` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `rsvpLink` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `venue` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `weddingDate` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `templateId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "deletedAt",
DROP COLUMN "names",
DROP COLUMN "rsvpLink",
DROP COLUMN "template",
DROP COLUMN "venue",
DROP COLUMN "weddingDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "templateId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FilledField" (
    "id" SERIAL NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "FilledField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateField" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isEditable" BOOLEAN NOT NULL DEFAULT true,
    "defaultText" TEXT,

    CONSTRAINT "TemplateField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilledField" ADD CONSTRAINT "FilledField_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilledField" ADD CONSTRAINT "FilledField_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "TemplateField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateField" ADD CONSTRAINT "TemplateField_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
