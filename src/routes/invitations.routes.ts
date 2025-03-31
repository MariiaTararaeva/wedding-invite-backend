import { Router } from 'express'
import prisma from '../../prisma/client'

const router = Router()

// POST /api/invitations
// Body: { templateId, guestId, filledFields: [{ fieldId, value }, ...] }
type FilledFieldInput = {
  fieldId: string
  value: string
}
router.post('/', async (req, res, next): Promise <void> => {
  try {
    const userId = req.userId || null // from auth system
    const {
      templateId,
      guestId,
      filledFields = [],
      isPaid = false
    } = req.body

    // 1) Validate the template exists
    const template = await prisma.template.findUnique({
      where: { id: Number(templateId) },
      include: { fields: true }
    })
    if (!template) {
       res.status(400).json({ message: 'Invalid templateId' })
       return
    }
  
   // Validate that all fieldIds belong to the selected template
   const validFieldIds = template.fields.map(f => f.id)
   const invalidFields = (filledFields as FilledFieldInput[]).filter(
     ff => !validFieldIds.includes(ff.fieldId)
   )

   if (invalidFields.length > 0) {
     res.status(400).json({ message: 'One or more fieldIds do not belong to the selected template.' })
     return
   }
    // 2) Create the invitation
    const invitation = await prisma.invitation.create({
      data: {
        userId: userId ? String(userId) : null, // only if your userId is numeric
        guestId,
        templateId: (templateId),
        isPaid,
        // 3) Create filledFields
        
        filledFields: {
          create: filledFields.map((ff: any) => ({
            fieldId: (ff.fieldId),
            value: ff.value
          }))
        }
      },
      include: {
        filledFields: true
      }
    })

     res.status(201).json(invitation)
     return
  } catch (err) {
    next(err)
  }
})

// GET /api/invitations/:id
// returns the invitation + filledFields (and optionally the template fields)
router.get('/:id', async (req, res, next): Promise<void> => {
  try {
    const id = req.params.id
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        filledFields: {
          include: {
            field: true // to return the `TemplateField` definition
          }
        },
        template: true
      }
    })
    if (!invitation) {
       res.status(404).json({ message: 'Invitation not found' })
       return
    }

    // Optionally combine data:
    // const combinedFields = invitation.filledFields.map(ff => ({
    //   fieldId: ff.fieldId,
    //   name: ff.field.name,
    //   label: ff.field.label,
    //   isEditable: ff.field.isEditable,
    //   defaultText: ff.field.defaultText,
    //   userValue: ff.value
    // }))

    res.json(invitation)
  } catch (err) {
    next(err)
  }
})

// PUT /api/invitations/:id - optionally let the user re-edit
router.put('/:id', async (req, res, next): Promise<void> => {
  try {
    const id = req.params.id
    const { filledFields = [], isPaid } = req.body

    // 1) Check invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: req.params.id },
      include: { filledFields: true }
    })
    if (!invitation) {
       res.status(404).json({ message: 'Invitation not found' })
       return
    }

    // 2) Update the invitation's isPaid if needed
    // or any other top-level fields
    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: {
        isPaid: typeof isPaid === 'boolean' ? isPaid : invitation.isPaid
      }
    })

    // 3) Update each FilledField if it exists & is editable
    // You can decide whether to check templateField.isEditable before updating
    for (const ff of filledFields) {
      const filledField = invitation.filledFields.find(
        (item) => item.fieldId === (ff.fieldId)
      )
      if (!filledField) {
        // Optional: skip or throw an error if the filledField doesn't exist
        continue
      }

      // Actually perform the update
      await prisma.filledField.update({
        where: { id: filledField.id },
        data: {
          value: ff.value
        }
      })
    }

     res.json({ message: 'Invitation updated successfully' })
     return
  } catch (err) {
    next(err)
  }
})

export default router
