import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Plus, FileDown, Truck, Package, Search, Filter, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos para Salida de Fábrica
interface FactoryOutputItem {
  id: string;
  presentacion: string;
  marca: string;
  kilos: number;
  totalKilos: number;
  stockInicial: number;
  salidaFabrica: number;
  total: number;
  stockFinalBuenos: number;
  stockFinalDanados: number;
}

interface FactoryOutput {
  id: string;
  fecha: Date;
  vehiculoId: string;
  vehiculoPlaca: string;
  vendedor: string;
  almacenero: string;
  items: FactoryOutputItem[];
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'EN_RUTA';
  createdAt: Date;
}

// Mock de vehículos
const mockVehiculos = [
  { id: '1', placa: 'ABC-123', vendedor: 'Carlos Ruiz' },
  { id: '2', placa: 'DEF-456', vendedor: 'María López' },
  { id: '3', placa: 'GHI-789', vendedor: 'Pedro Sánchez' },
  { id: '4', placa: 'JKL-012', vendedor: 'Ana García' },
];

// Mock de productos
const mockProductos = [
  { id: '1', presentacion: 'Galleta Clásica 100g', marca: 'Rey del Centro', kilos: 0.1 },
  { id: '2', presentacion: 'Galleta Chocolate 150g', marca: 'Rey del Centro', kilos: 0.15 },
  { id: '3', presentacion: 'Galleta Vainilla 200g', marca: 'Rey del Centro', kilos: 0.2 },
  { id: '4', presentacion: 'Galleta Integral 100g', marca: 'Rey del Centro', kilos: 0.1 },
  { id: '5', presentacion: 'Galleta Coco 150g', marca: 'Rey del Centro', kilos: 0.15 },
  { id: '6', presentacion: 'Galleta Surtida 250g', marca: 'Rey del Centro', kilos: 0.25 },
];

// Mock de salidas registradas
const mockSalidas: FactoryOutput[] = [
  {
    id: '1',
    fecha: new Date(),
    vehiculoId: '1',
    vehiculoPlaca: 'ABC-123',
    vendedor: 'Carlos Ruiz',
    almacenero: 'Juan Domínguez',
    estado: 'EN_RUTA',
    createdAt: new Date(),
    items: [
      { id: '1', presentacion: 'Galleta Clásica 100g', marca: 'Rey del Centro', kilos: 0.1, totalKilos: 50, stockInicial: 500, salidaFabrica: 500, total: 500, stockFinalBuenos: 0, stockFinalDanados: 0 },
      { id: '2', presentacion: 'Galleta Chocolate 150g', marca: 'Rey del Centro', kilos: 0.15, totalKilos: 45, stockInicial: 300, salidaFabrica: 300, total: 300, stockFinalBuenos: 0, stockFinalDanados: 0 },
    ]
  },
  {
    id: '2',
    fecha: new Date(Date.now() - 86400000),
    vehiculoId: '2',
    vehiculoPlaca: 'DEF-456',
    vendedor: 'María López',
    almacenero: 'Juan Domínguez',
    estado: 'CONFIRMADO',
    createdAt: new Date(Date.now() - 86400000),
    items: [
      { id: '1', presentacion: 'Galleta Vainilla 200g', marca: 'Rey del Centro', kilos: 0.2, totalKilos: 80, stockInicial: 400, salidaFabrica: 400, total: 400, stockFinalBuenos: 50, stockFinalDanados: 5 },
    ]
  },
];

