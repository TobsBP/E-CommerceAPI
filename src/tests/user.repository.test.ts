import { expect, it, vi, beforeEach, describe } from 'vitest'
import {
	createUser,
	getUserByEmail,
	getUserById,
	updateUser,
	deleteUser,
} from '@/repositories/user.repository'
import { UserSchema } from '@/types/Schemas/user.schema'
import { ObjectId } from 'mongodb'

const mockDb = {
	insertOne: vi.fn(),
	findOne: vi.fn(),
	updateOne: vi.fn(),
	deleteOne: vi.fn(),
}

vi.mock('@/config/database', () => ({
	userCollection: vi.fn(() => Promise.resolve(mockDb)),
}))

beforeEach(() => {
	vi.clearAllMocks()
})

const userData = {
	email: 'test@example.com',
	password: 'password123',
	role: 'User',
}

describe('user.repository', () => {
	describe('createUser', () => {
		it('should create a new user successfully', async () => {
			mockDb.insertOne.mockResolvedValue({
				acknowledged: true,
				insertedId: new ObjectId(),
			})
			// Use parse but password min length is 6, so it's fine.
			const parsed = UserSchema.parse(userData)
			const result = await createUser(parsed)

			expect(mockDb.insertOne).toHaveBeenCalledWith(parsed)
			expect(result.acknowledged).toBe(true)
		})
	})

	describe('getUserByEmail', () => {
		it('should return a user if found by email', async () => {
			mockDb.findOne.mockResolvedValue(userData)
			const result = await getUserByEmail(userData.email)

			expect(mockDb.findOne).toHaveBeenCalledWith({ email: userData.email })
			expect(result).toEqual(userData)
		})
	})

	describe('getUserById', () => {
		it('should return a user if found by ID', async () => {
			const id = new ObjectId()
			mockDb.findOne.mockResolvedValue({ ...userData, _id: id })
			const result = await getUserById(id.toHexString())

			expect(mockDb.findOne).toHaveBeenCalledWith({ _id: id })
			expect(result).toEqual({ ...userData, _id: id })
		})
	})

	describe('updateUser', () => {
		it('should update a user successfully', async () => {
			const id = new ObjectId()
			mockDb.updateOne.mockResolvedValue({
				acknowledged: true,
				modifiedCount: 1,
			})
			const result = await updateUser(id.toHexString(), { role: 'Admin' })

			expect(mockDb.updateOne).toHaveBeenCalledWith(
				{ _id: id },
				{ $set: { role: 'Admin' } },
			)
			expect(result.modifiedCount).toBe(1)
		})
	})

	describe('deleteUser', () => {
		it('should delete a user successfully', async () => {
			const id = new ObjectId()
			mockDb.deleteOne.mockResolvedValue({
				acknowledged: true,
				deletedCount: 1,
			})
			const result = await deleteUser(id.toHexString())

			expect(mockDb.deleteOne).toHaveBeenCalledWith({ _id: id })
			expect(result.deletedCount).toBe(1)
		})
	})
})
