import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  UserCog, 
  Plus, 
  Mail,
  Phone,
  Users,
  UserCheck,
  UserX,
  Eye,
  Pencil,
} from 'lucide-react';
import { mockUsers } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, UserRole } from '@/types';

// Extended mock users for HR
const mockEmployees: User[] = [
  ...mockUsers,
  {
    id: 'seller-3',
    email: 'carlos.mendez@galletas.com',
    firstName: 'Carlos',
    lastName: 'Méndez',
    phone: '999555444',
    role: 'VENDEDOR',
    status: 'ACTIVO',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'cajero-1',
    email: 'maria.fernandez@galletas.com',
    firstName: 'María',
    lastName: 'Fernández',
    phone: '999444333',
    role: 'CAJERO',
    status: 'ACTIVO',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'supervisor-1',
    email: 'roberto.silva@galletas.com',
    firstName: 'Roberto',
    lastName: 'Silva',
    phone: '999333222',
    role: 'SUPERVISOR',
    status: 'ACTIVO',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'admin-1',
    email: 'admin@galletas.com',
    firstName: 'Juan',
    lastName: 'Domínguez',
    phone: '999111000',
    role: 'ADMIN',
    status: 'ACTIVO',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-12-01'),
  },
];

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

const EmployeesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredEmployees = mockEmployees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ADMIN: 'bg-purple-500',
      GERENTE: 'bg-blue-500',
      SUPERVISOR: 'bg-cyan-500',
      VENDEDOR: 'bg-emerald-500',
      ALMACENERO: 'bg-amber-500',
      CAJERO: 'bg-pink-500',
      RRHH: 'bg-indigo-500',
      FIDELIZACION: 'bg-orange-500',
      MANTENIMIENTO: 'bg-slate-500',
    };
    return (
      <Badge className={colors[role]}>
        {roleLabels[role]}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const stats = {
    total: mockEmployees.length,
    active: mockEmployees.filter(e => e.status === 'ACTIVO').length,
    sellers: mockEmployees.filter(e => e.role === 'VENDEDOR').length,
  };

  const roles = Object.keys(roleLabels) as UserRole[];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Recursos Humanos
          </h1>
          <p className="text-muted-foreground">
            Gestión de empleados y colaboradores
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Empleado</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo colaborador
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Juan" />
                </div>
                <div className="space-y-2">
                  <Label>Apellido</Label>
                  <Input placeholder="Pérez" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Correo Electrónico</Label>
                <Input type="email" placeholder="juan.perez@fabrica.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="999888777" />
                </div>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {roleLabels[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Campos de salario */}
              <div className="border-t pt-4 mt-2">
                <h4 className="text-sm font-medium mb-3">Información Salarial</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Sueldo Base (S/)</Label>
                    <Input type="number" placeholder="1500" min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora Extra (S/)</Label>
                    <Input type="number" placeholder="15" min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>AFP (%)</Label>
                    <Input type="number" placeholder="13" min="0" max="100" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Salario del mes = Sueldo Base + (Horas Extras x Tarifa) - (Sueldo x AFP%)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-gradient-warm hover:opacity-90">
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Empleados</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <UserCog className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendedores</p>
                <p className="text-2xl font-bold text-foreground">{stats.sellers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleLabels[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ACTIVO">Activo</SelectItem>
                <SelectItem value="INACTIVO">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Lista de Empleados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(employee.firstName, employee.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {employee.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {employee.email}
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {employee.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(employee.role)}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'ACTIVO' ? 'default' : 'secondary'}>
                      {employee.status === 'ACTIVO' ? (
                        <><UserCheck className="h-3 w-3 mr-1" /> Activo</>
                      ) : (
                        <><UserX className="h-3 w-3 mr-1" /> Inactivo</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(employee.createdAt, "dd MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesList;
