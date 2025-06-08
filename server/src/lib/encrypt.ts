import * as CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here'

export class TokenEncryption {
	static encrypt(token: string): string {
		const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
		return encrypted
	}

	static decrypt(encryptedToken: string): string {
		try {
			const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
			const decrypted = bytes.toString(CryptoJS.enc.Utf8)
			return decrypted
		} catch (error) {
			throw new Error('Invalid encrypted token')
		}
	}
}
