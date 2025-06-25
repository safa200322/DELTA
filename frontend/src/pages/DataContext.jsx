import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [chauffeurs, setChauffeurs] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      license: "DL1234567890",
      status: "Pending",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      license: "DL0987654321",
      status: "Pending",
    },
  ]);

  const [users] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Customer",
    },
    { id: 2, name: "Bob Wilson", email: "bob@example.com", role: "Customer" },
  ]);

  const addChauffeur = (chauffeur) => {
    setChauffeurs([...chauffeurs, chauffeur]);
  };

  const updateChauffeurStatus = (id, status) => {
    setChauffeurs(
      chauffeurs.map((chauffeur) =>
        chauffeur.id === id ? { ...chauffeur, status } : chauffeur
      )
    );
  };

  return (
    <DataContext.Provider
      value={{ chauffeurs, users, addChauffeur, updateChauffeurStatus }}
    >
      {children}
    </DataContext.Provider>
  );
};
