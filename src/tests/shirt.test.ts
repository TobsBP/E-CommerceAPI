import { expect, it, vi, beforeEach } from 'vitest'
import { createShirt, getShirts } from '@/repositories/shirt.repository'
import { ShirtSchema } from '@/types/Schemas/shirt.schema'
import { describe } from 'node:test'

const mockDb = {
	insertOne: vi.fn(),
	findOne: vi.fn(),
}

vi.mock('@/config/database', () => ({
	shirtCollection: vi.fn(() => Promise.resolve(mockDb)),
}))

beforeEach(() => {
	vi.clearAllMocks()
})

describe('Success cases', () => {
  it('should create a new shirt', async () => {
	mockDb.insertOne.mockResolvedValue({ acknowledged: true })

	const shirtData = {
		name: 'T-Shirt X',
		brand: 'Brand Y',
		size: 'M',
		price: 49.99,
		stock: 10,
		color: 'Black',
		category: 'Casual',
		material: 'Cotton',
		gender: 'Unisex',
	}

	const parsed = ShirtSchema.parse(shirtData)
	const result = await createShirt(parsed)

	expect(mockDb.insertOne).toHaveBeenCalledOnce()
	expect(result).toHaveProperty('acknowledged', true)
  })

  it('should return a shirt by name', async () => {
	const shirtName = 'T-Shirt X'
	const shirtFromDb = {
		name: shirtName,
		brand: 'Brand X',
		size: 'M',
		price: 50,
		stock: 10,
		color: 'Red',
		category: 'Casual',
		material: 'Cotton',
		gender: 'Unisex',
	}

	mockDb.findOne.mockResolvedValue(shirtFromDb)

	const result = await getShirts(shirtName)

	expect(mockDb.findOne).toHaveBeenCalledOnce()
	expect(result).toEqual(shirtFromDb)
  })
})

describe('Fail cases', () => {
  // it('Shout trhow an error', async () => {
    
  // })
})