// Email utility functions for magic link authentication

export async function sendMagicLinkEmail(email: string, verificationCode: string): Promise<void> {
  // In production, integrate with email service like SendGrid, Nodemailer, etc.
  // For development, we'll just log to console
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`
=== MAGIC LINK EMAIL ===`)
    console.log(`To: ${email}`)
    console.log(`Verification Code: ${verificationCode}`)
    console.log(`========================
`)
    return
  }

  // Production email sending implementation
  try {
    // Example with SendGrid (uncomment and configure)
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Touhoyu NFT Voting - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">🎯 Touhoyu NFT Voting</h2>
          <p>こんにちは！</p>
          <p>ログイン用の認証コードです：</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1f2937; margin: 0; font-size: 32px; letter-spacing: 4px;">${verificationCode}</h1>
          </div>
          <p>このコードは10分間有効です。</p>
          <p>もしこのメールに心当たりがない場合は、無視してください。</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Touhoyu NFT Voting Team</p>
        </div>
      `
    }
    
    await sgMail.send(msg)
    console.log('Verification email sent successfully')
    */
    
    // Placeholder for email service integration
    console.log(`Email would be sent to ${email} with code ${verificationCode}`)
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error('Failed to send verification email')
  }
}

export async function sendWelcomeEmail(email: string, userName?: string): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Welcome email would be sent to ${email}`)
    return
  }

  // Production welcome email implementation
  try {
    // Similar to magic link email, integrate with your email service
    console.log(`Welcome email sent to ${email}`)
  } catch (error) {
    console.error('Welcome email sending failed:', error)
    // Don't throw error for welcome email failures
  }
}