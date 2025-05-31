import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/app/utils/auth'
import { getVotingResults } from '@/app/utils/voting'

export async function GET(request: Request) {
  try {
    // Verify authentication and admin access
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await verifyAuthToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      )
    }

    // Check admin privileges
    const userEmail = payload.email as string
    if (!userEmail || !userEmail.includes('admin')) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    // Get voting results
    const votingResults = await getVotingResults()
    const totalVotes = votingResults.reduce((sum, option) => sum + option.votes, 0)
    
    // Generate CSV content
    let csvContent = 'Option ID,Option Title,Votes,Percentage\n'
    
    votingResults.forEach(option => {
      const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(2) : '0.00'
      csvContent += `"${option.id}","${option.title}",${option.votes},${percentage}%\n`
    })
    
    // Add summary row
    csvContent += `\n"TOTAL","Total Votes",${totalVotes},100.00%\n`
    
    // Add export metadata
    csvContent += `\n"EXPORT_DATE","${new Date().toISOString()}","",""\n`
    csvContent += `"EXPORT_BY","${userEmail}","",""\n`

    // Return CSV as downloadable file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="voting-results-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json(
      { error: 'エクスポートに失敗しました' },
      { status: 500 }
    )
  }
}