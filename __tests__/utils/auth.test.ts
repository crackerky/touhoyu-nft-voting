import { 
  generateVerificationCode, 
  storeVerificationCode, 
  verifyCode 
} from '@/app/utils/auth'

describe('Auth Utils', () => {
  describe('generateVerificationCode', () => {
    it('generates 6-digit code', () => {
      const code = generateVerificationCode()
      expect(code).toHaveLength(6)
      expect(/^\d{6}$/.test(code)).toBe(true)
    })

    it('generates different codes', () => {
      const code1 = generateVerificationCode()
      const code2 = generateVerificationCode()
      expect(code1).not.toBe(code2)
    })
  })

  describe('verification code storage', () => {
    const testEmail = 'test@example.com'
    const testCode = '123456'

    beforeEach(() => {
      // Clear any existing codes
      jest.clearAllMocks()
    })

    it('stores and verifies code correctly', async () => {
      await storeVerificationCode(testEmail, testCode)
      const isValid = await verifyCode(testEmail, testCode)
      expect(isValid).toBe(true)
    })

    it('returns false for wrong code', async () => {
      await storeVerificationCode(testEmail, testCode)
      const isValid = await verifyCode(testEmail, 'wrong')
      expect(isValid).toBe(false)
    })

    it('returns false for non-existent email', async () => {
      const isValid = await verifyCode('nonexistent@example.com', testCode)
      expect(isValid).toBe(false)
    })

    it('removes code after successful verification', async () => {
      await storeVerificationCode(testEmail, testCode)
      
      // First verification should succeed
      let isValid = await verifyCode(testEmail, testCode)
      expect(isValid).toBe(true)
      
      // Second verification with same code should fail
      isValid = await verifyCode(testEmail, testCode)
      expect(isValid).toBe(false)
    })
  })
})