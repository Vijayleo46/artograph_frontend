import sgMail from '@sendgrid/mail'

// Configure SendGrid only when a non-empty API key is provided.
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== '') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface SendAssignmentEmailParams {
  to: string
  therapistName: string
  assignmentTitle: string
  taskDescription: string
  learningObjectives: string
  reflectionPrompts: string
  therapistNote?: string
}

export async function sendAssignmentEmail(
  params: SendAssignmentEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const key = process.env.SENDGRID_API_KEY

  // Dev mock mode: explicitly set SENDGRID_API_KEY="" in .env to simulate sends.
  if (key === '') {
    console.warn('SendGrid mock mode active — email not sent but will be treated as successful in dev.')
    return { success: true, messageId: 'mock' }
  }

  if (!key) {
    console.warn('SendGrid API key not configured. Email sending disabled.')
    return {
      success: false,
      error: 'Email service not configured'
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0ea5e9; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; color: #0ea5e9; margin-bottom: 10px; }
        .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${params.assignmentTitle}</h1>
        </div>
        <div class="content">
          ${params.therapistNote ? `<p><strong>Note from ${params.therapistName}:</strong> ${params.therapistNote}</p><hr>` : ''}
          
          <div class="section">
            <div class="section-title">Assignment Description</div>
            <div>${params.taskDescription.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Learning Objectives</div>
            <div>${params.learningObjectives.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Reflection Prompts</div>
            <div>${params.reflectionPrompts.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="section">
            <p><strong>Please complete this assignment and reply with your reflections before our next session.</strong></p>
          </div>
        </div>
        <div class="footer">
          <p>This email contains confidential information. Please do not forward or share this content.</p>
          <p>If you have any questions, please contact ${params.therapistName} directly.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const msg = {
    to: params.to,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@therapyassignments.com',
    subject: `Therapy Assignment: ${params.assignmentTitle}`,
    html: htmlContent,
  }

  try {
    const [response] = await sgMail.send(msg)
    return {
      success: true,
      messageId: response.headers['x-message-id'] as string
    }
  } catch (error: any) {
    console.error('SendGrid error:', error)

    // Prefer structured SendGrid error messages when available
    let errMsg = error?.message || 'Failed to send email'

    // SendGrid v3 errors may include a response.body.errors array
    try {
      const sgBody = error?.response?.body
      if (sgBody) {
        if (Array.isArray(sgBody.errors)) {
          errMsg = sgBody.errors.map((e: any) => e.message).join('; ')
        } else if (typeof sgBody === 'string') {
          errMsg = sgBody
        }
      }
    } catch (e) {
      // ignore
    }

    // Map 401/Unauthorized to clearer message
    const status = error?.response?.statusCode || error?.status || error?.code
    if (status === 401) {
      errMsg = 'Unauthorized: invalid SendGrid API key'
    }

    return {
      success: false,
      error: errMsg
    }
  }
}




