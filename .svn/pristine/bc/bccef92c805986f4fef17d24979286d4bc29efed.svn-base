'use strict';

interface NewsletterSubscription {
  email: string;
}

// ✅ Enhanced Welcome Email Function
const sendWelcomeEmail = async (email: string) => {
  await strapi.plugin('email').service('email').send({
    to: email,
    subject: '🎉 Welcome to Entertain India! Get Latest Entertainment Updates',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
          
          <!-- Hero Section -->
          <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🎬✨</div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Entertain India!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your daily dose of entertainment news</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 35px 30px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <p style="font-size: 18px; color: #1F2937; font-weight: 500;">🎉 Thank you for subscribing!</p>
              <p style="color: #6B7280; line-height: 1.6;">You've just unlocked unlimited entertainment updates delivered straight to your inbox every 4 days.</p>
            </div>
            
            <!-- Two Column Layout for Languages -->
            <div style="display: flex; gap: 20px; margin: 30px 0; flex-wrap: wrap;">
              <!-- English Card -->
              <div style="flex: 1; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); padding: 25px; border-radius: 12px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 10px;">🇬🇧</div>
                <h3 style="color: #1E3A8A; margin: 10px 0; font-size: 20px;">English Content</h3>
                <p style="color: #3B82F6; margin: 10px 0; font-size: 14px;">Latest Bollywood, Hollywood & Web Series</p>
                <a href="https://entertainindia.com" 
                   style="display: inline-block; background: #2563EB; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 8px; margin-top: 15px; font-weight: 500;">
                  Visit entertainindia.com →
                </a>
              </div>
              
              <!-- Hindi Card -->
              <div style="flex: 1; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); padding: 25px; border-radius: 12px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 10px;">🇮🇳</div>
                <h3 style="color: #92400E; margin: 10px 0; font-size: 20px;">हिंदी सामग्री</h3>
                <p style="color: #D97706; margin: 10px 0; font-size: 14px;">बॉलीवुड, टीवी सीरियल और मनोरंजन</p>
                <a href="https://entertainindia.in" 
                   style="display: inline-block; background: #D97706; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 8px; margin-top: 15px; font-weight: 500;">
                  entertainindia.in पर जाएं →
                </a>
              </div>
            </div>
            
            <!-- What You'll Get Section -->
            <div style="background: #F9FAFB; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 18px;">✨ What You'll Receive ✨</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 150px;">
                  <p style="margin: 8px 0;">📰 <strong>Latest Articles</strong><br/><span style="font-size: 12px; color: #6B7280;">Every 4 days</span></p>
                  <p style="margin: 8px 0;">🎬 <strong>Bollywood Updates</strong><br/><span style="font-size: 12px; color: #6B7280;">Movies & Stars</span></p>
                </div>
                <div style="flex: 1; min-width: 150px;">
                  <p style="margin: 8px 0;">📺 <strong>Web Series Reviews</strong><br/><span style="font-size: 12px; color: #6B7280;">Netflix, Prime & More</span></p>
                  <p style="margin: 8px 0;">🌟 <strong>Exclusive Content</strong><br/><span style="font-size: 12px; color: #6B7280;">Behind the Scenes</span></p>
                </div>
              </div>
            </div>
            
            <!-- Quick Tips Box -->
            <div style="background: #F0FDF4; border-left: 4px solid #10B981; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #065F46; font-size: 14px;">
                💡 <strong>Quick Tip:</strong> Add <strong>entertainindia.in@gmail.com</strong> to your contacts to ensure you never miss our emails!
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #1F2937; padding: 30px 20px; text-align: center;">
            <p style="color: #9CA3AF; margin: 0 0 10px; font-size: 12px;">
              You received this email because you subscribed to Entertain India newsletter.
            </p>
            <p style="color: #9CA3AF; margin: 0 0 15px; font-size: 12px;">
              <a href="https://entertainindia.com/unsubscribe?email=${email}" style="color: #9CA3AF; text-decoration: underline;">Unsubscribe</a> | 
              <a href="https://entertainindia.com" style="color: #9CA3AF; text-decoration: underline;">Visit Website</a> |
              <a href="mailto:entertainindia.in@gmail.com" style="color: #9CA3AF; text-decoration: underline;">Contact Us</a>
            </p>
            <p style="color: #6B7280; margin: 0; font-size: 11px;">
              © 2024 Entertain India. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

// Admin Notification
const sendAdminNotification = async (email: string) => {
  await strapi.plugin('email').service('email').send({
    to: process.env.ADMIN_EMAIL || 'entertainindia.in@gmail.com',
    subject: '🎉 New Newsletter Subscription!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #F3F4F6; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4F46E5;">✨ New Subscriber Alert!</h2>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>🕐 Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>📊 Total Subscribers:</strong> Need to check in admin panel</p>
          <hr style="margin: 20px 0;" />
          <p style="color: #6B7280;">Login to Strapi admin to view all subscribers.</p>
        </div>
      </body>
      </html>
    `,
  });
};

const sendNewsletterEmails = async (result: NewsletterSubscription) => {
  try {
    const { email } = result;

    if (!email) {
      console.log('⚠️ No email found, skipping...');
      return;
    }

    console.log(`📧 New subscriber: ${email}`);

    // 1. Admin notification
    await sendAdminNotification(email);
    console.log("✅ Admin email sent");

    // 2. Welcome email to subscriber
    await sendWelcomeEmail(email);
    console.log("✅ Welcome email sent");

  } catch (error) {
    console.error('❌ Email error:', error);
  }
};

interface LifecycleEvent {
  result: NewsletterSubscription;
}

export default {
  async afterCreate(event: LifecycleEvent) {
    console.log("🔥 Newsletter afterCreate hook chala!");
    console.log("Result:", event.result);

    await sendNewsletterEmails(event.result);
  }
};
