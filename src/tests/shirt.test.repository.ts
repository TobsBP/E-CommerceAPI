import { expect, it, vi, beforeEach, describe } from 'vitest'
import {
	createShirt,
	getShirtByName,
	getShirtById,
	updateShirt,
} from '@/repositories/shirt.repository'
import { ShirtSchema } from '@/types/Schemas/shirt.schema'
import { ObjectId } from 'mongodb'

const mockDb = {
	insertOne: vi.fn(),
	findOne: vi.fn(),
	updateOne: vi.fn(),
}

vi.mock('@/config/database', () => ({
	shirtCollection: vi.fn(() => Promise.resolve(mockDb)),
}))

beforeEach(() => {
	vi.clearAllMocks()
})

const shirtData = {
	name: 'T-Shirt X',
	brand: 'Brand Y',
	sizes: ['M', 'L'],
	price: 49.99,
	stock: 10,
	colors: ['Black', 'White'],
	category: 'Casual',
	image: 'http://example.com/image.jpg',
	rating: 4.5,
	reviews: 10,
	description: 'A cool shirt',
	features: ['Cotton', 'Unisex'],
}

describe('shirt.repository', () => {
	describe('createShirt', () => {
		it('should create a new shirt successfully', async () => {
			mockDb.insertOne.mockResolvedValue({
				acknowledged: true,
				insertedId: new ObjectId(),
			})
			const parsed = ShirtSchema.parse(shirtData)
			const result = await createShirt(parsed)

			expect(mockDb.insertOne).toHaveBeenCalledWith(parsed)
			expect(result.acknowledged).toBe(true)
		})

		it('should throw an error if database insertion fails', async () => {
			mockDb.insertOne.mockRejectedValue(new Error('Database error'))
			const parsed = ShirtSchema.parse(shirtData)

			await expect(createShirt(parsed)).rejects.toThrow('Database error')
		})
	})

	describe('getShirtByName', () => {
		it('should return a shirt if found by name', async () => {
			mockDb.findOne.mockResolvedValue(shirtData)
			const result = await getShirtByName(shirtData.name)

			expect(mockDb.findOne).toHaveBeenCalledWith({ name: shirtData.name })
			expect(result).toEqual(shirtData)
		})

		it('should return null if no shirt is found by name', async () => {
			mockDb.findOne.mockResolvedValue(null)
			const result = await getShirtByName('non-existent-shirt')

			expect(mockDb.findOne).toHaveBeenCalledWith({
				name: 'non-existent-shirt',
			})
			expect(result).toBeNull()
		})
	})

	describe('getShirtById', () => {
		it('should return a shirt if found by ID', async () => {
			const id = new ObjectId()
			mockDb.findOne.mockResolvedValue({ ...shirtData, _id: id })
			const result = await getShirtById(id.toHexString())

			expect(mockDb.findOne).toHaveBeenCalledWith({ _id: id })
			expect(result).toEqual({ ...shirtData, _id: id })
		})

		it('should return null if no shirt is found by ID', async () => {
			const id = new ObjectId()
			mockDb.findOne.mockResolvedValue(null)
			const result = await getShirtById(id.toHexString())

			expect(mockDb.findOne).toHaveBeenCalledWith({ _id: id })
			expect(result).toBeNull()
		})
	})

	describe('updateShirt', () => {
		it('should update a shirt successfully', async () => {
			mockDb.updateOne.mockResolvedValue({
				acknowledged: true,
				modifiedCount: 1,
				upsertedId: null,
				upsertedCount: 0,
				matchedCount: 1,
			})
			const { name, ...rest } = shirtData
			const result = await updateShirt(shirtData)

			expect(mockDb.updateOne).toHaveBeenCalledWith({ name }, { $set: rest })
			expect(result.modifiedCount).toBe(1)
		})

		it('should throw an error if database update fails', async () => {
			mockDb.updateOne.mockRejectedValue(new Error('Database error'))

			await expect(updateShirt(shirtData)).rejects.toThrow('Database error')
		})
	})
})
