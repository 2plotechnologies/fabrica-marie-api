import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Plus, 
  Search,
  Box,
  Thermometer,
  Calendar,
  Eye,
  Pencil,
  Archive,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Ruma {
  id: string;
  code: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  temperature?: string;
  humidity?: string;
  status: 'ACTIVA' | 'LLENA' | 'MANTENIMIENTO' | 'INACTIVA';
  products: RumaProduct[];
  lastUpdated: Date;
  notes?: string;
}

interface RumaProduct {
  productId: string;
  productName: string;
  quantity: number;
  lotNumber?: string;
  expirationDate?: Date;
}

// Mock data
const mockRumas: Ruma[] = [
  {
    id: '1',
    code: 'R-001',
    name: 'Ruma Principal A',
    location: 'Almacén Central - Zona A',
    capacity: 5000,
    currentStock: 3250,
    temperature: '18-22°C',
    humidity: '45-55%',
    status: 'ACTIVA',
    products: [
      { productId: '1', productName: 'Galleta Soda Premium', quantity: 1500, lotNumber: 'L2024-001', expirationDate: new Date('2025-06-15') },
      { productId: '2', productName: 'Galleta Vainilla Clásica', quantity: 1000, lotNumber: 'L2024-002', expirationDate: new Date('2025-07-20') },
      { productId: '3', productName: 'Galleta Chocolate Intenso', quantity: 750, lotNumber: 'L2024-003', expirationDate: new Date('2025-05-30') },
    ],
    lastUpdated: new Date(),
    notes: 'Ruma principal para productos de alta rotación',
  },
  {
    id: '2',
    code: 'R-002',
    name: 'Ruma Secundaria B',
    location: 'Almacén Central - Zona B',
    capacity: 3000,
    currentStock: 2800,
    temperature: '18-22°C',
    humidity: '45-55%',
    status: 'LLENA',
    products: [
      { productId: '4', productName: 'Galleta Integral', quantity: 1200, lotNumber: 'L2024-010', expirationDate: new Date('2025-08-10') },
      { productId: '5', productName: 'Galleta Animalitos', quantity: 1600, lotNumber: 'L2024-011', expirationDate: new Date('2025-09-05') },
    ],
    lastUpdated: new Date(),
  },
  {
    id: '3',
    code: 'R-003',
    name: 'Ruma Refrigerada C',
    location: 'Almacén Central - Zona C',
    capacity: 2000,
    currentStock: 450,
    temperature: '4-8°C',
    humidity: '60-70%',
    status: 'ACTIVA',
    products: [
      { productId: '6', productName: 'Galleta Rellena Fresa', quantity: 450, lotNumber: 'L2024-020', expirationDate: new Date('2025-03-15') },
    ],
    lastUpdated: new Date(),
    notes: 'Productos que requieren refrigeración',
  },
  {
    id: '4',
    code: 'R-004',
    name: 'Ruma Mantenimiento D',
    location: 'Almacén Secundario',
    capacity: 4000,
    currentStock: 0,
    status: 'MANTENIMIENTO',
    products: [],
    lastUpdated: new Date(),
    notes: 'En reparación de estantería hasta el 25/12',
  },
];

const RumaManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRuma, setSelectedRuma] = useState<Ruma | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredRumas = mockRumas.filter((ruma) => {
    const matchesSearch = 
      ruma.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruma.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruma.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ruma.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Ruma['status']) => {
    const variants: Record<Ruma['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      ACTIVA: { variant: 'default', label: 'Activa' },
      LLENA: { variant: 'secondary', label: 'Llena' },
      MANTENIMIENTO: { variant: 'destructive', label: 'Mantenimiento' },
      INACTIVA: { variant: 'outline', label: 'Inactiva' },
    };
    return <Badge variant={variants[status].variant}>{variants[status].label}</Badge>;
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const stats = {
    totalRumas: mockRumas.length,
    activeRumas: mockRumas.filter(r => r.status === 'ACTIVA').length,
    totalCapacity: mockRumas.reduce((sum, r) => sum + r.capacity, 0),
    totalStock: mockRumas.reduce((sum, r) => sum + r.currentStock, 0),
  };

  const handleViewDetails = (ruma: Ruma) => {
    setSelectedRuma(ruma);
    setIsDetailDialogOpen(true);
  };

  const handleCreateRuma = () => {
    toast({
      title: "Ruma creada",
      description: "La nueva ruma ha sido registrada exitosamente.",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Gestión de Rumas
          </h1>
          <p className="text-muted-foreground">
            Control de ubicaciones y capacidades de almacenamiento
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Ruma
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Nueva Ruma</DialogTitle>
              <DialogDescription>
                Define las características de la nueva ubicación de almacenamiento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input placeholder="R-005" />
                </div>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Ruma E" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input placeholder="Almacén Central - Zona E" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Capacidad (unidades)</Label>
                  <Input type="number" placeholder="5000" min="0" />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select defaultValue="ACTIVA">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVA">Activa</SelectItem>
                      <SelectItem value="INACTIVA">Inactiva</SelectItem>
                      <SelectItem value="MANTENIMIENTO">En Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Temperatura</Label>
                  <Input placeholder="18-22°C" />
                </div>
                <div className="space-y-2">
                  <Label>Humedad</Label>
                  <Input placeholder="45-55%" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea placeholder="Observaciones adicionales..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-gradient-warm hover:opacity-90" onClick={handleCreateRuma}>
                Crear Ruma
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
                <Archive className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rumas</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalRumas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Box className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rumas Activas</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.activeRumas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacidad Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCapacity.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Archive className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Actual</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalStock.toLocaleString()}</p>
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
                placeholder="Buscar por código, nombre o ubicación..."
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
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ACTIVA">Activa</SelectItem>
                <SelectItem value="LLENA">Llena</SelectItem>
                <SelectItem value="MANTENIMIENTO">Mantenimiento</SelectItem>
                <SelectItem value="INACTIVA">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rumas Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            Lista de Rumas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre / Ubicación</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Ocupación</TableHead>
                <TableHead>Condiciones</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRumas.map((ruma) => {
                const percentage = (ruma.currentStock / ruma.capacity) * 100;
                return (
                  <TableRow key={ruma.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">{ruma.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ruma.name}</p>
                        <p className="text-xs text-muted-foreground">{ruma.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{ruma.currentStock.toLocaleString()}</span>
                        <span className="text-muted-foreground"> / {ruma.capacity.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24 space-y-1">
                        <Progress value={percentage} className="h-2" />
                        <p className={`text-xs font-medium ${getCapacityColor(percentage)}`}>
                          {percentage.toFixed(0)}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {ruma.temperature && (
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            {ruma.temperature}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ruma.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(ruma)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedRuma && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-primary" />
                  {selectedRuma.name} ({selectedRuma.code})
                </DialogTitle>
                <DialogDescription>
                  {selectedRuma.location}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Características */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Capacidad</p>
                    <p className="font-semibold">{selectedRuma.capacity.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Stock Actual</p>
                    <p className="font-semibold">{selectedRuma.currentStock.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Temperatura</p>
                    <p className="font-semibold">{selectedRuma.temperature || 'Ambiente'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Humedad</p>
                    <p className="font-semibold">{selectedRuma.humidity || 'Normal'}</p>
                  </div>
                </div>

                {/* Productos */}
                {selectedRuma.products.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Productos en esta Ruma
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Lote</TableHead>
                          <TableHead>Vencimiento</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRuma.products.map((product, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{product.productName}</TableCell>
                            <TableCell>{product.quantity.toLocaleString()}</TableCell>
                            <TableCell className="font-mono text-sm">{product.lotNumber || '-'}</TableCell>
                            <TableCell>
                              {product.expirationDate ? (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(product.expirationDate, 'dd/MM/yyyy', { locale: es })}
                                </span>
                              ) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {selectedRuma.notes && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Notas</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">{selectedRuma.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RumaManagement;
