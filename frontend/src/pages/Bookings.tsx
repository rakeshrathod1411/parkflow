import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, QrCode, MapPin } from 'lucide-react';
import client from '../api/client';

interface Booking {
  id: number;
  vehicle_id: number;
  slot_id: number;
  start_time: string;
  end_time: string;
  status: string;
  amount: number;
  qr_code_hash: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await client.get('/bookings/');
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View your parking reservations and history.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No bookings found</h3>
          <p className="text-gray-500 dark:text-gray-400">You haven't made any parking reservations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                      booking.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500' :
                      booking.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {booking.status}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Booking #{booking.id}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">₹{booking.amount}</div>
                    <div className="text-xs text-gray-500">Total Amount</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">From</div>
                      <div>{formatDate(booking.start_time)}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">To</div>
                      <div>{formatDate(booking.end_time)}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Car className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">Vehicle ID</div>
                      <div>{booking.vehicle_id}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">Slot ID</div>
                      <div>{booking.slot_id}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/80 p-6 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-w-[200px]">
                {booking.qr_code_hash ? (
                  <>
                    <div className="bg-white p-2 rounded-lg mb-2">
                      <QrCode className="h-24 w-24 text-gray-900" />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{booking.qr_code_hash.substring(0, 8)}...</span>
                    <div className="text-xs text-gray-500 mt-2 text-center">Scan at entrance</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">No QR Code</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
