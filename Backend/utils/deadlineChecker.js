
const cron = require('node-cron');
const Task = require('../models/Task');
const sendEmail = require('./sendEmail');

const buildEmailTemplate = (userName, taskTitle, dueDate, boardTitle) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="display: flex; align-items: center; margin-bottom: 32px;">
        <div style="background: #4f46e5; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <span style="color: white; font-size: 20px;">✓</span>
        </div>
        <span style="font-size: 22px; font-weight: 800; color: #0f172a;">TaskFlow</span>
      </div>

      <!-- Body -->
      <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">
        Task due tomorrow ⏰
      </h1>
      <p style="color: #64748b; font-size: 15px; margin: 0 0 32px;">
        Hi ${userName}, you have a task due tomorrow. Don't let it slip!
      </p>

      <!-- Task Card -->
      <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 32px; border-left: 4px solid #4f46e5;">
        <p style="font-size: 11px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 6px;">
          ${boardTitle || 'TaskFlow Board'}
        </p>
        <p style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">
          ${taskTitle}
        </p>
        <p style="font-size: 13px; color: #ef4444; font-weight: 600; margin: 0;">
          Due: ${new Date(dueDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <!-- CTA -->
      <a href="${process.env.CLIENT_URL}/dashboard"
        style="display: inline-block; background: #4f46e5; color: white; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 14px;">
        Open TaskFlow →
      </a>

      <!-- Footer -->
      <p style="margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        You're receiving this because you have a task assigned to you in TaskFlow.
        <br/>© 2026 TaskFlow Inc.
      </p>
    </div>
  </div>
`;

const startDeadlineChecker = () => {
  
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Running deadline check...');

    try {
      const now = new Date();
      const in24hrs = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      
      const tasks = await Task.find({
        dueDate: { $gte: now, $lte: in24hrs },
        status: { $ne: 'done' },
        assignedTo: { $ne: null },
      })
        .populate('assignedTo', 'name email')
        .populate('board', 'title');

      if (tasks.length === 0) {
        console.log('No upcoming deadlines found.');
        return;
      }

      console.log(`Found ${tasks.length} task(s) due soon. Sending reminders...`);

      for (const task of tasks) {
        if (!task.assignedTo?.email) continue;

        await sendEmail({
          to: task.assignedTo.email,
          subject: `⏰ Reminder: "${task.title}" is due tomorrow`,
          html: buildEmailTemplate(
            task.assignedTo.name,
            task.title,
            task.dueDate,
            task.board?.title
          ),
        });
      }

      console.log(`✅ Deadline check done. ${tasks.length} reminder(s) sent.`);
    } catch (error) {
      console.error('Deadline checker error:', error.message);
    }
  });

  console.log('Deadline checker scheduled — runs daily at 8:00am');
};

module.exports = startDeadlineChecker;