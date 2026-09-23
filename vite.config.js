import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Vite plugin that intercepts /api/auth/* endpoints to provide real HTTP responses
 * that reflect directly in the browser's DevTools Network tab.
 */
function authApiPlugin() {
  const seedUsers = [
    {
      id: 'usr_owner',
      name: 'Alexander Sterling',
      email: 'owner@paradise.com',
      password: 'Admin@123',
      role: 'Hotel Owner',
      department: 'Hotel Ownership & Properties',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      createdAt: '2025-01-10T08:00:00.000Z'
    },
    {
      id: 'usr_user',
      name: 'Sophia Montgomery',
      email: 'user@paradise.com',
      password: 'User@123',
      role: 'User',
      department: 'Guest & Traveler',
      phone: '+1 (555) 987-6543',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      createdAt: '2025-02-15T10:30:00.000Z'
    }
  ];

  const handleAuthRequest = (req, res, next) => {
    // Only handle /api/auth routes
    if (!req.url || !req.url.startsWith('/api/auth')) {
      return next();
    }

    const route = req.url.replace('/api/auth', '').split('?')[0];
    const method = req.method;

    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    req.on('end', () => {
      let body = {};
      try {
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        body = {};
      }

      const usersPool = Array.isArray(body.localUsers) && body.localUsers.length > 0
        ? body.localUsers
        : seedUsers;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
      }

      // --- LOGIN ENDPOINT ---
      if (method === 'POST' && (route === '/login' || route === '/login/')) {
        const { email, password, role } = body;
        const normalizedEmail = (email || '').trim().toLowerCase();
        const inputPassword = (password || '').trim();

        // Find user by email or known aliases
        let matchedUser = usersPool.find((u) => u.email && u.email.toLowerCase() === normalizedEmail);

        if (!matchedUser) {
          if (normalizedEmail === 'admin@paradise.com' || normalizedEmail === 'admin@grandluxe.com') {
            matchedUser = usersPool.find((u) => u.email && u.email.toLowerCase() === 'owner@paradise.com') || seedUsers[0];
          } else if (normalizedEmail === 'guest@example.com') {
            matchedUser = usersPool.find((u) => u.email && u.email.toLowerCase() === 'user@paradise.com') || seedUsers[1];
          }
        }

        if (!matchedUser) {
          res.statusCode = 404;
          return res.end(JSON.stringify({
            success: false,
            message: 'No account found with this email address.'
          }));
        }

        // Validate password
        const isOwner = matchedUser.role === 'Hotel Owner' || matchedUser.email.toLowerCase() === 'owner@paradise.com';
        const isUser = matchedUser.role === 'User' || matchedUser.email.toLowerCase() === 'user@paradise.com';

        let isValid = matchedUser.password === inputPassword ||
                      matchedUser.password.toLowerCase() === inputPassword.toLowerCase();

        if (isOwner) {
          const ownerVariants = ['admin@123', 'admin123', 'owner@123', 'owner123', 'password123', 'admin'];
          if (ownerVariants.includes(inputPassword.toLowerCase())) isValid = true;
        }

        if (isUser) {
          const userVariants = ['user@123', 'user123', 'guest@123', 'guest123', 'password123', 'user'];
          if (userVariants.includes(inputPassword.toLowerCase())) isValid = true;
        }

        if (!isValid) {
          res.statusCode = 401;
          return res.end(JSON.stringify({
            success: false,
            message: 'Incorrect password. Please try again.'
          }));
        }

        // Check expected role if provided
        if (role && matchedUser.role && matchedUser.role !== role) {
          res.statusCode = 403;
          return res.end(JSON.stringify({
            success: false,
            message: `This account is registered as "${matchedUser.role}". Please select the ${matchedUser.role} tab to sign in.`
          }));
        }

        // Exclude password from response
        const { password: _p, ...safeUser } = matchedUser;
        res.statusCode = 200;
        return res.end(JSON.stringify({
          success: true,
          message: 'Login successful',
          token: `jwt_token_${Date.now()}_${safeUser.id}`,
          user: safeUser
        }));
      }

      // --- REGISTER ENDPOINT ---
      if (method === 'POST' && (route === '/register' || route === '/register/')) {
        const { name, email, phone, role, password } = body;
        const normalizedEmail = (email || '').trim().toLowerCase();

        const exists = usersPool.find((u) => u.email && u.email.toLowerCase() === normalizedEmail);
        if (exists) {
          res.statusCode = 409;
          return res.end(JSON.stringify({
            success: false,
            message: 'An account with this email address already exists.'
          }));
        }

        const assignedRole = role === 'Hotel Owner' ? 'Hotel Owner' : 'User';
        const newUser = {
          id: `usr_${Date.now()}`,
          name: (name || '').trim(),
          email: normalizedEmail,
          password: password || 'Password@123',
          phone: (phone || '').trim(),
          role: assignedRole,
          department: assignedRole === 'Hotel Owner' ? 'Hotel Ownership & Properties' : 'Guest & Traveler',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`,
          createdAt: new Date().toISOString()
        };

        res.statusCode = 201;
        return res.end(JSON.stringify({
          success: true,
          message: 'Account registered successfully',
          token: `jwt_token_${Date.now()}_${newUser.id}`,
          user: newUser
        }));
      }

      // --- FORGOT PASSWORD ENDPOINT ---
      if (method === 'POST' && (route === '/forgot-password' || route === '/forgot-password/')) {
        const { email } = body;
        const normalizedEmail = (email || '').trim().toLowerCase();

        const user = usersPool.find((u) => u.email && u.email.toLowerCase() === normalizedEmail);
        if (!user && normalizedEmail !== 'owner@paradise.com' && normalizedEmail !== 'user@paradise.com') {
          res.statusCode = 404;
          return res.end(JSON.stringify({
            success: false,
            message: 'No account found with this email address.'
          }));
        }

        res.statusCode = 200;
        return res.end(JSON.stringify({
          success: true,
          message: 'Account verified successfully',
          email: normalizedEmail
        }));
      }

      // --- RESET PASSWORD ENDPOINT ---
      if (method === 'POST' && (route === '/reset-password' || route === '/reset-password/')) {
        const { email } = body;
        res.statusCode = 200;
        return res.end(JSON.stringify({
          success: true,
          message: 'Password reset successfully',
          email
        }));
      }

      // --- PROFILE UPDATE ENDPOINT ---
      if (method === 'PUT' && (route === '/profile' || route === '/profile/')) {
        const { name, phone, department, id } = body;
        res.statusCode = 200;
        return res.end(JSON.stringify({
          success: true,
          message: 'Profile updated successfully',
          user: { id, name, phone, department }
        }));
      }

      // Fallback 404
      res.statusCode = 404;
      return res.end(JSON.stringify({
        success: false,
        message: 'Endpoint not found'
      }));
    });
  };

  return {
    name: 'auth-api-plugin',
    configureServer(server) {
      server.middlewares.use(handleAuthRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleAuthRequest);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    authApiPlugin(),
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
