// LocalStorage keys for Module 3: Room Management
export const ROOMS_STORAGE_KEY = 'hbms_rooms';
export const ROOMS_API_CONFIG_KEY = 'hbms_rooms_api_config';

export const ROOM_TYPES = [
  'Standard King',
  'Deluxe Room',
  'Executive Suite',
  'Presidential Suite',
  'Penthouse'
];

export const ROOM_STATUSES = [
  'Available',
  'Occupied',
  'Under Maintenance'
];

export const DEFAULT_AMENITIES_LIST = [
  'High-Speed WiFi',
  'King Bed',
  'Ocean View',
  'Private Balcony',
  'Smart 4K TV',
  'Jacuzzi Tub',
  'Mini Bar',
  'Espresso Machine',
  '24/7 Room Service',
  'Walk-in Shower',
  'Work Desk',
  'Safe'
];

export const PRESET_ROOM_IMAGES = [
  { label: 'Executive Modern King', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Luxury Ocean Balcony', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Presidential Gold Suite', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Sky Penthouse Villa', url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Classic Heritage Deluxe', url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Panoramic Grand Suite', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200' }
];

// Showcase detailed rooms
const SHOWCASE_ROOMS = [
  {
    id: 'room-101',
    roomNumber: '101',
    roomType: 'Standard King',
    floor: 1,
    pricePerNight: 165,
    capacity: 2,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
    description: 'An elegant standard king room on the ground floor with garden view, premium bedding, and a marble bath.',
    amenities: ['High-Speed WiFi', 'King Bed', 'Smart 4K TV', 'Coffee Maker', 'Mini Bar', 'Air Conditioning']
  },
  {
    id: 'room-102',
    roomNumber: '102',
    roomType: 'Standard King',
    floor: 1,
    pricePerNight: 175,
    capacity: 2,
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
    description: 'Quiet ground-floor retreat featuring plush king bed, ergonomic desk space, and direct courtyard patio access.',
    amenities: ['High-Speed WiFi', 'King Bed', 'Courtyard Patio', 'Smart 4K TV', 'Work Desk', 'Safe']
  },
  {
    id: 'room-201',
    roomNumber: '201',
    roomType: 'Deluxe Room',
    floor: 2,
    pricePerNight: 245,
    capacity: 2,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
    description: 'Sophisticated deluxe sanctuary with a private balcony overlooking the resort pool and manicured palms.',
    amenities: ['High-Speed WiFi', 'King Bed', 'Private Balcony', 'Pool View', 'Smart 4K TV', 'Espresso Machine', 'Mini Bar']
  },
  {
    id: 'room-202',
    roomNumber: '202',
    roomType: 'Deluxe Room',
    floor: 2,
    pricePerNight: 260,
    capacity: 3,
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200',
    description: 'Spacious deluxe room with double queen beds and serene garden vistas.',
    amenities: ['High-Speed WiFi', 'Double Queen Beds', 'Smart 4K TV', 'Mini Bar', 'Walk-in Shower', 'Safe']
  },
  {
    id: 'room-301',
    roomNumber: '301',
    roomType: 'Executive Suite',
    floor: 3,
    pricePerNight: 395,
    capacity: 3,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200',
    description: 'Expansive executive suite featuring a separate living parlor, conference work lounge, and panoramic skyline vistas.',
    amenities: ['High-Speed WiFi', 'King Bed', 'Separate Living Room', 'Ocean View', 'Jacuzzi Tub', '24/7 Room Service', 'Smart 4K TV', 'Espresso Machine']
  },
  {
    id: 'room-302',
    roomNumber: '302',
    roomType: 'Executive Suite',
    floor: 3,
    pricePerNight: 420,
    capacity: 4,
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1200',
    description: 'Luxury executive suite preferred by diplomats and corporate leaders, complete with wet bar and wrap-around balcony.',
    amenities: ['High-Speed WiFi', 'King Bed & Sofa Bed', 'Wrap-around Balcony', 'Wet Bar', 'Jacuzzi Tub', '24/7 Room Service', 'Walk-in Closet']
  },
  {
    id: 'room-401',
    roomNumber: '401',
    roomType: 'Deluxe Room',
    floor: 4,
    pricePerNight: 285,
    capacity: 2,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200',
    description: 'High-floor deluxe king room with breathtaking oceanfront sunset views and designer Italian furnishings.',
    amenities: ['High-Speed WiFi', 'King Bed', 'Oceanfront View', 'Smart 4K TV', 'Rain Shower', 'Espresso Machine', 'Mini Bar']
  },
  {
    id: 'room-402',
    roomNumber: '402',
    roomType: 'Executive Suite',
    floor: 4,
    pricePerNight: 450,
    capacity: 4,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
    description: 'Fourth-floor premium suite featuring floor-to-ceiling soundproof glass, deep-soak whirlpool tub, and private dining alcove.',
    amenities: ['High-Speed WiFi', 'King Bed', 'Whirlpool Tub', 'Private Dining Area', 'Oceanfront View', 'Smart 4K TV', 'Butler Service']
  },
  {
    id: 'room-501',
    roomNumber: '501',
    roomType: 'Presidential Suite',
    floor: 5,
    pricePerNight: 850,
    capacity: 4,
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
    description: 'Opulent presidential residence featuring custom chandelier lighting, grand dining salon, private terrace, and 24h butler.',
    amenities: ['High-Speed WiFi', '2 Master King Beds', 'Grand Dining Salon', 'Private Terrace', 'Jacuzzi Tub', '24/7 Butler Service', 'Wine Cellar Cabinet', 'Private Bar']
  },
  {
    id: 'room-502',
    roomNumber: '502',
    roomType: 'Presidential Suite',
    floor: 5,
    pricePerNight: 920,
    capacity: 4,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
    description: 'Prestigious presidential quarters overlooking the emerald coast with dedicated cinema parlor and hydrotherapy spa bath.',
    amenities: ['High-Speed WiFi', '2 Master King Beds', 'Cinema Parlor', 'Hydrotherapy Spa', 'Ocean View', 'Private Chef Access', 'Balcony']
  },
  {
    id: 'room-601',
    roomNumber: '601',
    roomType: 'Penthouse',
    floor: 6,
    pricePerNight: 1250,
    capacity: 6,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200',
    description: 'Top-tier duplex penthouse offering 360-degree resort and coastline views, private infinity plunge pool, and private elevator.',
    amenities: ['High-Speed WiFi', '3 Luxury Bedrooms', 'Infinity Plunge Pool', 'Private Elevator', 'Private Bar', 'Jacuzzi', 'Panoramic Ocean View', 'VIP Concierge']
  },
  {
    id: 'room-701',
    roomNumber: '701',
    roomType: 'Penthouse',
    floor: 7,
    pricePerNight: 1500,
    capacity: 6,
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    description: 'The pinnacle of Paradise hospitality: The Crown Penthouse with private rooftop helipad access, sauna, and grand salon.',
    amenities: ['High-Speed WiFi', '3 Luxury Bedrooms', 'Private Rooftop Deck', 'Sauna', 'Infinity Plunge Pool', 'Private Chef', 'VIP Concierge', 'Helipad Access']
  }
];

