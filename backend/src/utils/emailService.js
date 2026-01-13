const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or 'smtp.gmail.com'
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
  });
};

// Send welcome email to new subscriber
const sendWelcomeEmail = async (email) => {
  try {
    const transporter = createTransporter();

    const unsubscribeLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"PS Blog" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to PS Blog - Thanks for Subscribing!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PS Blog</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; line-height: 1.6; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
            .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 40px 20px; text-align: center; }
            .logo { font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .content { padding: 40px 30px; }
            .greeting { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; }
            .text { color: #4b5563; font-size: 16px; margin-bottom: 24px; }
            .features-box { background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb; }
            .feature-item { display: flex; align-items: flex-start; margin-bottom: 16px; }
            .feature-item:last-child { margin-bottom: 0; }
            .feature-icon { font-size: 20px; margin-right: 12px; min-width: 24px; }
            .feature-text strong { display: block; color: #1f2937; margin-bottom: 2px; }
            .feature-text { font-size: 15px; color: #4b5563; }
            .cta-button { display: block; width: fit-content; margin: 32px auto; padding: 14px 32px; background-color: #0f766e; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 50px; text-align: center; box-shadow: 0 4px 6px -1px rgba(15, 118, 110, 0.2); transition: background-color 0.2s; }
            .cta-button:hover { background-color: #115e59; }
            .divider { height: 1px; background-color: #e5e7eb; margin: 32px 0; }
            .signature { display: flex; align-items: center; margin-top: 24px; }
            .signature-info { font-size: 14px; color: #374151; }
            .signature-name { font-weight: 700; color: #111827; display: block; }
            .footer { background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
            .footer-text { font-size: 12px; color: #9ca3af; margin-bottom: 12px; }
            .footer-links a { color: #0f766e; text-decoration: none; font-weight: 500; font-size: 12px; margin: 0 8px; }
            .footer-links a:hover { text-decoration: underline; }
            /* Mobile Optimization */
            @media only screen and (max-width: 600px) {
              .container { margin: 0; border-radius: 0; width: 100%; }
              .content { padding: 24px 20px; }
              .header { padding: 30px 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">PS Blog</h1>
            </div>
            <div class="content">
              <h2 class="greeting">Thanks for Subscribing! 🎉</h2>
              <p class="text">Hi there! 👋</p>
              <p class="text">Thank you for joining <strong>PS Blog</strong>. I'm thrilled to have you as part of our growing community of tech enthusiasts and developers! You've just taken a great step towards staying ahead in the tech world.</p>
              
              <div class="features-box">
                <p style="margin-top: 0; font-weight: 600; color: #111827; margin-bottom: 16px;">Here's what you can expect:</p>
                <div class="feature-item">
                  <span class="feature-icon">📚</span>
                  <div class="feature-text"><strong>Quality Content</strong>In-depth articles on web development, MERN stack, and engineering.</div>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">💡</span>
                  <div class="feature-text"><strong>Practical Insights</strong>Real-world tips, code snippets, and tutorials you can apply immediately.</div>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🚀</span>
                  <div class="feature-text"><strong>New Posts</strong>You'll be the first to know when I publish new extensive guides.</div>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🎯</span>
                  <div class="feature-text"><strong>No Spam</strong>Only thoughtfully curated articles that matter to your growth.</div>
                </div>
              </div>
              
              <p class="text">Stay tuned for amazing content coming your way!</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="cta-button">Start Reading Now</a>
              
              <div class="divider"></div>
              
              <div class="signature">
                <div class="signature-info">
                  <span class="signature-name">Prasad Shaswat</span>
                  Full Stack Developer & Tech Enthusiast
                </div>
              </div>
            </div>
            <div class="footer">
              <p class="footer-text">You're receiving this email because you subscribed to the PS Blog newsletter.</p>
              <div class="footer-links">
                 <a href="${unsubscribeLink}">Unsubscribe</a> • 
                 <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Visit Blog</a> • 
                 <a href="#">Privacy Policy</a>
              </div>
              <p class="footer-text" style="margin-top: 20px;">© 2025 PS Blog. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send new post notification to all subscribers
const sendNewPostNotification = async (subscribers, blogPost) => {
  try {
    const transporter = createTransporter();
    const results = [];

    for (const subscriber of subscribers) {
      try {
        const unsubscribeLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        const blogLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/blog/${blogPost.slug}`;

        const mailOptions = {
          from: `"PS Blog" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject: `📝 New Post: ${blogPost.title}`,
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Post on PS Blog</title>
              <style>
                body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; line-height: 1.6; }
                .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
                .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 30px 20px; text-align: center; }
                .logo { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.5px; }
                .content { padding: 40px 30px; }
                .tag-badge { background-color: #f0fdfa; color: #0f766e; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 16px; border: 1px solid #ccfbf1; }
                .blog-title { font-size: 26px; font-weight: 800; color: #111827; margin: 0 0 16px 0; line-height: 1.3; }
                .meta-info { font-size: 14px; color: #6b7280; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }
                .blog-image-container { margin: 0 -30px 24px -30px; }
                .blog-image { width: 100%; height: auto; display: block; max-height: 300px; object-fit: cover; }
                .excerpt { font-size: 16px; color: #374151; margin-bottom: 32px; line-height: 1.7; }
                .cta-button { display: block; width: fit-content; margin: 0 auto; padding: 14px 40px; background-color: #0f766e; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px; text-align: center; transition: background-color 0.2s; }
                .cta-button:hover { background-color: #115e59; }
                .footer { background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
                .footer-text { font-size: 12px; color: #9ca3af; margin-bottom: 12px; }
                .footer-links a { color: #0f766e; text-decoration: none; font-weight: 500; font-size: 12px; margin: 0 8px; }
                @media only screen and (max-width: 600px) {
                  .container { margin: 0; border-radius: 0; width: 100%; }
                  .content { padding: 24px 20px; }
                  .blog-image-container { margin: 0 -20px 24px -20px; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 class="logo">PS Blog</h1>
                </div>
                ${blogPost.featuredImage ? `
                <div class="blog-image-container">
                  <img src="${blogPost.featuredImage.url || blogPost.featuredImage}" alt="${blogPost.title}" class="blog-image" />
                </div>` : ''}
                <div class="content">
                  <div style="text-align: center;">
                    <span class="tag-badge">${blogPost.category}</span>
                    <h2 class="blog-title">${blogPost.title}</h2>
                    <div class="meta-info" style="justify-content: center;">
                      <span>📅 ${new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>⏱️ ${blogPost.readTime} min read</span>
                    </div>
                  </div>
                  
                  <p class="excerpt">Hi! Check out my latest article:<br><br>${blogPost.excerpt}</p>
                  
                  <a href="${blogLink}" class="cta-button">Read Full Article</a>
                  
                  <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                     <p style="margin: 0; color: #6b7280; font-size: 14px;">Happy coding,<br><strong>Prasad Shaswat</strong></p>
                  </div>
                </div>
                <div class="footer">
                  <p class="footer-text">You are receiving this update because you are subscribed to the PS Blog.</p>
                  <div class="footer-links">
                     <a href="${unsubscribeLink}">Unsubscribe</a> • 
                     <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Visit Website</a>
                  </div>
                  <p class="footer-text" style="margin-top: 20px;">© 2025 PS Blog. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await transporter.sendMail(mailOptions);
        results.push({ email: subscriber.email, success: true });
        console.log(`New post notification sent to: ${subscriber.email}`);

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        results.push({ email: subscriber.email, success: false, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Error in sendNewPostNotification:', error);
    throw error;
  }
};

// Send unsubscribe confirmation email
const sendUnsubscribeConfirmation = async (email) => {
  try {
    const transporter = createTransporter();

    const resubscribeLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscribe`;

    const mailOptions = {
      from: `"PS Blog" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'You\'ve been unsubscribed from PS Blog',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unsubscribe Confirmation</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; line-height: 1.6; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
            .header { background-color: #374151; padding: 30px 20px; text-align: center; }
            .logo { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.5px; opacity: 0.9; }
            .content { padding: 40px 30px; text-align: center; }
            .icon { font-size: 48px; margin-bottom: 24px; display: block; }
            .title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; }
            .text { color: #4b5563; font-size: 16px; margin-bottom: 24px; }
            .cta-button { display: inline-block; margin-top: 8px; padding: 12px 32px; background-color: #0f766e; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px; transition: background-color 0.2s; }
            .cta-button:hover { background-color: #115e59; }
            .footer { background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
            .footer-text { font-size: 12px; color: #9ca3af; }
            @media only screen and (max-width: 600px) {
              .container { margin: 0; border-radius: 0; width: 100%; }
              .content { padding: 24px 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">PS Blog</h1>
            </div>
            <div class="content">
              <span class="icon">👋</span>
              <h2 class="title">You've been unsubscribed</h2>
              <p class="text">Your email address has been successfully removed from our mailing list. You won't receive any further updates, tutorials, or newsletters from us.</p>
              
              <p class="text">We're sorry to see you go! If this was a mistake, or if you change your mind in the future, we'd love to have you back.</p>
              
              <a href="${resubscribeLink}" class="cta-button">Subscribe Again</a>
            </div>
            <div class="footer">
              <p class="footer-text">© 2025 PS Blog. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Unsubscribe confirmation sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending unsubscribe confirmation:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNewPostNotification,
  sendUnsubscribeConfirmation
};
