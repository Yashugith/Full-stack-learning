import React, { createContext, useContext, useState, useCallback } from 'react';
import { SHIPMENTS, CARRIERS } from '../data/mockData';

const FreightContext = createContext(null);

export function FreightProvider({ children }) {
  const [shipments] = useState(SHIPMENTS);
  const [carriers] = useState(CARRIERS);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'SHP-2024-7734 delayed — Antwerp congestion', time: '5m ago', read: false },
    { id: 2, type: 'customs', message: 'SHP-2024-7698 held at Dubai customs', time: '1h ago', read: false },
    { id: 3, type: 'delivered', message: 'SHP-2024-7612 delivered to Hamburg', time: '3d ago', read: true },
  ]);

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = !searchQuery ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.commodity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'in_transit').length,
    delayed: shipments.filter(s => s.status === 'delayed').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    customs: shipments.filter(s => s.status === 'customs').length,
    totalValue: shipments.reduce((sum, s) => sum + s.value, 0),
    onTimeRate: 91,
  };

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <FreightContext.Provider value={{
      shipments,
      carriers,
      filteredShipments,
      selectedShipment,
      setSelectedShipment,
      searchQuery,
      setSearchQuery,
      filterStatus,
      setFilterStatus,
      sidebarOpen,
      setSidebarOpen,
      notifications,
      markAllRead,
      unreadCount,
      stats,
    }}>
      {children}
    </FreightContext.Provider>
  );
}

export function useFreight() {
  const ctx = useContext(FreightContext);
  if (!ctx) throw new Error('useFreight must be used within FreightProvider');
  return ctx;
}
