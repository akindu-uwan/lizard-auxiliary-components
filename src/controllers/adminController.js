export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ 
      message: 'Admin credentials not configured' 
    });
  }
  
  if (email === adminEmail && password === adminPassword) {
    req.session.isAdmin = true;
    req.session.adminEmail = email;
    
    return res.json({ 
      ok: true, 
      message: 'Login successful' 
    });
  }
  
  return res.status(401).json({ 
    message: 'Invalid credentials' 
  });
};

export const adminLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        message: 'Logout failed' 
      });
    }
    
    res.clearCookie('connect.sid');
    return res.json({ 
      ok: true, 
      message: 'Logout successful' 
    });
  });
};

export const adminStatus = async (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ 
      isAuthenticated: true, 
      email: req.session.adminEmail 
    });
  }
  
  return res.json({ 
    isAuthenticated: false 
  });
};