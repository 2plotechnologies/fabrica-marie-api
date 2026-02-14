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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Package, 
  MapPin, 
  Truck,
  CheckCircle,
  Clock,
  RotateCcw,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockProducts, mockUsers } from '@/data/mockData';

interface TrackingItem {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  status: 'EN_ALMACEN' | 'EN_TRANSITO' | 'ENTREGADO' | 'DEVUELTO';
  currentLocation: string;
  vehiclePlate?: string;
  sellerName?: string;
  clientName?: string;
  history: {
    status: string;
    location: string;
    date: Date;
    user: string;
    notes?: string;
  }[];
  createdAt: Date;
}

// Mock tracking data
const mockTracking: TrackingItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Galletas de Vainilla Premium',
    batchNumber: 'LOTE-2024-001',
    quantity: 50,
    status: 'EN_TRANSITO',
    currentLocation: 'Ruta Norte - Vehículo ABC-123',
    vehiclePlate: 'ABC-123',
    sellerName: 'Juan Pérez',
    history: [
      { status: 'EN_ALMACEN', location: 'Almacén Central', date: new Date('2024-12-28T08:00:00'), user: 'Luis Torres' },
      { status: 'EN_TRANSITO', location: 'Cargado en ABC-123', date: new Date('2024-12-28T09:30:00'), user: 'Luis Torres', notes: 'Salida a Ruta Norte' },
    ],
    createdAt: new Date('2024-12-28T08:00:00'),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Galletas de Chocolate',
    batchNumber: 'LOTE-2024-002',
    quantity: 30,
    status: 'ENTREGADO',
    currentLocation: 'Bodega Don Pedro',
    vehiclePlate: 'ABC-123',
    sellerName: 'Juan Pérez',
    clientName: 'Bodega Don Pedro',
    history: [
      { status: 'EN_ALMACEN', location: 'Almacén Central', date: new Date('2024-12-27T08:00:00'), user: 'Luis Torres' },
      { status: 'EN_TRANSITO', location: 'Cargado en ABC-123', date: new Date('2024-12-27T09:00:00'), user: 'Luis Torres' },
      { status: 'ENTREGADO', location: 'Bodega Don Pedro', date: new Date('2024-12-27T11:30:00'), user: 'Juan Pérez', notes: 'Venta #1234' },
    ],
    createdAt: new Date('2024-12-27T08:00:00'),
  },
  {
    id: '3',
    productId: '3',
    productName: 'Galletas Integrales',
    batchNumber: 'LOTE-2024-003',
    quantity: 20,
    status: 'DEVUELTO',
    currentLocation: 'Almacén Central',
    vehiclePlate: 'XYZ-789',
    sellerName: 'Ana García',
    clientName: 'Tienda Rosita',
    history: [
      { status: 'EN_ALMACEN', location: 'Almacén Central', date: new Date('2024-12-26T08:00:00'), user: 'Luis Torres' },
      { status: 'EN_TRANSITO', location: 'Cargado en XYZ-789', date: new Date('2024-12-26T09:00:00'), user: 'Luis Torres' },
      { status: 'DEVUELTO', location: 'Almacén Central', date: new Date('2024-12-26T16:00:00'), user: 'Ana García', notes: 'Cliente rechazó por fecha próxima' },
    ],
    createdAt: new Date('2024-12-26T08:00:00'),
  },
  {
    id: '4',
    productId: '1',
    productName: 'Galletas de Vainilla Premium',
    batchNumber: 'LOTE-2024-004',
    quantity: 100,
    status: 'EN_ALMACEN',
    currentLocation: 'Almacén Central - Ruma A1',
    history: [
      { status: 'EN_ALMACEN', location: 'Almacén Central - Ruma A1', date: new Date('2024-12-28T07:00:00'), user: 'Luis Torres', notes: 'Recepción de producción' },
    ],
    createdAt: new Date('2024-12-28T07:00:00'),
  },
];

const ProductTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTracking, setSelectedTracking] = useState<TrackingItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredTracking = mockTracking.filter((item) => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; label: string; color: string }> = {
      EN_ALMACEN: { variant: 'secondary', icon: <Package className="h-3 w-3 mr-1" />, label: 'En Almacén', color: 'bg-blue-500' },
      EN_TRANSITO: { variant: 'default', icon: <Truck className="h-3 w-3 mr-1" />, label: 'En Tránsito', color: 'bg-amber-500' },
      ENTREGADO: { variant: 'outline', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Entregado', color: 'bg-emerald-500' },
      DEVUELTO: { variant: 'destructive', icon: <RotateCcw className="h-3 w-3 mr-1" />, label: 'Devuelto', color: 'bg-red-500' },
    };
    return configs[status] || { variant: 'outline', icon: null, label: status, color: 'bg-gray-500' };
  };

  const stats = {
    enAlmacen: mockTracking.filter(t => t.status === 'EN_ALMACEN').length,
    enTransito: mockTracking.filter(t => t.status === 'EN_TRANSITO').length,
    entregados: mockTracking.filter(t => t.status === 'ENTREGADO').length,
    devueltos: mockTracking.filter(t => t.status === 'DEVUELTO').length,
  };

  const openDetail = (item: TrackingItem) => {
    setSelectedTracking(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Seguimiento de Productos
          </h1>
          <p className="text-muted-foreground">
            Rastrea el estado y ubicación de los productos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Almacén</p>
                <p className="text-2xl font-bold text-foreground">{stats.enAlmacen}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Truck className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Tránsito</p>
                <p className="text-2xl font-bold text-foreground">{stats.enTransito}</p>
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
                <p className="text-sm text-muted-foreground">Entregados</p>
                <p className="text-2xl font-bold text-foreground">{stats.entregados}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Devueltos</p>
                <p className="text-2xl font-bold text-foreground">{stats.devueltos}</p>
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
                placeholder="Buscar por producto, lote o ubicación..."
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
                <SelectItem value="EN_ALMACEN">En Almacén</SelectItem>
                <SelectItem value="EN_TRANSITO">En Tránsito</SelectItem>
                <SelectItem value="ENTREGADO">Entregado</SelectItem>
                <SelectItem value="DEVUELTO">Devuelto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Seguimiento de Lotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ubicación Actual</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTracking.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                        {item.batchNumber}
                      </code>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.productName}</p>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">{item.quantity}</span> und
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant} className="flex items-center w-fit">
                        {statusConfig.icon}
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.currentLocation}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.sellerName || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openDetail(item)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Historial
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Historial de Seguimiento
            </DialogTitle>
            <DialogDescription>
              {selectedTracking?.productName} - Lote: {selectedTracking?.batchNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTracking && (
            <div className="space-y-6">
              {/* Current Status */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Estado Actual</p>
                    <Badge variant={getStatusConfig(selectedTracking.status).variant} className="mt-1">
                      {getStatusConfig(selectedTracking.status).icon}
                      {getStatusConfig(selectedTracking.status).label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Cantidad</p>
                    <p className="text-xl font-bold">{selectedTracking.quantity} und</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">Ubicación Actual</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {selectedTracking.currentLocation}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-4">Historial de Movimientos</h4>
                <div className="space-y-4">
                  {selectedTracking.history.map((event, index) => {
                    const config = getStatusConfig(event.status);
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`h-4 w-4 rounded-full ${config.color}`} />
                          {index < selectedTracking.history.length - 1 && (
                            <div className="w-0.5 h-full bg-border flex-1 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <Badge variant={config.variant} className="text-xs">
                              {config.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(event.date, "dd MMM yyyy, HH:mm", { locale: es })}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{event.location}</p>
                          <p className="text-xs text-muted-foreground">Por: {event.user}</p>
                          {event.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">"{event.notes}"</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Info */}
              {(selectedTracking.vehiclePlate || selectedTracking.clientName) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  {selectedTracking.vehiclePlate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Vehículo</p>
                      <p className="font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {selectedTracking.vehiclePlate}
                      </p>
                    </div>
                  )}
                  {selectedTracking.clientName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente Destino</p>
                      <p className="font-medium">{selectedTracking.clientName}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductTracking;
