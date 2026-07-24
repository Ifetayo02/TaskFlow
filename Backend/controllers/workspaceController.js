
const Workspace = require('../models/Workspace');
const User = require('../models/User');


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


const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    
    await User.findByIdAndUpdate(req.user._id, {
      $push: { workspaces: workspace._id },
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    
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


const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const alreadyMember = workspace.members.some(
        (m) => m.user.toString() === existingUser._id.toString()
      );

      if (alreadyMember) {
        return res.status(400).json({ message: 'User is already a member' });
      }

      workspace.members.push({
        user: existingUser._id,
        role: role || 'member',
      });

      await User.findByIdAndUpdate(existingUser._id, {
        $push: { workspaces: workspace._id },
      });

      await workspace.save();

      
      try {
        await sendEmail({
          to: email,
          subject: `You've been added to "${workspace.name}" on TaskFlow`,
          html: `<p>Hi ${existingUser.name}, you've been added to <b>${workspace.name}</b> as a ${role || 'member'}.</p>`,
        });
      } catch (emailErr) {
        
        console.log('Email notification failed (non-critical):', emailErr.message);
      }

      return res.json({
        message: `${existingUser.name} has been added to the workspace.`,
        member: { user: existingUser, role: role || 'member' },
      });
    }

    
    try {
      await sendEmail({
        to: email,
        subject: `${req.user.name} invited you to join TaskFlow`,
        html: `<p>${req.user.name} invited you to join <b>${workspace.name}</b>. Sign up at ${process.env.CLIENT_URL}/signup</p>`,
      });
      res.json({
        message: `Invite sent to ${email}. They'll need to sign up first.`,
      });
    } catch (emailErr) {
      res.status(400).json({
        message: `Could not send invite email to ${email}. Ask them to sign up at ${process.env.CLIENT_URL}/signup and then add them.`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    
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