const FactoryOutputPage = () => {
  const [salidas, setSalidas] = useState<FactoryOutput[]>(mockSalidas);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVehiculo, setSelectedVehiculo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVehiculo, setFilterVehiculo] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [selectedSalida, setSelectedSalida] = useState<FactoryOutput | null>(null);
  const [newItems, setNewItems] = useState<FactoryOutputItem[]>([]);

  // Filtrar salidas
  const filteredSalidas = salidas.filter(salida => {
    const matchesSearch = salida.vehiculoPlaca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          salida.vendedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVehiculo = filterVehiculo === 'all' || salida.vehiculoId === filterVehiculo;
    const matchesEstado = filterEstado === 'all' || salida.estado === filterEstado;
    return matchesSearch && matchesVehiculo && matchesEstado;
  });

  // KPIs
  const salidasHoy = salidas.filter(s => format(s.fecha, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));
  const totalKilosHoy = salidasHoy.reduce((acc, s) => acc + s.items.reduce((sum, i) => sum + i.totalKilos, 0), 0);
  const vehiculosEnRuta = salidas.filter(s => s.estado === 'EN_RUTA').length;

  const handleAddProduct = (productoId: string, cantidad: number) => {
    const producto = mockProductos.find(p => p.id === productoId);
    if (!producto) return;

    const newItem: FactoryOutputItem = {
      id: productoId,
      presentacion: producto.presentacion,
      marca: producto.marca,
      kilos: producto.kilos,
      totalKilos: cantidad * producto.kilos,
      stockInicial: 1000, // Mock
      salidaFabrica: cantidad,
      total: cantidad,
      stockFinalBuenos: 0,
      stockFinalDanados: 0,
    };

    setNewItems([...newItems, newItem]);
  };

  const handleCreateSalida = () => {
    const vehiculo = mockVehiculos.find(v => v.id === selectedVehiculo);
    if (!vehiculo || newItems.length === 0) return;

    const newSalida: FactoryOutput = {
      id: Date.now().toString(),
      fecha: selectedDate,
      vehiculoId: selectedVehiculo,
      vehiculoPlaca: vehiculo.placa,
      vendedor: vehiculo.vendedor,
      almacenero: 'Juan Domínguez',
      items: newItems,
      estado: 'PENDIENTE',
      createdAt: new Date(),
    };

    setSalidas([newSalida, ...salidas]);
    setNewItems([]);
    setSelectedVehiculo('');
    setIsNewDialogOpen(false);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">Pendiente</Badge>;
      case 'CONFIRMADO':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Confirmado</Badge>;
      case 'EN_RUTA':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">En Ruta</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Salida de Fábrica</h1>
          <p className="text-muted-foreground">Control de entrega de productos a carros-vendedores</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-warm hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Salida
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Salida de Fábrica</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Datos generales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDate, 'PPP', { locale: es })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Vehículo / Carro-Vendedor</Label>
                    <Select value={selectedVehiculo} onValueChange={setSelectedVehiculo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVehiculos.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.placa} - {v.vendedor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Almacenero</Label>
                    <Input value="Juan Domínguez" disabled />
                  </div>
                </div>

                {/* Agregar productos */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Agregar Productos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProductos.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.presentacion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Cantidad" />
                      <Button onClick={() => handleAddProduct('1', 100)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabla de productos a entregar */}
                {newItems.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Productos a Entregar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Presentación</TableHead>
                            <TableHead>Marca</TableHead>
                            <TableHead className="text-right">Kilos</TableHead>
                            <TableHead className="text-right">Total Kilos</TableHead>
                            <TableHead className="text-right">Stock Inicial</TableHead>
                            <TableHead className="text-right">Salida</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {newItems.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{item.presentacion}</TableCell>
                              <TableCell>{item.marca}</TableCell>
                              <TableCell className="text-right">{item.kilos}</TableCell>
                              <TableCell className="text-right">{item.totalKilos.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{item.stockInicial}</TableCell>
                              <TableCell className="text-right">{item.salidaFabrica}</TableCell>
                              <TableCell className="text-right font-medium">{item.total}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateSalida} disabled={!selectedVehiculo || newItems.length === 0}>
                    Registrar Salida
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Truck className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salidas Hoy</p>
                <p className="text-2xl font-bold text-foreground">{salidasHoy.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kilos Despachados Hoy</p>
                <p className="text-2xl font-bold text-foreground">{totalKilosHoy.toFixed(0)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Truck className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehículos en Ruta</p>
                <p className="text-2xl font-bold text-foreground">{vehiculosEnRuta}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos Diferentes</p>
                <p className="text-2xl font-bold text-foreground">{mockProductos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y tabla */}
      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Salidas</TabsTrigger>
          <TabsTrigger value="reporte">Reporte por Vehículo</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por placa o vendedor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterVehiculo} onValueChange={setFilterVehiculo}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los vehículos</SelectItem>
                    {mockVehiculos.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.placa}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                    <SelectItem value="EN_RUTA">En Ruta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de salidas */}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Almacenero</TableHead>
                    <TableHead className="text-right">Productos</TableHead>
                    <TableHead className="text-right">Total Kilos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalidas.map((salida) => (
                    <TableRow key={salida.id}>
                      <TableCell>{format(salida.fecha, 'dd/MM/yyyy', { locale: es })}</TableCell>
                      <TableCell className="font-medium">{salida.vehiculoPlaca}</TableCell>
                      <TableCell>{salida.vendedor}</TableCell>
                      <TableCell>{salida.almacenero}</TableCell>
                      <TableCell className="text-right">{salida.items.length}</TableCell>
                      <TableCell className="text-right">
                        {salida.items.reduce((sum, i) => sum + i.totalKilos, 0).toFixed(2)} kg
                      </TableCell>
                      <TableCell>{getEstadoBadge(salida.estado)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSalida(salida)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporte" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Salidas por Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVehiculos.map(vehiculo => {
                  const salidasVehiculo = salidas.filter(s => s.vehiculoId === vehiculo.id);
                  const totalKilos = salidasVehiculo.reduce((acc, s) => 
                    acc + s.items.reduce((sum, i) => sum + i.totalKilos, 0), 0
                  );
                  
                  return (
                    <Card key={vehiculo.id} className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{vehiculo.placa}</p>
                              <p className="text-sm text-muted-foreground">{vehiculo.vendedor}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Salidas</p>
                            <p className="font-bold">{salidasVehiculo.length}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Kilos</p>
                            <p className="font-bold">{totalKilos.toFixed(2)} kg</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de detalle */}
      <Dialog open={!!selectedSalida} onOpenChange={() => setSelectedSalida(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Salida de Fábrica</DialogTitle>
          </DialogHeader>
          
          {selectedSalida && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">{format(selectedSalida.fecha, 'PPP', { locale: es })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehículo</p>
                  <p className="font-medium">{selectedSalida.vehiculoPlaca}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendedor</p>
                  <p className="font-medium">{selectedSalida.vendedor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  {getEstadoBadge(selectedSalida.estado)}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Presentación</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead className="text-right">Kilos</TableHead>
                    <TableHead className="text-right">Total Kilos</TableHead>
                    <TableHead className="text-right">Stock Inicial</TableHead>
                    <TableHead className="text-right">Salida</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Stock Final (Buenos)</TableHead>
                    <TableHead className="text-right">Stock Final (Dañados)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSalida.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.presentacion}</TableCell>
                      <TableCell>{item.marca}</TableCell>
                      <TableCell className="text-right">{item.kilos}</TableCell>
                      <TableCell className="text-right">{item.totalKilos.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.stockInicial}</TableCell>
                      <TableCell className="text-right">{item.salidaFabrica}</TableCell>
                      <TableCell className="text-right font-medium">{item.total}</TableCell>
                      <TableCell className="text-right">{item.stockFinalBuenos}</TableCell>
                      <TableCell className="text-right text-destructive">{item.stockFinalDanados}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedSalida(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FactoryOutputPage;
