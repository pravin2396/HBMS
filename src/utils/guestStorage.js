// LocalStorage keys for Module 4: Guest Management
export const GUESTS_STORAGE_KEY = 'hbms_guests';
export const GUESTS_INITIALIZED_KEY = 'hbms_guests_initialized_v1';

export const NATIONALITY_OPTIONS = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'France',
  'Germany',
  'Italy',
  'Switzerland',
  'Japan',
  'Singapore',
  'United Arab Emirates',
  'Spain',
  'India',
  'Brazil',
  'Monaco'
];

export const ID_PROOF_TYPES = [
  'Passport',
  'National ID Card',
  'Driver’s License',
  'Residence Permit'
];

export const VIP_TIERS = [
  'VIP Platinum',
  'VIP Gold',
  'Diamond Elite',
  'Silver Preferred',
  'Standard Guest'
];

// Initial pre-seeded guests covering all 6 mandatory fields:
// 1. Full Name, 2. Email, 3. Mobile Number, 4. Address, 5. ID Proof Number, 6. Nationality
export const INITIAL_GUESTS = [
  {
    id: 'gst-101',
    fullName: 'Eleanor Vance',
    email: 'eleanor.vance@luxury.com',
    mobileNumber: '+1 (555) 234-8891',
    address: '742 Evergreen Terrace, Beverly Hills, CA 90210, USA',
    idProofNumber: 'PASS-US-984210',
    idProofType: 'Passport',
    nationality: 'United States',
    vipStatus: 'VIP Platinum',
    roomAssigned: 'Suite 701 (Presidential Penthouse)',
    stayStatus: 'Checked-In',
    totalStays: 6,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    notes: 'Prefers high-floor suites, sparkling San Pellegrino water on arrival, hypoallergenic goose-down pillows.',
    createdAt: '2025-03-12T10:00:00.000Z'
  },
  {
    id: 'gst-102',
    fullName: 'Marcus Sterling',
    email: 'm.sterling@invest.com',
    mobileNumber: '+1 (555) 782-9904',
    address: '150 Central Park South, Penthouse B, New York, NY 10019, USA',
    idProofNumber: 'PASS-US-771923',
    idProofType: 'Passport',
    nationality: 'United States',
    vipStatus: 'Diamond Elite',
    roomAssigned: 'Villa 404 (Royal Oceanfront Villa)',
    stayStatus: 'Checked-In',
    totalStays: 9,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    notes: 'Chairman of Sterling Global. Requests private airport chauffeur and early morning Bloomberg terminal access.',
    createdAt: '2025-01-20T14:30:00.000Z'
  },
  {
    id: 'gst-103',
    fullName: 'Dr. Clara Thorne',
    email: 'clara.thorne@medcenter.org',
    mobileNumber: '+44 20 7946 0912',
    address: '45 Kensington Palace Gardens, London, W8 4QQ, United Kingdom',
    idProofNumber: 'PASS-UK-552910',
    idProofType: 'Passport',
    nationality: 'United Kingdom',
    vipStatus: 'VIP Gold',
    roomAssigned: 'Suite 302 (Executive Diplomat Suite)',
    stayStatus: 'Confirmed',
    totalStays: 4,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    notes: 'Attending World Healthcare Symposium. Needs quiet corner suite and decaf specialty espresso pods.',
    createdAt: '2025-05-18T08:15:00.000Z'
  },
  {
    id: 'gst-104',
    fullName: 'Liam O’Connor',
    email: 'liam.oconnor@creative.co',
    mobileNumber: '+353 1 496 0123',
    address: '12 Fitzwilliam Square, Dublin 2, D02 T973, Ireland',
    idProofNumber: 'NATID-IE-884102',
    idProofType: 'National ID Card',
    nationality: 'United Kingdom',
    vipStatus: 'Silver Preferred',
    roomAssigned: 'Room 112 (Deluxe Heritage King)',
    stayStatus: 'Confirmed',
    totalStays: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    notes: 'Creative director traveling for architectural photography. Requests balcony overlooking gardens.',
    createdAt: '2025-06-22T11:40:00.000Z'
  },
  {
    id: 'gst-105',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@globalarts.com',
    mobileNumber: '+33 1 42 68 55 00',
    address: '28 Avenue Montaigne, 75008 Paris, France',
    idProofNumber: 'PASS-FR-441098',
    idProofType: 'Passport',
    nationality: 'France',
    vipStatus: 'VIP Platinum',
    roomAssigned: 'Suite 505 (Grand Horizon Suite)',
    stayStatus: 'Confirmed',
    totalStays: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    notes: 'Art gallery curator. Requests in-room fresh white lilies and late check-out privileges.',
    createdAt: '2025-02-14T16:20:00.000Z'
  },
  {
    id: 'gst-106',
    fullName: 'Harrison Ford-Smith',
    email: 'harrison.smith@aviation.com',
    mobileNumber: '+1 (555) 912-3344',
    address: '320 Ocean Drive, Miami Beach, FL 33139, USA',
    idProofNumber: 'DL-FL-9912034',
    idProofType: 'Driver’s License',
    nationality: 'United States',
    vipStatus: 'VIP Gold',
    roomAssigned: 'Room 208 (Lagoon Garden Bungalow)',
    stayStatus: 'Confirmed',
    totalStays: 3,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    notes: 'Private pilot. Enjoys golf and requests tee time reservations at Paradise Links Course.',
    createdAt: '2025-04-05T09:00:00.000Z'
  },
  {
    id: 'gst-107',
    fullName: 'Sophia Montgomery',
    email: 'user@paradise.com',
    mobileNumber: '+1 (555) 987-6543',
    address: '88 Commonwealth Avenue, Boston, MA 02116, USA',
    idProofNumber: 'PASS-US-339182',
    idProofType: 'Passport',
    nationality: 'United States',
    vipStatus: 'VIP Platinum',
    roomAssigned: 'Suite 501 (Presidential Suite)',
    stayStatus: 'Completed',
    totalStays: 8,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    notes: 'VIP guest with lifetime Paradise membership. Enjoys sunset yoga and private dining at The Azure.',
    createdAt: '2025-02-15T10:30:00.000Z'
  },
  {
    id: 'gst-108',
    fullName: 'Kenji Takahashi',
    email: 'k.takahashi@tokyotech.jp',
    mobileNumber: '+81 3 5555 0142',
    address: '4-12-8 Roppongi, Minato-ku, Tokyo 106-0032, Japan',
    idProofNumber: 'PASS-JP-782194',
    idProofType: 'Passport',
    nationality: 'Japan',
    vipStatus: 'Diamond Elite',
    roomAssigned: 'Suite 601 (Penthouse Sky Suite)',
    stayStatus: 'Checked-In',
    totalStays: 7,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    notes: 'Tech executive. Prefers green tea service upon arrival and high-speed fiber internet port in work desk.',
    createdAt: '2025-03-01T13:00:00.000Z'
  },
  {
    id: 'gst-109',
    fullName: 'Lady Charlotte Windsor',
    email: 'charlotte.windsor@heritage.co.uk',
    mobileNumber: '+44 20 7123 4567',
    address: '14 Belgrave Square, London, SW1X 8PS, United Kingdom',
    idProofNumber: 'PASS-UK-889012',
    idProofType: 'Passport',
    nationality: 'United Kingdom',
    vipStatus: 'VIP Platinum',
    roomAssigned: 'Suite 701 (Crown Penthouse)',
    stayStatus: 'Confirmed',
    totalStays: 12,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    notes: 'Regular patron of royal suite collection. Butler service requested around the clock.',
    createdAt: '2024-11-10T12:00:00.000Z'
  },
  {
    id: 'gst-110',
    fullName: 'Maximilian Von Bauer',
    email: 'm.bauer@munichcapital.de',
    mobileNumber: '+49 89 2180 0',
    address: 'Maximilianstraße 17, 80539 Munich, Germany',
    idProofNumber: 'NATID-DE-391024',
    idProofType: 'National ID Card',
    nationality: 'Germany',
    vipStatus: 'VIP Gold',
    roomAssigned: 'Room 401 (Deluxe Oceanfront)',
    stayStatus: 'Completed',
    totalStays: 4,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    notes: 'Private equity partner. Prefers early breakfast at 6:30 AM and gym access before 7:00 AM.',
    createdAt: '2025-01-08T09:45:00.000Z'
  },
  {
    id: 'gst-111',
    fullName: 'Camila Fernandes',
    email: 'camila.fernandes@rioexport.br',
    mobileNumber: '+55 21 98765 4321',
    address: 'Av. Atlântica 1702, Copacabana, Rio de Janeiro, Brazil',
    idProofNumber: 'PASS-BR-901244',
    idProofType: 'Passport',
    nationality: 'Brazil',
    vipStatus: 'Silver Preferred',
    roomAssigned: 'Room 201 (Deluxe Pool View)',
    stayStatus: 'Completed',
    totalStays: 3,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
    notes: 'Loves spa treatments. Booked for Paradise Thalassotherapy package.',
    createdAt: '2025-07-02T15:10:00.000Z'
  },
  {
    id: 'gst-112',
    fullName: 'Alessandro Rossi',
    email: 'alessandro.rossi@milano.it',
    mobileNumber: '+39 02 8765 4321',
    address: 'Via Montenapoleone 8, 20121 Milan, Italy',
    idProofNumber: 'PASS-IT-129038',
    idProofType: 'Passport',
    nationality: 'Italy',
    vipStatus: 'VIP Platinum',
    roomAssigned: 'Suite 502 (Presidential Suite)',
    stayStatus: 'Confirmed',
    totalStays: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    notes: 'Luxury fashion house executive. Requests in-suite garment pressing and sommelier tasting reservation.',
    createdAt: '2025-04-19T17:30:00.000Z'
  }
];

