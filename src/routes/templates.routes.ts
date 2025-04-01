import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../../prisma/client' // Adjust path to your Prisma client

const router = Router()
console.log("Templates route loaded")

// GET /api/templates
router.get('/', async (req, res, next) => {
  console.log("Fetching all templates")
  try {
    const template = await prisma.template.findMany({
      include: {
        fields: true
      }
    })
    res.json(template)
  } catch (err) {
    next(err)
  }
})

// GET /api/templates/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid template ID format (must be a number)' })
    return
  }
  try {
    const template = await prisma.template.findUnique({
      where: { id },
      include: { fields: true }
    })
    console.log('template from DB:', template)
    if (!template) {
       res.status(404).json({ message: 'Template not found' })
       return
    }
    res.json(template)
  } catch (err) {
    next(err)
  }
})

export default router
