import bcrypt from 'bcryptjs'
import { UpdateUserSchema } from '@/types/Schemas/user.schema'
import type { UserParams } from '@/types/Interfaces/IUserParams'
import {
	getUserById,
	getUsers,
	updateUser,
	deleteUser,
} from '@/repositories/user.repository'

export class UserService {
	async findUsers() {
		const users = await getUsers()
		if (!users) return []

		// We might want to exclude passwords from the result
		return users.map((u) => {
			const { ...userWithoutPassword } = u
			return { ...userWithoutPassword, id: u._id.toString() }
		})
	}

	async findUserById(id: string) {
		const user = await getUserById(id)
		if (!user) return null

		const { ...userWithoutPassword } = user
		return { ...userWithoutPassword, id: user._id.toString() }
	}

	async editUser(id: string, userData: Partial<UserParams>) {
		const parsed = UpdateUserSchema.safeParse(userData)
		if (!parsed.success) throw new Error('Invalid data sent.')

		const dataToUpdate = { ...parsed.data }

		if (dataToUpdate.password) {
			dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10)
		}

		await updateUser(id, dataToUpdate)
		return { message: 'User updated successfully' }
	}

	async removeUser(id: string) {
		const user = await getUserById(id)
		if (!user) throw new Error('User not found')

		await deleteUser(id)
		return { message: 'User deleted successfully' }
	}
}