/**
 * Initialize guests in LocalStorage
 */
export const initializeGuestStorage = () => {
  try {
    const isInitialized = localStorage.getItem(GUESTS_INITIALIZED_KEY);
    const existing = localStorage.getItem(GUESTS_STORAGE_KEY);

    if (!isInitialized || !existing) {
      localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(INITIAL_GUESTS));
      localStorage.setItem(GUESTS_INITIALIZED_KEY, 'true');
    }
  } catch (error) {
    console.error('Failed to initialize guest storage:', error);
  }
};

/**
 * Get all guests from LocalStorage
 */
export const getStoredGuests = () => {
  try {
    initializeGuestStorage();
    const data = localStorage.getItem(GUESTS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_GUESTS;
  } catch (error) {
    console.error('Error reading guests from storage:', error);
    return INITIAL_GUESTS;
  }
};

/**
 * Save all guests to LocalStorage
 */
export const saveStoredGuests = (guests) => {
  try {
    localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));

    // Synchronize hbms_analytics totalGuests count immediately
    const analyticsRaw = localStorage.getItem('hbms_analytics');
    if (analyticsRaw) {
      try {
        const analytics = JSON.parse(analyticsRaw);
        const baseGuests = 214;
        const initialCount = 12; // INITIAL_GUESTS length
        analytics.totalGuests = Math.max(0, baseGuests + (guests.length - initialCount));
        localStorage.setItem('hbms_analytics', JSON.stringify(analytics));
      } catch (e) {
        console.warn('Analytics guest sync warning:', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hbms_data_updated'));
    }
  } catch (error) {
    console.error('Error saving guests to storage:', error);
  }
};

/**
 * Find guest by ID
 */
export const getStoredGuestById = (id) => {
  const guests = getStoredGuests();
  return guests.find((g) => String(g.id) === String(id) || String(g.email).toLowerCase() === String(id).toLowerCase()) || null;
};

/**
 * Add a new guest
 */
export const saveNewGuest = (guestData) => {
  const guests = getStoredGuests();
  const normalizedEmail = (guestData.email || '').trim().toLowerCase();

  // Validate duplicate email
  const existingEmail = guests.find((g) => g.email.toLowerCase() === normalizedEmail);
  if (existingEmail) {
    throw new Error(`A guest with email "${guestData.email}" is already registered.`);
  }

  // Validate duplicate ID proof
  const normalizedIdProof = (guestData.idProofNumber || '').trim().toUpperCase();
  if (normalizedIdProof) {
    const existingId = guests.find((g) => g.idProofNumber.toUpperCase() === normalizedIdProof);
    if (existingId) {
      throw new Error(`A guest with ID Proof "${guestData.idProofNumber}" is already registered.`);
    }
  }

  const newGuest = {
    id: `gst-${Date.now()}`,
    fullName: guestData.fullName.trim(),
    email: normalizedEmail,
    mobileNumber: guestData.mobileNumber.trim(),
    address: guestData.address.trim(),
    idProofNumber: normalizedIdProof,
    idProofType: guestData.idProofType || 'Passport',
    nationality: guestData.nationality || 'United States',
    vipStatus: guestData.vipStatus || 'Standard Guest',
    roomAssigned: guestData.roomAssigned || 'Unassigned',
    stayStatus: guestData.stayStatus || 'Confirmed',
    totalStays: Number(guestData.totalStays) || 1,
    avatar: guestData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestData.fullName)}`,
    notes: guestData.notes ? guestData.notes.trim() : 'Registered guest at Paradise Hotel & Resort.',
    createdAt: new Date().toISOString()
  };

  guests.unshift(newGuest);
  saveStoredGuests(guests);

  // Synchronize with hbms_bookings so the newly registered guest appears on the Dashboard's Recent Bookings
  try {
    const bookingsRaw = localStorage.getItem('hbms_bookings');
    const bookings = bookingsRaw ? JSON.parse(bookingsRaw) : [];
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: newGuest.fullName,
      guestEmail: newGuest.email,
      guestPhone: newGuest.mobileNumber,
      avatar: newGuest.avatar,
      suiteType: newGuest.roomAssigned || 'Deluxe Room (Assigned)',
      roomNumber: newGuest.roomAssigned ? (newGuest.roomAssigned.match(/\d+/) || ['305'])[0] : '305',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      stayDuration: '3 Nights',
      guestsCount: 1,
      status: newGuest.stayStatus === 'Checked-In' ? 'Checked-In' : 'Confirmed',
      amount: 1450,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    localStorage.setItem('hbms_bookings', JSON.stringify(bookings));
  } catch (e) {
    console.warn('Booking sync warning:', e);
  }

  return newGuest;
};

/**
 * Update an existing guest
 */
export const updateStoredGuest = (id, updatedFields) => {
  const guests = getStoredGuests();
  const index = guests.findIndex((g) => String(g.id) === String(id));
  if (index === -1) {
    throw new Error('Guest record not found.');
  }

  // Check email uniqueness if email changed
  if (updatedFields.email) {
    const normalizedEmail = updatedFields.email.trim().toLowerCase();
    const collision = guests.find(
      (g, i) => i !== index && g.email.toLowerCase() === normalizedEmail
    );
    if (collision) {
      throw new Error(`Email "${updatedFields.email}" is already in use by another guest.`);
    }
  }

  // Check ID proof uniqueness if ID proof changed
  if (updatedFields.idProofNumber) {
    const normalizedId = updatedFields.idProofNumber.trim().toUpperCase();
    const collision = guests.find(
      (g, i) => i !== index && g.idProofNumber.toUpperCase() === normalizedId
    );
    if (collision) {
      throw new Error(`ID Proof "${updatedFields.idProofNumber}" is already registered to another guest.`);
    }
  }

  const updatedGuest = {
    ...guests[index],
    ...updatedFields,
    fullName: updatedFields.fullName ? updatedFields.fullName.trim() : guests[index].fullName,
    email: updatedFields.email ? updatedFields.email.trim().toLowerCase() : guests[index].email,
    mobileNumber: updatedFields.mobileNumber ? updatedFields.mobileNumber.trim() : guests[index].mobileNumber,
    address: updatedFields.address ? updatedFields.address.trim() : guests[index].address,
    idProofNumber: updatedFields.idProofNumber ? updatedFields.idProofNumber.trim().toUpperCase() : guests[index].idProofNumber,
    nationality: updatedFields.nationality || guests[index].nationality,
    totalStays: updatedFields.totalStays !== undefined ? Number(updatedFields.totalStays) : guests[index].totalStays
  };

  guests[index] = updatedGuest;
  saveStoredGuests(guests);

  // Synchronize hbms_bookings if guest name, email, or room changed
  try {
    const bookingsRaw = localStorage.getItem('hbms_bookings');
    if (bookingsRaw) {
      const bookings = JSON.parse(bookingsRaw);
      const oldEmail = guests[index]?.email?.toLowerCase();
      let updatedAny = false;
      const updatedBookings = bookings.map((b) => {
        if (b.guestEmail?.toLowerCase() === oldEmail || b.guestName === updatedGuest.fullName) {
          updatedAny = true;
          return {
            ...b,
            guestName: updatedGuest.fullName,
            guestEmail: updatedGuest.email,
            guestPhone: updatedGuest.mobileNumber,
            avatar: updatedGuest.avatar,
            suiteType: updatedGuest.roomAssigned || b.suiteType
          };
        }
        return b;
      });
      if (updatedAny) {
        localStorage.setItem('hbms_bookings', JSON.stringify(updatedBookings));
      }
    }
  } catch (e) {
    console.warn('Booking sync warning on guest update:', e);
  }

  return updatedGuest;
};

/**
 * Delete a guest record
 */
export const deleteStoredGuest = (id) => {
  const guests = getStoredGuests();
  const target = guests.find((g) => String(g.id) === String(id));
  const filtered = guests.filter((g) => String(g.id) !== String(id));
  if (filtered.length === guests.length) {
    throw new Error('Guest record not found.');
  }
  saveStoredGuests(filtered);

  // Also remove booking from hbms_bookings if applicable
  if (target) {
    try {
      const bookingsRaw = localStorage.getItem('hbms_bookings');
      if (bookingsRaw) {
        const bookings = JSON.parse(bookingsRaw);
        const updatedBookings = bookings.filter(
          (b) => b.guestEmail?.toLowerCase() !== target.email.toLowerCase() && b.guestName !== target.fullName
        );
        localStorage.setItem('hbms_bookings', JSON.stringify(updatedBookings));
      }
    } catch (e) {
      console.warn('Booking removal warning:', e);
    }
  }

  return true;
};
