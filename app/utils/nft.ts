// NFT ownership verification using Blockfrost API

export interface NFTData {
  nftCount: number
  policyId: string
  assets?: any[]
}

export async function checkNFTOwnership(walletAddress: string): Promise<NFTData | null> {
  try {
    const blockfrostApiKey = process.env.BLOCKFROST_API_KEY
    const blockfrostBaseUrl = process.env.BLOCKFROST_BASE_URL
    const targetPolicyId = process.env.TARGET_POLICY_ID

    if (!blockfrostApiKey || !blockfrostBaseUrl || !targetPolicyId) {
      console.warn('Blockfrost API or policy ID not configured')
      return null
    }

    // Get all assets in the wallet
    const response = await fetch(`${blockfrostBaseUrl}/addresses/${walletAddress}`, {
      headers: {
        'project_id': blockfrostApiKey,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Blockfrost API error:', response.status, response.statusText)
      return null
    }

    const addressData = await response.json()
    
    // Get detailed asset information
    const assetsResponse = await fetch(`${blockfrostBaseUrl}/addresses/${walletAddress}/utxos`, {
      headers: {
        'project_id': blockfrostApiKey,
        'Content-Type': 'application/json'
      }
    })

    if (!assetsResponse.ok) {
      console.error('Blockfrost assets API error:', assetsResponse.status, assetsResponse.statusText)
      return null
    }

    const utxos = await assetsResponse.json()
    
    // Count NFTs with the target policy ID
    let nftCount = 0
    const matchingAssets = []

    for (const utxo of utxos) {
      if (utxo.amount) {
        for (const amount of utxo.amount) {
          if (amount.unit && amount.unit.startsWith(targetPolicyId)) {
            nftCount += parseInt(amount.quantity)
            matchingAssets.push({
              unit: amount.unit,
              quantity: amount.quantity,
              policyId: targetPolicyId
            })
          }
        }
      }
    }

    return {
      nftCount,
      policyId: targetPolicyId,
      assets: matchingAssets
    }
  } catch (error) {
    console.error('NFT ownership check failed:', error)
    return null
  }
}

// Alternative method using Koios API (free Cardano API)
export async function checkNFTOwnershipKoios(walletAddress: string): Promise<NFTData | null> {
  try {
    const targetPolicyId = process.env.TARGET_POLICY_ID

    if (!targetPolicyId) {
      console.warn('Target policy ID not configured')
      return null
    }

    // Use Koios API as fallback (free alternative to Blockfrost)
    const response = await fetch(`https://api.koios.rest/api/v1/address_assets?_address=${walletAddress}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Koios API error:', response.status, response.statusText)
      return null
    }

    const assets = await response.json()
    
    // Count NFTs with the target policy ID
    let nftCount = 0
    const matchingAssets = []

    if (Array.isArray(assets)) {
      for (const asset of assets) {
        if (asset.policy_id === targetPolicyId) {
          nftCount += parseInt(asset.quantity || '0')
          matchingAssets.push(asset)
        }
      }
    }

    return {
      nftCount,
      policyId: targetPolicyId,
      assets: matchingAssets
    }
  } catch (error) {
    console.error('Koios NFT ownership check failed:', error)
    return null
  }
}

// Main function that tries Blockfrost first, then falls back to Koios
export async function checkNFTOwnershipWithFallback(walletAddress: string): Promise<NFTData | null> {
  // Try Blockfrost first (if configured)
  const blockfrostResult = await checkNFTOwnership(walletAddress)
  if (blockfrostResult) {
    return blockfrostResult
  }

  // Fallback to Koios
  return await checkNFTOwnershipKoios(walletAddress)
}
