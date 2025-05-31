// Type definitions for the NFT Voting App

export interface User {
  id: string
  email?: string
  walletAddress?: string
  authMethod: 'email' | 'wallet'
  createdAt: Date
  updatedAt?: Date
}

export interface NFTData {
  nftCount: number
  policyId: string
  assets?: NFTAsset[]
  verificationMethod?: 'blockfrost' | 'koios' | 'nmkr'
}

export interface NFTAsset {
  unit: string
  quantity: string
  policyId: string
  assetName?: string
  metadata?: any
}

export interface Vote {
  id: string
  userId: string
  optionId: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

export interface VotingOption {
  id: string
  title: string
  description: string
  votes: number
  isActive?: boolean
  createdAt?: Date
}

export interface VotingSession {
  id: string
  title: string
  description: string
  options: VotingOption[]
  startDate: Date
  endDate: Date
  isActive: boolean
  requiredNFTPolicyId: string
  totalVotes: number
}

export interface AuthToken {
  userId: string
  email?: string
  walletAddress?: string
  iat: number
  exp: number
}

export interface VerificationCode {
  code: string
  expires: number
  attempts?: number
}

export interface NMKRCustomer {
  email: string
  walletAddress?: string
  orders?: NMKROrder[]
}

export interface NMKROrder {
  id: string
  nfts?: NMKRNFTItem[]
  status: string
  createdAt: Date
}

export interface NMKRNFTItem {
  policyId: string
  assetName: string
  quantity: number
  metadata?: any
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: Omit<User, 'createdAt' | 'updatedAt'>
  error?: string
}

export interface NFTEligibilityResponse {
  eligible: boolean
  nftData?: NFTData
  hasVoted: boolean
  user?: Omit<User, 'createdAt' | 'updatedAt'>
  error?: string
}

export interface VotingResultsResponse {
  success: boolean
  results?: VotingOption[]
  totalVotes?: number
  error?: string
}

// Component Props types
export interface LoginFormProps {
  onLogin: (userData: any) => void
  loading?: boolean
}

export interface NFTVotingAppProps {
  user: any
  onLogout: () => void
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean
}

// Configuration types
export interface AppConfig {
  nmkr: {
    apiKey: string
    baseUrl: string
  }
  blockfrost: {
    apiKey: string
    baseUrl: string
  }
  voting: {
    targetPolicyId: string
    sessionDuration: number
    maxVotesPerUser: number
  }
  auth: {
    jwtSecret: string
    verificationCodeExpiry: number
    maxLoginAttempts: number
  }
}

// Error types
export class NFTVotingError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'NFTVotingError'
  }
}

export class AuthenticationError extends NFTVotingError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401)
  }
}

export class NFTVerificationError extends NFTVotingError {
  constructor(message: string) {
    super(message, 'NFT_VERIFICATION_ERROR', 403)
  }
}

export class VotingError extends NFTVotingError {
  constructor(message: string) {
    super(message, 'VOTING_ERROR', 400)
  }
}