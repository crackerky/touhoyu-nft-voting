// In-memory voting storage (use database in production)
interface Vote {
  id: string
  userId: string
  optionId: string
  timestamp: Date
}

interface VotingOption {
  id: string
  title: string
  description: string
  votes: number
}

const votes = new Map<string, Vote>()
const userVotes = new Map<string, string>() // userId -> voteId

// Mock voting options (in production, load from database)
const votingOptions: VotingOption[] = [
  {
    id: '1',
    title: 'オプション A',
    description: 'コミュニティイベントの開催',
    votes: 45
  },
  {
    id: '2',
    title: 'オプション B',
    description: 'NFTコレクションの拡張',
    votes: 32
  },
  {
    id: '3',
    title: 'オプション C',
    description: 'ロードマップの更新',
    votes: 28
  }
]

function generateVoteId(): string {
  return `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function hasUserVoted(userId: string): Promise<boolean> {
  return userVotes.has(userId)
}

export async function recordVote(userId: string, optionId: string): Promise<void> {
  // Check if user has already voted
  if (userVotes.has(userId)) {
    throw new Error('User has already voted')
  }

  // Validate option ID
  const option = votingOptions.find(opt => opt.id === optionId)
  if (!option) {
    throw new Error('Invalid voting option')
  }

  // Create vote record
  const voteId = generateVoteId()
  const vote: Vote = {
    id: voteId,
    userId,
    optionId,
    timestamp: new Date()
  }

  // Store vote
  votes.set(voteId, vote)
  userVotes.set(userId, voteId)

  // Update option vote count
  option.votes++
  
  console.log(`Vote recorded: User ${userId} voted for option ${optionId}`)
}

export async function getVotingResults(): Promise<VotingOption[]> {
  // Calculate current vote counts
  const currentCounts = new Map<string, number>()
  
  for (const vote of votes.values()) {
    const current = currentCounts.get(vote.optionId) || 0
    currentCounts.set(vote.optionId, current + 1)
  }

  // Update voting options with current counts
  return votingOptions.map(option => ({
    ...option,
    votes: (currentCounts.get(option.id) || 0) + (option.votes || 0)
  }))
}

export async function getUserVote(userId: string): Promise<Vote | null> {
  const voteId = userVotes.get(userId)
  return voteId ? votes.get(voteId) || null : null
}

export async function getVotesByOption(optionId: string): Promise<Vote[]> {
  const result: Vote[] = []
  
  for (const vote of votes.values()) {
    if (vote.optionId === optionId) {
      result.push(vote)
    }
  }
  
  return result
}

export async function getTotalVotes(): Promise<number> {
  return votes.size
}

export function getVotingOptions(): VotingOption[] {
  return votingOptions
}