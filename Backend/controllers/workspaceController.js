// server/controllers/workspaceController.js
const Workspace = require('../models/Workspace');
const User = require('../models/User');

// GET /api/workspaces — get all workspaces for logged in user
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    }).populate('boards');

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workspaces — create a new workspace
const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    // add workspace to user's list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { workspaces: workspace._id },
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/workspaces/:id — delete a workspace
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // only the owner can delete
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await workspace.deleteOne();
    res.json({ message: 'Workspace deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const sendEmail = require('../utils/sendEmail');

// GET /api/workspaces/:id/members
const getMembers = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('members.user', 'name email');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    res.json(workspace.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workspaces/:id/invite
const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // only owner or admin can invite
    const isAdmin = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString() &&
      (m.role === 'admin' || workspace.owner.toString() === req.user._id.toString())
    );

    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized to invite members' });
    }

    // check if user exists in DB
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // check if already a member
      const alreadyMember = workspace.members.some(
        (m) => m.user.toString() === existingUser._id.toString()
      );

      if (alreadyMember) {
        return res.status(400).json({ message: 'User is already a member' });
      }

      // add them directly
      workspace.members.push({
        user: existingUser._id,
        role: role || 'member',
      });

      // add workspace to their list
      await User.findByIdAndUpdate(existingUser._id, {
        $push: { workspaces: workspace._id },
      });

      await workspace.save();

      // notify them by email
      await sendEmail({
        to: email,
        subject: `You've been added to "${workspace.name}" on TaskFlow`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <div style="margin-bottom: 24px;">
                <span style="background: #4f46e5; color: white; font-weight: 800; font-size: 18px; padding: 8px 16px; border-radius: 8px;">TaskFlow</span>
              </div>
              <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">
                You've been added to a workspace 🎉
              </h1>
              <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">
                <b>${req.user.name}</b> added you to <b>${workspace.name}</b> as a <b>${role || 'member'}</b>.
              </p>
              <a href="${process.env.CLIENT_URL}/dashboard"
                style="display: inline-block; background: #4f46e5; color: white; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 14px;">
                Open TaskFlow →
              </a>
            </div>
          </div>
        `,
      });

      return res.json({
        message: `${existingUser.name} has been added to the workspace.`,
        member: { user: existingUser, role: role || 'member' },
      });
    }

    // user doesn't exist — send invite email with signup link
    await sendEmail({
      to: email,
      subject: `${req.user.name} invited you to join TaskFlow`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="margin-bottom: 24px;">
              <span style="background: #4f46e5; color: white; font-weight: 800; font-size: 18px; padding: 8px 16px; border-radius: 8px;">TaskFlow</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">
              You've been invited to TaskFlow 🚀
            </h1>
            <p style="color: #64748b; font-size: 15px; margin: 0 0 8px;">
              <b>${req.user.name}</b> invited you to join <b>${workspace.name}</b>.
            </p>
            <p style="color: #64748b; font-size: 15px; margin: 0 0 32px;">
              Create your free account to get started.
            </p>
            <a href="${process.env.CLIENT_URL}/signup"
              style="display: inline-block; background: #4f46e5; color: white; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 14px;">
              Accept Invite & Sign Up →
            </a>
            <p style="margin-top: 32px; font-size: 12px; color: #94a3b8;">
              If you weren't expecting this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    res.json({
      message: `Invite sent to ${email}. They'll need to sign up first.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/workspaces/:id/members/:userId
const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // can't remove the owner
    if (workspace.owner.toString() === req.params.userId) {
      return res.status(400).json({ message: 'Cannot remove the workspace owner' });
    }

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );

    await workspace.save();
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  getMembers,
  inviteMember,
  removeMember,
};