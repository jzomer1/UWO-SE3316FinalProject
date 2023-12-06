const User = require('../models/user');

exports.getUserEmails = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized: Only admins can access this endpoint' });
    }
    const users = await User.find({}, 'email');
    const emails = users.map(user => user.email);
    res.json(emails);
  } catch (error) {
    console.error('Error fetching user emails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
