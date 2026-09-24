import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  Plus,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Check,
  Building
} from 'lucide-react';
import { useRooms } from '../../context/useRooms';
import {
  ROOM_TYPES,
  ROOM_STATUSES,
  DEFAULT_AMENITIES_LIST,
  PRESET_ROOM_IMAGES
} from '../../utils/roomStorage';

const RoomModal = () => {
  const {
    isAddModalOpen,
    isEditModalOpen,
    closeAddModal,
    closeEditModal,
    selectedRoom,
    addRoom,
    editRoom
  } = useRooms();

  const isOpen = isAddModalOpen || isEditModalOpen;
  const isEditing = isEditModalOpen && selectedRoom;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      roomNumber: '',
      roomType: 'Deluxe Room',
      floor: 1,
      pricePerNight: 250,
      capacity: 2,
      status: 'Available',
      image: PRESET_ROOM_IMAGES[0].url,
      description: ''
    }
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);

  const watchedImage = watch('image');

  // Populate or reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          roomNumber: selectedRoom.roomNumber || '',
          roomType: selectedRoom.roomType || 'Deluxe Room',
          floor: selectedRoom.floor || 1,
          pricePerNight: selectedRoom.pricePerNight || 250,
          capacity: selectedRoom.capacity || 2,
          status: selectedRoom.status || 'Available',
          image: selectedRoom.image || PRESET_ROOM_IMAGES[0].url,
          description: selectedRoom.description || ''
        });
        setSelectedAmenities(Array.isArray(selectedRoom.amenities) ? selectedRoom.amenities : []);
        // Check if image is one of presets
        const isPreset = PRESET_ROOM_IMAGES.some((p) => p.url === selectedRoom.image);
        setUseCustomImage(!isPreset);
      } else {
        reset({
          roomNumber: '',
          roomType: 'Deluxe Room',
          floor: 1,
          pricePerNight: 250,
          capacity: 2,
          status: 'Available',
          image: PRESET_ROOM_IMAGES[0].url,
          description: ''
        });
        setSelectedAmenities(['High-Speed WiFi', 'King Bed', 'Smart 4K TV']);
        setUseCustomImage(false);
      }
    }
  }, [isOpen, isEditing, selectedRoom, reset]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isEditing) {
      closeEditModal();
    } else {
      closeAddModal();
    }
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddCustomAmenity = (e) => {
    e.preventDefault();
    if (customAmenityInput.trim()) {
      const trimmed = customAmenityInput.trim();
      if (!selectedAmenities.includes(trimmed)) {
        setSelectedAmenities((prev) => [...prev, trimmed]);
      }
      setCustomAmenityInput('');
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      floor: Number(data.floor),
      pricePerNight: Number(data.pricePerNight),
      capacity: Number(data.capacity),
      amenities: selectedAmenities.length > 0 ? selectedAmenities : ['High-Speed WiFi', 'King Bed']
    };

    if (isEditing) {
      await editRoom(selectedRoom.id, payload);
    } else {
      await addRoom(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      
      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {isEditing ? `Edit Room ${selectedRoom?.roomNumber}` : 'Add New Luxury Room'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update room specifications, pricing, and amenities'
                  : 'Configure room details to add to Paradise inventory'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: Room Number, Type, Floor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Room Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Room Number <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                {...register('roomNumber', {
                  required: 'Room number is required',
                  pattern: { value: /^[0-9a-zA-Z-]+$/, message: 'Alphanumeric only' }
                })}
                placeholder="e.g. 305"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
              />
              {errors.roomNumber && (
                <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                  {errors.roomNumber.message}
                </span>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Room Type <span className="text-amber-400">*</span>
              </label>
              <select
                {...register('roomType', { required: true })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 focus:outline-none cursor-pointer"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Floor Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Floor <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="25"
                {...register('floor', {
                  required: 'Floor is required',
                  min: { value: 1, message: 'Min 1' }
                })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
              />
              {errors.floor && (
                <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                  {errors.floor.message}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Price Per Night, Capacity, Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price Per Night */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Rate / Night ($) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-amber-400 font-bold text-sm pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  {...register('pricePerNight', {
                    required: 'Price is required',
                    min: { value: 50, message: 'Min $50' }
                  })}
                  placeholder="250"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
              {errors.pricePerNight && (
                <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                  {errors.pricePerNight.message}
                </span>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Capacity (Guests) <span className="text-amber-400">*</span>
              </label>
              <select
                {...register('capacity', { required: true })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={5}>5 Guests</option>
                <option value={6}>6 Guests</option>
                <option value={8}>8 Guests</option>
              </select>
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Availability <span className="text-amber-400">*</span>
              </label>
              <select
                {...register('status', { required: true })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 focus:outline-none cursor-pointer"
              >
                {ROOM_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Room Image Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Room Image <span className="text-amber-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setUseCustomImage(!useCustomImage)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                {useCustomImage ? 'Choose Preset Photo' : 'Enter Custom Image URL'}
              </button>
            </div>

            {!useCustomImage ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_ROOM_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setValue('image', preset.url)}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all cursor-pointer group ${
                      watchedImage === preset.url
                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {watchedImage === preset.url && (
                      <div className="absolute inset-0 bg-amber-500/30 backdrop-blur-[1px] flex items-center justify-center">
                        <Check className="w-5 h-5 text-amber-300 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  {...register('image', { required: 'Image URL is required' })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            )}
            {errors.image && (
              <span className="text-[11px] text-rose-400 mt-1 block font-medium">
                {errors.image.message}
              </span>
            )}
          </div>

          {/* Row 4: Amenities Multi-Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Amenities
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {DEFAULT_AMENITIES_LIST.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amenity Adder */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customAmenityInput}
                onChange={(e) => setCustomAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomAmenity(e);
                  }
                }}
                placeholder="Add custom amenity (e.g. Helipad Access)..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddCustomAmenity}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Room Description (Optional)
            </label>
            <textarea
              rows={2}
              {...register('description')}
              placeholder="Provide a luxurious description highlighting room ambiance, view, and unique features..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Room'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RoomModal;