/**
 * Generate 120 resort rooms representing Paradise Hotel & Resort full inventory
 * exactly matching the Dashboard baseline: 120 Total Rooms, 34 Available, 86 Occupied
 */
export const buildInitialRooms = () => {
  const roomsMap = new Map();

  // First insert showcase rooms
  SHOWCASE_ROOMS.forEach((r) => roomsMap.set(String(r.roomNumber), { ...r }));

  // We need total 34 Available and 86 Occupied
  // Count already available in showcase rooms
  let currentAvailable = Array.from(roomsMap.values()).filter((r) => r.status === 'Available').length;
  const targetAvailable = 34;

  const images = PRESET_ROOM_IMAGES.map((p) => p.url);

  // Generate 12 rooms per floor across floors 1 to 10 = 120 rooms
  for (let floor = 1; floor <= 10; floor++) {
    for (let rIndex = 1; rIndex <= 12; rIndex++) {
      const roomNumStr = `${floor}${rIndex < 10 ? '0' + rIndex : rIndex}`;
      if (roomsMap.has(roomNumStr)) continue;

      let roomType = 'Standard King';
      let price = 180 + floor * 25;
      let capacity = 2;

      if (floor >= 8) {
        roomType = 'Penthouse';
        price = 1100 + rIndex * 50;
        capacity = 6;
      } else if (floor >= 5) {
        roomType = 'Presidential Suite';
        price = 750 + rIndex * 30;
        capacity = 4;
      } else if (floor >= 3) {
        roomType = 'Executive Suite';
        price = 380 + rIndex * 15;
        capacity = 3;
      } else if (floor >= 2) {
        roomType = 'Deluxe Room';
        price = 240 + rIndex * 10;
        capacity = 2;
      }

      // Determine status: we need exactly targetAvailable (34) available rooms
      let status = 'Occupied';
      if (currentAvailable < targetAvailable) {
        // Distribute available rooms cleanly across floors
        if ((rIndex + floor) % 3 === 0 || currentAvailable < targetAvailable - (10 - floor) * 3) {
          status = 'Available';
          currentAvailable++;
        }
      }

      const img = images[(floor + rIndex) % images.length];

      roomsMap.set(roomNumStr, {
        id: `room-${roomNumStr}`,
        roomNumber: roomNumStr,
        roomType,
        floor,
        pricePerNight: price,
        capacity,
        status,
        image: img,
        description: `Paradise luxury ${roomType.toLowerCase()} on Floor ${floor} with bespoke interior decor, premier comforts, and dedicated room service.`,
        amenities: ['High-Speed WiFi', 'King Bed', 'Smart 4K TV', 'Mini Bar', 'Air Conditioning']
      });
    }
  }

  // Ensure remaining available quota is fulfilled if needed
  const roomsList = Array.from(roomsMap.values());
  let avCount = roomsList.filter((r) => r.status === 'Available').length;
  for (let i = 0; i < roomsList.length && avCount < targetAvailable; i++) {
    if (roomsList[i].status === 'Occupied') {
      roomsList[i].status = 'Available';
      avCount++;
    }
  }

  // Sort by room number numerically
  return roomsList.sort((a, b) =>
    String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, { numeric: true })
  );
};

