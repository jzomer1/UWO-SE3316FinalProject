const adminMiddleware = async (req, res, next) => {
    try {
      const user = req.user;
  
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Admin required' });
      }
      next();
    } catch (error) {
      console.error('isAdminMiddleware error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  module.exports = adminMiddleware;