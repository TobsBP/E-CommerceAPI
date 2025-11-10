import { shirts } from '@/config/database'

export const shirt = async (name: string) => {
	return await shirts.findOne({ nome: name })
}
