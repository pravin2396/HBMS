import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { GuestContext } from './GuestContextCore';
import {
  fetchGuestsApi,
  createGuestApi,
  updateGuestApi,
  deleteGuestApi
} from '../api/guestApi';

export const GuestProvider = ({ children }) => {
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters, Search, Sorting, and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('All');
  const [vipFilter, setVipFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Load guests from API
  const loadGuests = useCallback(async (isInitial = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchGuestsApi();
      if (res && res.guests) {
        setGuests(res.guests);
      }
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError(err.message || 'Failed to load guest list.');
      if (!isInitial) {
        toast.error('Failed to load guest directory');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuests(true);
  }, [loadGuests]);

  // Compute filtered and sorted guests
  const filteredGuests = useMemo(() => {
    let result = [...guests];

    // Search query matches Full Name, Email, Mobile Number, Address, ID Proof Number, Nationality
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((g) => {
        const matchName = String(g.fullName || '').toLowerCase().includes(q);
        const matchEmail = String(g.email || '').toLowerCase().includes(q);
        const matchMobile = String(g.mobileNumber || '').toLowerCase().includes(q);
        const matchAddress = String(g.address || '').toLowerCase().includes(q);
        const matchId = String(g.idProofNumber || '').toLowerCase().includes(q);
        const matchNat = String(g.nationality || '').toLowerCase().includes(q);
        const matchRoom = String(g.roomAssigned || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchMobile || matchAddress || matchId || matchNat || matchRoom;
      });
    }

    // Nationality filter
    if (nationalityFilter !== 'All') {
      result = result.filter((g) => g.nationality === nationalityFilter);
    }

    // VIP tier filter
    if (vipFilter !== 'All') {
      result = result.filter((g) => g.vipStatus === vipFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'name-desc':
        result.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      case 'stays-desc':
        result.sort((a, b) => (Number(b.totalStays) || 0) - (Number(a.totalStays) || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    return result;
  }, [guests, searchQuery, nationalityFilter, vipFilter, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGuests.slice(start, start + itemsPerPage);
  }, [filteredGuests, currentPage, itemsPerPage]);

  // Guest Statistics
  const stats = useMemo(() => {
    const total = guests.length;
    const inHouse = guests.filter((g) => g.stayStatus === 'Checked-In').length;
    const international = guests.filter((g) => g.nationality && g.nationality !== 'United States').length;
    const vipCount = guests.filter((g) => g.vipStatus && g.vipStatus.includes('VIP') || g.vipStatus?.includes('Diamond')).length;

    return { total, inHouse, international, vipCount };
  }, [guests]);

  // CRUD Actions
  const handleAddGuest = async (guestData) => {
    try {
      const res = await createGuestApi(guestData);
      setGuests((prev) => [res.guest, ...prev]);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('hbms_data_updated'));
      }
      toast.success(`Guest "${res.guest.fullName}" added successfully!`);
      setIsAddModalOpen(false);
      return { success: true, guest: res.guest };
    } catch (err) {
      const msg = err.message || 'Failed to add guest';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const handleEditGuest = async (id, updatedFields) => {
    try {
      const res = await updateGuestApi(id, updatedFields);
      setGuests((prev) =>
        prev.map((g) => (String(g.id) === String(id) ? res.guest : g))
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('hbms_data_updated'));
      }
      toast.success(`Guest profile for "${res.guest.fullName}" updated!`);
      setIsEditModalOpen(false);
      setSelectedGuest(null);
      return { success: true, guest: res.guest };
    } catch (err) {
      const msg = err.message || 'Failed to update guest profile';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await deleteGuestApi(id);
      setGuests((prev) => prev.filter((g) => String(g.id) !== String(id)));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('hbms_data_updated'));
      }
      toast.success('Guest record deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedGuest(null);
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Failed to delete guest';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setNationalityFilter('All');
    setVipFilter('All');
    setSortBy('default');
    setCurrentPage(1);
  };

  // Modal helpers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (guest) => {
    setSelectedGuest(guest);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedGuest(null);
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (guest) => {
    setSelectedGuest(guest);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedGuest(null);
    setIsDeleteModalOpen(false);
  };

  const value = {
    guests,
    filteredGuests,
    paginatedGuests,
    isLoading,
    error,
    stats,

    // Filters, Search & Pagination
    searchQuery,
    setSearchQuery,
    nationalityFilter,
    setNationalityFilter,
    vipFilter,
    setVipFilter,
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
    loadGuests,
    addGuest: handleAddGuest,
    editGuest: handleEditGuest,
    deleteGuest: handleDeleteGuest,

    // Modals
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedGuest,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal
  };

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
};
