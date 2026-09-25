import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { RoomContext } from './RoomContextCore';
import {
  fetchRoomsApi,
  createRoomApi,
  updateRoomApi,
  deleteRoomApi
} from '../api/roomsApi';

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiSource, setApiSource] = useState('Local API');

  // Filter, Search, Sort & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal Dialogs State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Load Rooms from API
  const loadRooms = useCallback(async (isInitial = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchRoomsApi();
      if (res && res.rooms) {
        setRooms(res.rooms);
        setApiSource(res.source || 'Local API');
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Failed to load rooms. Please check connection and try again.');
      if (!isInitial) {
        toast.error('Failed to load rooms');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount & sync on storage/cross-module events
  useEffect(() => {
    loadRooms(true);

    const handleSync = () => {
      loadRooms(true);
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('hbms_data_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('hbms_data_updated', handleSync);
    };
  }, [loadRooms]);

  // Compute Filtered and Sorted Rooms
  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    // Search query filter (matches room number, type, amenities, floor, or description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => {
        const matchNumber = String(r.roomNumber || '').toLowerCase().includes(q);
        const matchType = String(r.roomType || '').toLowerCase().includes(q);
        const matchFloor = `floor ${r.floor}`.toLowerCase().includes(q) || String(r.floor) === q;
        const matchDescription = String(r.description || '').toLowerCase().includes(q);
        const matchAmenities = Array.isArray(r.amenities) && r.amenities.some((a) => a.toLowerCase().includes(q));
        return matchNumber || matchType || matchFloor || matchDescription || matchAmenities;
      });
    }

    // Room Type filter
    if (typeFilter !== 'All') {
      result = result.filter((r) => r.roomType === typeFilter);
    }

    // Availability status filter
    if (statusFilter !== 'All') {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.pricePerNight) - Number(a.pricePerNight));
        break;
      case 'room-asc':
        result.sort((a, b) => String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, { numeric: true }));
        break;
      case 'room-desc':
        result.sort((a, b) => String(b.roomNumber).localeCompare(String(a.roomNumber), undefined, { numeric: true }));
        break;
      case 'capacity-desc':
        result.sort((a, b) => Number(b.capacity) - Number(a.capacity));
        break;
      default:
        // Default sort: preserve order or room number
        break;
    }

    return result;
  }, [rooms, searchQuery, typeFilter, statusFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / itemsPerPage));

  // Reset to page 1 if current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(start, start + itemsPerPage);
  }, [filteredRooms, currentPage, itemsPerPage]);

  // Overall Statistics for Rooms
  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.status === 'Available').length;
    const occupied = rooms.filter((r) => r.status === 'Occupied').length;
    const maintenance = rooms.filter((r) => r.status === 'Under Maintenance').length;
    const avgPrice = total > 0 
      ? Math.round(rooms.reduce((acc, r) => acc + Number(r.pricePerNight || 0), 0) / total)
      : 0;

    return { total, available, occupied, maintenance, avgPrice };
  }, [rooms]);

  // CRUD Operations
  const handleAddRoom = async (roomData) => {
    try {
      const res = await createRoomApi(roomData);
      setRooms((prev) => [res.room, ...prev]);
      toast.success(`Room ${res.room.roomNumber} created successfully!`);
      setIsAddModalOpen(false);
      return { success: true, room: res.room };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create room';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const handleEditRoom = async (id, roomData) => {
    try {
      const res = await updateRoomApi(id, roomData);
      setRooms((prev) =>
        prev.map((r) => (String(r.id) === String(id) ? res.room : r))
      );
      toast.success(`Room ${res.room.roomNumber} updated successfully!`);
      setIsEditModalOpen(false);
      setSelectedRoom(null);
      return { success: true, room: res.room };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update room';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoomApi(id);
      setRooms((prev) => prev.filter((r) => String(r.id) !== String(id)));
      toast.success('Room deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedRoom(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete room';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const handleToggleStatus = async (id, nextStatus) => {
    const targetRoom = rooms.find((r) => String(r.id) === String(id));
    if (!targetRoom) return;

    try {
      const updated = { ...targetRoom, status: nextStatus };
      await handleEditRoom(id, updated);
    } catch {
      toast.error('Failed to change room status');
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setStatusFilter('All');
    setSortBy('default');
    setCurrentPage(1);
  };

  // Modal open helpers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedRoom(null);
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedRoom(null);
    setIsDeleteModalOpen(false);
  };

  const value = {
    rooms,
    filteredRooms,
    paginatedRooms,
    isLoading,
    error,
    apiSource,
    stats,

    // Filters & Sorting & Pagination
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    viewMode,
    setViewMode,
    resetFilters,

    // CRUD
    loadRooms,
    addRoom: handleAddRoom,
    editRoom: handleEditRoom,
    deleteRoom: handleDeleteRoom,
    toggleRoomStatus: handleToggleStatus,

    // Modals
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedRoom,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
