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
import { 
  Search, 
  Truck, 
  Plus, 
  Wrench, 
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Pencil,
  User,
  Users,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Vehicle } from '@/types';
import { mockUsers } from '@/data/mockData';

// Mock vehicles data con chofer y vendedor
const mockVehicles: (Vehicle & { assignedDriverId?: string })[] = [
  { 
    id: '1', 
    plate: 'ABC-123', 
    brand: 'Toyota', 
    model: 'Hilux', 
    year: 2022, 
    type: 'Camioneta',
    assignedDriverId: 'driver-1',
    assignedSellerId: 'seller-1',
    status: 'EN_RUTA',
    lastMaintenance: new Date('2024-11-15'),
    nextMaintenance: new Date('2024-12-15'),
  },
  { 
    id: '2', 
    plate: 'XYZ-789', 
    brand: 'Hyundai', 
    model: 'H100', 
    year: 2021, 
    type: 'Furgón',
    assignedDriverId: 'driver-2',
    assignedSellerId: 'seller-2',
    status: 'DISPONIBLE',
    lastMaintenance: new Date('2024-10-20'),
    nextMaintenance: new Date('2025-01-20'),
  },
  { 
    id: '3', 
    plate: 'DEF-456', 
    brand: 'Kia', 
    model: 'K2700', 
    year: 2020, 
    type: 'Camión Ligero',
    status: 'MANTENIMIENTO',
    lastMaintenance: new Date('2024-12-10'),
    nextMaintenance: new Date('2025-03-10'),
  },
  { 
    id: '4', 
    plate: 'GHI-321', 
    brand: 'Suzuki', 
    model: 'Carry', 
    year: 2023, 
    type: 'Minivan',
    assignedDriverId: 'seller-3', // El vendedor también es el conductor
    assignedSellerId: 'seller-3',
    status: 'DISPONIBLE',
    lastMaintenance: new Date('2024-09-01'),
    nextMaintenance: new Date('2024-12-01'),
  },
];

// Mock de conductores
const mockDrivers = [
  { id: 'driver-1', name: 'Roberto Díaz', license: 'A-IIB' },
  { id: 'driver-2', name: 'Miguel Santos', license: 'A-IIA' },
  { id: 'seller-1', name: 'Juan Pérez', license: 'A-I' },
  { id: 'seller-2', name: 'Ana García', license: 'A-I' },
  { id: 'seller-3', name: 'Carlos Ruiz', license: 'A-I' },
];

const VehiclesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; label: string }> = {
      DISPONIBLE: { variant: 'default', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Disponible' },
      EN_RUTA: { variant: 'secondary', icon: <MapPin className="h-3 w-3 mr-1" />, label: 'En Ruta' },
      MANTENIMIENTO: { variant: 'destructive', icon: <Wrench className="h-3 w-3 mr-1" />, label: 'Mantenimiento' },
    };
    const config = variants[status] || { variant: 'outline', icon: null, label: status };
    return (
      <Badge variant={config.variant} className="flex items-center">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getMaintenanceStatus = (nextMaintenance?: Date) => {
    if (!nextMaintenance) return null;
    const daysUntil = differenceInDays(nextMaintenance, new Date());
    
    if (daysUntil < 0) {
      return <Badge variant="destructive">Vencido</Badge>;
    } else if (daysUntil <= 7) {
      return <Badge className="bg-amber-500">Próximo ({daysUntil}d)</Badge>;
    }
    return <span className="text-muted-foreground">{daysUntil} días</span>;
  };

  const stats = {
    total: mockVehicles.length,
    available: mockVehicles.filter(v => v.status === 'DISPONIBLE').length,
    inRoute: mockVehicles.filter(v => v.status === 'EN_RUTA').length,
    maintenance: mockVehicles.filter(v => v.status === 'MANTENIMIENTO').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Flota de Vehículos
          </h1>
          <p className="text-muted-foreground">
            Gestión de vehículos y unidades de reparto
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Vehículo</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo vehículo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <Input id="plate" placeholder="ABC-123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camioneta">Camioneta</SelectItem>
                      <SelectItem value="furgon">Furgón</SelectItem>
                      <SelectItem value="camion">Camión Ligero</SelectItem>
                      <SelectItem value="minivan">Minivan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" placeholder="Toyota" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" placeholder="Hilux" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Año</Label>
                <Input id="year" type="number" placeholder="2024" />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vehículos</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Ruta</p>
                <p className="text-2xl font-bold text-foreground">{stats.inRoute}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Mantenimiento</p>
                <p className="text-2xl font-bold text-foreground">{stats.maintenance}</p>
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
                placeholder="Buscar por placa, marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                <SelectItem value="EN_RUTA">En Ruta</SelectItem>
                <SelectItem value="MANTENIMIENTO">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Lista de Vehículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Chofer</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Próximo Mant.</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-muted/50">
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded font-bold">
                      {vehicle.plate}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-xs text-muted-foreground">Año {vehicle.year}</p>
                    </div>
                  </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {vehicle.assignedDriverId ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{mockDrivers.find(d => d.id === vehicle.assignedDriverId)?.name || '-'}</span>
                        </div>
                      ) : <span className="text-muted-foreground">Sin asignar</span>}
                    </TableCell>
                    <TableCell>
                      {vehicle.assignedSellerId ? (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{mockUsers.find(u => u.id === vehicle.assignedSellerId)?.firstName || '-'}</span>
                        </div>
                      ) : <span className="text-muted-foreground">Sin asignar</span>}
                    </TableCell>
                  <TableCell>
                    {getMaintenanceStatus(vehicle.nextMaintenance)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Wrench className="h-4 w-4" />
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

export default VehiclesList;
