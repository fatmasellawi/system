import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useUserContext = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  export const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, closeModal, openModal }}>
      {children}
    </ModalContext.Provider>
  );
};
