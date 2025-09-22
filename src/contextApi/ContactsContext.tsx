"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface ContactsContextType {
  refreshContacts: () => void;
  isRefreshing: boolean;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const refreshContacts = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate and refetch all contacts queries
      await queryClient.invalidateQueries({ queryKey: ['contacts'] });
    } catch (error) {
      console.error('Error refreshing contacts:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <ContactsContext.Provider
      value={{
        refreshContacts,
        isRefreshing,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = (): ContactsContextType => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}; 