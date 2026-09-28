// src/hooks/useReservation.js
import { useState } from 'react';
import { mockTables } from '../data/tables';

export const useReservation = () => {
  const [reservations, setReservations] = useState([]);

  const createReservation = (bookingData) => {
    const newReservation = {
      id: 'RES-' + Date.now(),
      ...bookingData,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    setReservations(prev => [newReservation, ...prev]);
    return newReservation;
  };

  const cancelReservation = (id) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r));
  };

  const checkAvailability = (date, timeSlot, partySize) => {
    const bookedTableIds = reservations
      .filter(r => r.date === date && r.timeSlot === timeSlot && r.status === 'Confirmed')
      .map(r => r.tableId);

    const availableTables = mockTables.filter(
      t => t.seats >= partySize && !bookedTableIds.includes(t.id)
    );

    return availableTables;
  };

  return { reservations, createReservation, cancelReservation, checkAvailability };
};