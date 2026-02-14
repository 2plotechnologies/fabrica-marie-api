import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types';

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  roleLabels: Record<UserRole, string>;
  rolePermissions: Record<UserRole, string[]>;
}

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  GERENTE: 'Gerente',
  SUPERVISOR: 'Supervisor',
  VENDEDOR: 'Vendedor',
  ALMACENERO: 'Almacenero',
  CAJERO: 'Cajero',
  RRHH: 'Recursos Humanos',
  FIDELIZACION: 'Fidelización',
  MANTENIMIENTO: 'Mant. Vehicular',
};

// Define qué módulos puede ver cada rol
const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: ['dashboard', 'almacen', 'ventas', 'clientes', 'caja', 'rutas', 'gps', 'vehiculos', 'mantenimiento', 'rrhh', 'fidelizacion', 'reportes', 'configuracion'],
  GERENTE: ['dashboard', 'almacen', 'ventas', 'clientes', 'caja', 'rutas', 'gps', 'vehiculos', 'mantenimiento', 'rrhh', 'fidelizacion', 'reportes'],
  SUPERVISOR: ['dashboard', 'almacen', 'ventas', 'clientes', 'rutas', 'gps', 'vehiculos', 'reportes'],
  VENDEDOR: ['dashboard', 'ventas', 'clientes', 'rutas'],
  ALMACENERO: ['dashboard', 'almacen', 'ventas'],
  CAJERO: ['dashboard', 'caja', 'ventas'],
  RRHH: ['dashboard', 'rrhh', 'reportes'],
  FIDELIZACION: ['dashboard', 'ventas', 'clientes', 'rutas', 'fidelizacion'],
  MANTENIMIENTO: ['dashboard', 'rutas', 'vehiculos', 'mantenimiento'],
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, roleLabels, rolePermissions }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const hasPermission = (role: UserRole, module: string): boolean => {
  return rolePermissions[role]?.includes(module) ?? false;
};
