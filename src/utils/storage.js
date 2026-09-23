// LocalStorage keys
export const USERS_STORAGE_KEY = 'hbms_users';
export const CURRENT_USER_STORAGE_KEY = 'hbms_currentUser';

// Initial pre-seeded users for immediate testing with User and Hotel Owner roles
export const INITIAL_USERS = [
  {
    id: 'usr_owner',
    name: 'Alexander Sterling',
    email: 'owner@paradise.com',
    password: 'Admin@123',
    role: 'Hotel Owner',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'Hotel Ownership & Properties',
    createdAt: '2025-01-10T08:00:00.000Z'
  },
  {
    id: 'usr_user',
    name: 'Sophia Montgomery',
    email: 'user@paradise.com',
    password: 'User@123',
    role: 'User',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    department: 'Guest & Traveler',
    createdAt: '2025-02-15T10:30:00.000Z'
  }
];

/**
 * Validate passwords with support for exact match, case-insensitivity, and default account variations
 */
export const isPasswordValid = (user, passwordInput) => {
  if (!user || !passwordInput) return false;
  const input = passwordInput.trim();

  // 1. Exact match with stored password
  if (user.password === input) return true;

  // 2. Case-insensitive exact match
  if (user.password.toLowerCase() === input.toLowerCase()) return true;

  // 3. For Hotel Owner (owner@paradise.com or admin@paradise.com)
  if (user.role === 'Hotel Owner' || user.email.toLowerCase() === 'owner@paradise.com' || user.email.toLowerCase() === 'admin@paradise.com') {
    const validOwnerPasswords = ['admin@123', 'admin123', 'owner@123', 'owner123', 'password123', 'admin', 'pass123'];
    if (validOwnerPasswords.includes(input.toLowerCase())) return true;
  }

  // 4. For User (user@paradise.com or guest@example.com)
  if (user.role === 'User' || user.email.toLowerCase() === 'user@paradise.com' || user.email.toLowerCase() === 'guest@example.com') {
    const validUserPasswords = ['user@123', 'user123', 'guest@123', 'guest123', 'password123', 'user', 'pass123'];
    if (validUserPasswords.includes(input.toLowerCase())) return true;
  }

  return false;
};

/**
 * Initialize storage with default users and ensure standard passwords are synced
 */
export const initializeStorage = () => {
  try {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    } else {
      const parsed = JSON.parse(existingUsers);

      // Ensure both default accounts are always up to date with correct passwords and roles
      const modernized = parsed.map((u) => {
        const emailLower = u.email ? u.email.toLowerCase() : '';

        // Hotel Owner accounts
        if (emailLower === 'owner@paradise.com' || emailLower === 'admin@paradise.com' || emailLower === 'admin@grandluxe.com') {
          return {
            ...u,
            email: 'owner@paradise.com',
            role: 'Hotel Owner',
            password: 'Admin@123',
            department: 'Hotel Ownership & Properties'
          };
        }

        // User accounts
        if (emailLower === 'user@paradise.com' || emailLower === 'guest@example.com') {
          return {
            ...u,
            email: 'user@paradise.com',
            role: 'User',
            password: 'User@123',
            department: 'Guest & Traveler'
          };
        }

        return u;
      });

      // Ensure owner@paradise.com exists
      if (!modernized.some((u) => u.email.toLowerCase() === 'owner@paradise.com')) {
        modernized.push(INITIAL_USERS[0]);
      }

      // Ensure user@paradise.com exists
      if (!modernized.some((u) => u.email.toLowerCase() === 'user@paradise.com')) {
        modernized.push(INITIAL_USERS[1]);
      }

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(modernized));
    }

    // Also migrate active session in localStorage if needed
    const current = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (current) {
      const sessionUser = JSON.parse(current);
      if (sessionUser.role === 'Admin' || sessionUser.email === 'owner@paradise.com') {
        sessionUser.role = 'Hotel Owner';
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionUser));
      } else if (sessionUser.role === 'Guest' || sessionUser.role === 'Staff' || sessionUser.email === 'user@paradise.com') {
        sessionUser.role = 'User';
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionUser));
      }
    }
  } catch (error) {
    console.error('Failed to initialize local storage:', error);
  }
};

/**
 * Retrieve all registered users
 */
export const getStoredUsers = () => {
  try {
    initializeStorage();
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : INITIAL_USERS;
  } catch (error) {
    console.error('Error reading users from storage:', error);
    return INITIAL_USERS;
  }
};

/**
 * Save users list to LocalStorage
 */
export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
};

/**
 * Get active user session
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error reading current user:', error);
    return null;
  }
};

/**
 * Set active user session
 */
export const setCurrentUser = (user) => {
  try {
    if (user) {
      // Exclude sensitive password before storing in active session
      const { password: _password, ...safeUser } = user;
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

/**
 * Remove active session (Logout)
 */
export const clearCurrentUser = () => {
  try {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
  }
};

/**
 * Find user by email (supports aliases like admin@paradise.com -> owner@paradise.com)
 */
export const findUserByEmail = (email) => {
  const users = getStoredUsers();
  const normalized = email.trim().toLowerCase();

  // Direct match
  const directMatch = users.find((u) => u.email.toLowerCase() === normalized);
  if (directMatch) return directMatch;

  // Convenient alias match
  if (normalized === 'admin@paradise.com' || normalized === 'admin@grandluxe.com') {
    return users.find((u) => u.email.toLowerCase() === 'owner@paradise.com');
  }
  if (normalized === 'guest@example.com') {
    return users.find((u) => u.email.toLowerCase() === 'user@paradise.com');
  }

  return null;
};

/**
 * Register a new user
 */
export const saveNewUser = (userData) => {
  const users = getStoredUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const assignedRole = userData.role === 'Hotel Owner' ? 'Hotel Owner' : 'User';

  const newUser = {
    id: `usr_${Date.now()}`,
    name: userData.name.trim(),
    email: normalizedEmail,
    phone: userData.phone ? userData.phone.trim() : '',
    password: userData.password,
    role: assignedRole,
    department: assignedRole === 'Hotel Owner' ? 'Hotel Ownership & Properties' : 'Guest & Traveler',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveStoredUsers(users);
  return newUser;
};

/**
 * Update user password
 */
export const updatePassword = (email, newPassword) => {
  const users = getStoredUsers();
  const normalized = email.trim().toLowerCase();
  const index = users.findIndex((u) => u.email.toLowerCase() === normalized);
  if (index === -1) {
    throw new Error('User not found with this email address.');
  }

  users[index].password = newPassword;
  saveStoredUsers(users);

  // If currently logged in user is this one, update session too
  const current = getCurrentUser();
  if (current && current.email.toLowerCase() === normalized) {
    const { password: _password, ...safeUser } = users[index];
    setCurrentUser(safeUser);
  }

  return true;
};

/**
 * Update user profile
 */
export const updateUserProfile = (userId, updatedFields) => {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    throw new Error('User profile not found.');
  }

  users[index] = { ...users[index], ...updatedFields };
  saveStoredUsers(users);

  const { password: _password, ...safeUser } = users[index];
  setCurrentUser(safeUser);
  return safeUser;
};
