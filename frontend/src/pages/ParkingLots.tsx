import React, { useState, useEffect } from 'react';
import { MapPin, Info, X } from 'lucide-react';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

interface ParkingSlot {
  id: number;
  slot_number: string;
  status: string;
}

interface ParkingLot {
  id: number;
  name: string;
  address: string;
  total_slots: number;
  slots: ParkingSlot[];
}

interface Vehicle {
  id: number;
  vehicle_number: string;
}

export default function ParkingLots() {
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [bookingForm, setBookingForm] = useState({
    vehicle_id: '',
    duration_hours: 1,
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchLots();
    fetchVehicles();
  }, []);

  const fetchLots = async () => {
    try {
      const response = await client.get('/parking-lots/');
      setLots(response.data);
    } catch (err) {
      console.error('Failed to fetch parking lots', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await client.get('/vehicles/');
      setVehicles(response.data);
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    }
  };

  const openBookingModal = (lot: ParkingLot, slot: ParkingSlot) => {
    if (slot.status !== 'AVAILABLE') return;
    setSelectedLot(lot);
    setSelectedSlot(slot);
    setBookingError('');
    setBookingForm({ vehicle_id: vehicles.length > 0 ? vehicles[0].id.toString() : '', duration_hours: 1 });
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !bookingForm.vehicle_id) return;

    setBookingLoading(true);
    setBookingError('');

    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + bookingForm.duration_hours * 60 * 60 * 1000);

      await client.post('/bookings/', {
        vehicle_id: parseInt(bookingForm.vehicle_id),
        slot_id: selectedSlot.id,
        start_time: now.toISOString(),
        end_time: endTime.toISOString()
      });

      setIsModalOpen(false);
      navigate('/bookings');
    } catch (err: any) {
      setBookingError(err.response?.data?.detail || 'Failed to book slot');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Find Parking</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Browse available parking lots and book your slot.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading parking lots...</div>
      ) : lots.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No parking lots found</h3>
          <p className="text-gray-500 dark:text-gray-400">Check back later for available locations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lots.map(lot => {
            const availableSlots = lot.slots.filter(s => s.status === 'AVAILABLE').length;
            
            return (
              <div key={lot.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{lot.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availableSlots > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                      {availableSlots} / {lot.total_slots} Available
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-1 shrink-0" />
                    {lot.address}
                  </p>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex-1">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Click on an available slot to book</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
                    {lot.slots.map(slot => (
                      <button 
                        key={slot.id} 
                        onClick={() => openBookingModal(lot, slot)}
                        disabled={slot.status !== 'AVAILABLE'}
                        className={`text-center py-2 rounded-md border text-xs font-medium transition-colors ${
                          slot.status === 'AVAILABLE' 
                            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 cursor-pointer' 
                            : 'border-red-200 bg-red-50 text-red-400 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-500/50 cursor-not-allowed opacity-60'
                        }`}
                        title={slot.status}
                      >
                        {slot.slot_number}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500 flex items-center">
                       <Info className="h-4 w-4 mr-1" />
                       ₹30 for 1st hr, ₹20 after
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && selectedSlot && selectedLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    Book Slot {selectedSlot.slot_number}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Location: {selectedLot.name}
                  </p>

                  {bookingError && (
                    <div className="mb-4 bg-red-50 text-red-600 p-2 rounded text-sm">
                      {bookingError}
                    </div>
                  )}

                  <form onSubmit={handleBookingSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Vehicle</label>
                      {vehicles.length === 0 ? (
                        <div className="text-sm text-red-500">
                          You need to add a vehicle first. <span className="underline cursor-pointer" onClick={() => navigate('/vehicles')}>Go to Vehicles</span>
                        </div>
                      ) : (
                        <select
                          required
                          value={bookingForm.vehicle_id}
                          onChange={(e) => setBookingForm({...bookingForm, vehicle_id: e.target.value})}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                        >
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.vehicle_number}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Hours)</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        required
                        value={bookingForm.duration_hours}
                        onChange={(e) => setBookingForm({...bookingForm, duration_hours: parseInt(e.target.value)})}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Estimated Cost: ₹{bookingForm.duration_hours === 1 ? 30 : 30 + (bookingForm.duration_hours - 1) * 20}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-4 -mb-4 mt-4">
                      <button
                        type="submit"
                        disabled={bookingLoading || vehicles.length === 0}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      >
                        {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
