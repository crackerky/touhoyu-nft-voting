// In-memory user storage (use database in production)
interface User {
  id: string
  email?: string
  walletAddress?: string
  authMethod: 'email' | 'wallet'
  createdAt: Date
}

const users = new Map<string, User>()
const usersByEmail = new Map<string, string>()
const usersByWallet = new Map<string, string>()

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function createUser(userData: {
  email?: string
  walletAddress?: string
  authMethod: 'email' | 'wallet'
}): Promise<User> {
  const userId = generateUserId()
  
  const user: User = {
    id: userId,
    email: userData.email,
    walletAddress: userData.walletAddress,
    authMethod: userData.authMethod,
    createdAt: new Date()
  }
  
  users.set(userId, user)
  
  if (userData.email) {
    usersByEmail.set(userData.email, userId)
  }
  
  if (userData.walletAddress) {
    usersByWallet.set(userData.walletAddress, userId)
  }
  
  return user
}

export async function getUserById(userId: string): Promise<User | null> {
  return users.get(userId) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const userId = usersByEmail.get(email)
  return userId ? users.get(userId) || null : null
}

export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  const userId = usersByWallet.get(walletAddress)
  return userId ? users.get(userId) || null : null
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const user = users.get(userId)
  if (!user) {
    return null
  }
  
  const updatedUser = { ...user, ...updates }
  users.set(userId, updatedUser)
  
  return updatedUser
}