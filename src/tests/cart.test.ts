import { CartService } from '@/services/cart.service'
import { getShirtById } from '@/repositories/shirt.repository'
import { getCartByUser, saveCart } from '@/repositories/cart.repository'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ObjectId } from 'mongodb'
import type { UpdateResult } from 'mongodb'
import * as CartSchemaModule from '@/types/Schemas/cart.schema' // Importar o módulo inteiro

vi.mock('@/repositories/shirt.repository', () => ({
	getShirtById: vi.fn(),
}))

vi.mock('@/repositories/cart.repository', () => ({
	getCartByUser: vi.fn(),
	saveCart: vi.fn(),
}))

vi.mock('@/config/database', () => ({
	default: {},
	getDatabase: vi.fn(),
}))

// Mock do módulo CartSchema
vi.mock('@/types/Schemas/cart.schema', async (importOriginal) => {
	const actual = await importOriginal<typeof CartSchemaModule>()
	return {
		...actual,
		CartSchema: {
			...actual.CartSchema,
			safeParse: vi.fn(), // Mockar apenas safeParse
		},
	}
})

const cartService = new CartService()

describe('CartService', () => {
	const userId = 'user-123'
	const shirtId = new ObjectId()

	const shirt = {
		_id: shirtId,
		name: 'T-Shirt',
		brand: 'Brand',
		size: 'M',
		price: 100,
		stock: 10,
		color: 'Black',
		category: 'Casual',
		material: 'Cotton',
		gender: 'Unisex',
	}

	const createUpdateResult = (overrides = {}): UpdateResult => ({
		acknowledged: true,
		matchedCount: 1,
		modifiedCount: 1,
		upsertedCount: 0,
		upsertedId: null,
		...overrides,
	})

	const createMockCart = (overrides = {}) => ({
		_id: new ObjectId(),
		userId,
		items: [],
		total: 0,
		...overrides,
	})

	beforeEach(() => {
		vi.clearAllMocks()
		// Resetar o mock de safeParse para o comportamento padrão (sucesso)
		vi.mocked(CartSchemaModule.CartSchema.safeParse).mockReturnValue({
			success: true,
			data: createMockCart(), // Retornar um carrinho válido por padrão
		})
	})

	describe('addItem', () => {
		it('should add a new item to an empty cart', async () => {
			const newItem = { shirtId: shirtId.toString(), quantity: 1 }

			vi.mocked(getCartByUser).mockResolvedValue(null)
			vi.mocked(getShirtById).mockResolvedValue(shirt)
			vi.mocked(saveCart).mockResolvedValue(
				createUpdateResult({
					upsertedCount: 1,
					upsertedId: new ObjectId(),
					matchedCount: 0,
					modifiedCount: 0,
				}),
			)
			vi.mocked(CartSchemaModule.CartSchema.safeParse).mockReturnValue({
				success: true,
				data: createMockCart({
					items: [{ shirtId: shirtId.toString(), quantity: 1, price: 100 }],
					total: 100,
				}),
			})

			const result = await cartService.addItem(userId, newItem)

			expect(getCartByUser).toHaveBeenCalledWith(userId)
			expect(getShirtById).toHaveBeenCalledWith(newItem.shirtId)
			expect(saveCart).toHaveBeenCalledOnce()
			expect(result.items).toHaveLength(1)
			expect(result.items[0].quantity).toBe(1)
			expect(result.total).toBe(100)
		})

		it('should increase the quantity of an existing item', async () => {
			const existingCart = createMockCart({
				items: [{ shirtId: shirtId.toString(), quantity: 1, price: 100 }],
				total: 100,
			})
			const itemToAdd = { shirtId: shirtId.toString(), quantity: 2 }

			vi.mocked(getCartByUser).mockResolvedValue(existingCart)
			vi.mocked(saveCart).mockResolvedValue(createUpdateResult())
			vi.mocked(CartSchemaModule.CartSchema.safeParse).mockReturnValue({
				success: true,
				data: createMockCart({
					items: [{ shirtId: shirtId.toString(), quantity: 3, price: 100 }],
					total: 300,
				}),
			})

			const result = await cartService.addItem(userId, itemToAdd)

			expect(getShirtById).not.toHaveBeenCalled()
			expect(saveCart).toHaveBeenCalledOnce()
			expect(result.items).toHaveLength(1)
			expect(result.items[0].quantity).toBe(3)
			expect(result.total).toBe(300)
		})

		it('should throw an error if shirt not found', async () => {
			const newItem = { shirtId: new ObjectId().toString(), quantity: 1 }

			vi.mocked(getCartByUser).mockResolvedValue(null)
			vi.mocked(getShirtById).mockResolvedValue(null)

			await expect(cartService.addItem(userId, newItem)).rejects.toThrow(
				'Shirt not found',
			)
			expect(saveCart).not.toHaveBeenCalled()
		})

		it('should throw "Invalid cart data" if CartSchema validation fails', async () => {
			const newItem = { shirtId: shirtId.toString(), quantity: 1 }

			vi.mocked(getCartByUser).mockResolvedValue(null)
			vi.mocked(getShirtById).mockResolvedValue(shirt)
			// Forçar a falha do safeParse
			vi.mocked(CartSchemaModule.CartSchema.safeParse).mockReturnValue({
				success: false,
				error: new Error('Zod validation failed') as any, // Mockar um erro Zod
			})

			await expect(cartService.addItem(userId, newItem)).rejects.toThrow(
				'Invalid cart data',
			)
			expect(saveCart).not.toHaveBeenCalled() // Não deve salvar se a validação falhar
		})
	})

	describe('removeItem', () => {
		it('should decrease the quantity of an item', async () => {
			const existingCart = createMockCart({
				items: [{ shirtId: shirtId.toString(), quantity: 3, price: 100 }],
				total: 300,
			})
			const itemToRemove = { shirtId: shirtId.toString(), quantity: 1 }

			vi.mocked(getCartByUser).mockResolvedValue(existingCart)
			vi.mocked(saveCart).mockResolvedValue(createUpdateResult())
			vi.mocked(CartSchemaModule.CartSchema.safeParse).mockReturnValue({
				success: true,
				data: createMockCart({
					items: [{ shirtId: shirtId.toString(), quantity: 2, price: 100 }],
					total: 200,
				}),
			})

			await cartService.removeItem(userId, itemToRemove)
			const savedCart = vi.mocked(saveCart).mock.calls[0][0]

			expect(savedCart.items[0].quantity).toBe(2)
			expect(savedCart.total).toBe(200)
		})

		it('should remove an item if quantity becomes zero or less', async () => {
			const existingCart = createMockCart({
				items: [{ shirtId: shirtId.toString(), quantity: 1, price: 100 }],
				total: 100,
			})
			const itemToRemove = { shirtId: shirtId.toString(), quantity: 1 }

			vi.mocked(getCartByUser).mockResolvedValue(existingCart)
			vi.mocked(saveCart).mockResolvedValue(createUpdateResult())
			vi.mocked(CartSchemaModule.CartSchema.safeParse).mockReturnValue({
				success: true,
				data: createMockCart({
					items: [],
					total: 0,
				}),
			})

			await cartService.removeItem(userId, itemToRemove)
			const savedCart = vi.mocked(saveCart).mock.calls[0][0]

			expect(savedCart.items).toHaveLength(0)
			expect(savedCart.total).toBe(0)
		})

		it('should throw an error if item is not in cart', async () => {
			const itemToRemove = { shirtId: new ObjectId().toString(), quantity: 1 }

			vi.mocked(getCartByUser).mockResolvedValue(createMockCart())

			await expect(
				cartService.removeItem(userId, itemToRemove),
			).rejects.toThrow('Item not in cart')
		})

		it('should throw "Invalid cart data" if CartSchema validation fails during removal', async () => {
			const existingCart = createMockCart({
				items: [{ shirtId: shirtId.toString(), quantity: 1, price: 100 }],
				total: 100,
			})
			const itemToRemove = { shirtId: shirtId.toString(), quantity: 1 }

			vi.mocked(getCartByUser).mockResolvedValue(existingCart)
			// Forçar a falha do safeParse
			vi.mocked(CartSchemaModule.CartSchema.safeParse).mockReturnValue({
				success: false,
				error: new Error('Zod validation failed') as any,
			})

			await expect(cartService.removeItem(userId, itemToRemove)).rejects.toThrow(
				'Invalid cart data',
			)
			expect(saveCart).not.toHaveBeenCalled()
		})
	})

	describe('getUserCart', () => {
		it('should return an existing cart', async () => {
			const existingCart = createMockCart()

			vi.mocked(getCartByUser).mockResolvedValue(existingCart)

			const result = await cartService.getUserCart(userId)

			expect(result).toEqual(existingCart)
		})

		it('should return a new empty cart if none exists', async () => {
			vi.mocked(getCartByUser).mockResolvedValue(null)

			const result = await cartService.getUserCart(userId)

			expect(result).toEqual({
				userId,
				items: [],
				total: 0,
			})
		})
	})
})