export const INITIAL_ROOMS = buildInitialRooms();

export const ROOMS_INITIALIZED_KEY = 'hbms_rooms_initialized_v2';

/**
 * Initialize rooms in LocalStorage once, ensuring deleted rooms remain permanently deleted
 */
export const initializeRoomStorage = () => {
  try {
    const isInitialized = localStorage.getItem(ROOMS_INITIALIZED_KEY);
    const existing = localStorage.getItem(ROOMS_STORAGE_KEY);

    if (!isInitialized || !existing) {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(INITIAL_ROOMS));
      localStorage.setItem(ROOMS_INITIALIZED_KEY, 'true');
    }
  } catch (error) {
    console.error('Failed to initialize room storage:', error);
  }
};

/**
 * Get all rooms from LocalStorage
 */
export const getStoredRooms = () => {
  try {
    initializeRoomStorage();
    const data = localStorage.getItem(ROOMS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_ROOMS;
  } catch (error) {
    console.error('Error reading rooms from storage:', error);
    return INITIAL_ROOMS;
  }
};

/**
 * Save all rooms to LocalStorage and keep analytics in sync
 */
export const saveStoredRooms = (rooms) => {
  try {
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    
    // Also sync hbms_analytics room metrics immediately
    const analyticsRaw = localStorage.getItem('hbms_analytics');
    if (analyticsRaw) {
      try {
        const analytics = JSON.parse(analyticsRaw);
        analytics.totalRooms = rooms.length;
        analytics.availableRooms = rooms.filter((r) => r.status === 'Available').length;
        analytics.occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
        localStorage.setItem('hbms_analytics', JSON.stringify(analytics));
      } catch (e) {
        console.warn('Analytics sync warning:', e);
      }
    }
  } catch (error) {
    console.error('Error saving rooms to storage:', error);
  }
};

/**
 * Find room by ID or Room Number
 */
export const getStoredRoomById = (id) => {
  const rooms = getStoredRooms();
  return rooms.find((r) => String(r.id) === String(id) || String(r.roomNumber) === String(id)) || null;
};

/**
 * Add a new room
 */
export const saveNewRoom = (roomData) => {
  const rooms = getStoredRooms();
  
  // Check if room number already exists
  const existingNumber = rooms.find(
    (r) => String(r.roomNumber).trim() === String(roomData.roomNumber).trim()
  );
  if (existingNumber) {
    throw new Error(`Room number ${roomData.roomNumber} already exists.`);
  }

  const newRoom = {
    id: `room-${roomData.roomNumber || Date.now()}`,
    roomNumber: String(roomData.roomNumber).trim(),
    roomType: roomData.roomType || 'Standard King',
    floor: Number(roomData.floor) || 1,
    pricePerNight: Number(roomData.pricePerNight) || 199,
    capacity: Number(roomData.capacity) || 2,
    status: roomData.status || 'Available',
    image: roomData.image || PRESET_ROOM_IMAGES[0].url,
    description: roomData.description || 'Luxury room at Paradise Hotel & Resort with high-end furnishings and premier amenities.',
    amenities: Array.isArray(roomData.amenities) && roomData.amenities.length > 0 
      ? roomData.amenities 
      : ['High-Speed WiFi', 'King Bed', 'Smart 4K TV']
  };

  rooms.unshift(newRoom);
  saveStoredRooms(rooms);
  return newRoom;
};

/**
 * Update an existing room
 */
export const updateStoredRoom = (id, updatedFields) => {
  const rooms = getStoredRooms();
  const index = rooms.findIndex((r) => String(r.id) === String(id) || String(r.roomNumber) === String(id));
  if (index === -1) {
    throw new Error('Room not found.');
  }

  // If room number changed, ensure no collision with another room
  if (updatedFields.roomNumber && String(updatedFields.roomNumber) !== String(rooms[index].roomNumber)) {
    const collision = rooms.find(
      (r, i) => i !== index && String(r.roomNumber).trim() === String(updatedFields.roomNumber).trim()
    );
    if (collision) {
      throw new Error(`Room number ${updatedFields.roomNumber} is already in use by another room.`);
    }
  }

  const updatedRoom = {
    ...rooms[index],
    ...updatedFields,
    floor: updatedFields.floor ? Number(updatedFields.floor) : rooms[index].floor,
    pricePerNight: updatedFields.pricePerNight ? Number(updatedFields.pricePerNight) : rooms[index].pricePerNight,
    capacity: updatedFields.capacity ? Number(updatedFields.capacity) : rooms[index].capacity
  };

  rooms[index] = updatedRoom;
  saveStoredRooms(rooms);
  return updatedRoom;
};

/**
 * Delete a room
 */
export const deleteStoredRoom = (id) => {
  const rooms = getStoredRooms();
  const filtered = rooms.filter((r) => String(r.id) !== String(id) && String(r.roomNumber) !== String(id));
  if (filtered.length === rooms.length) {
    throw new Error('Room not found.');
  }
  saveStoredRooms(filtered);
  return true;
};
