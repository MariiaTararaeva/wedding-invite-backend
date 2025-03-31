import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../../prisma/client' // Adjust path to your Prisma client

const router = Router()

// GET /api/templates
router.get('/', async (req, res, next) => {
  try {
    const templates = await prisma.template.findMany({
      include: {
        fields: true
      }
    })
    res.json(templates)
  } catch (err) {
    next(err)
  }
})

// GET /api/templates/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const template = await prisma.template.findUnique({
      where: { id },
      include: { fields: true }
    })
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
