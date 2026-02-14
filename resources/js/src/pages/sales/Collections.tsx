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
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, FileDown, Search, Plus, DollarSign, Users, Clock, AlertTriangle, Truck, TrendingUp } from 'lucide-react';

// Tipos basados en el Excel de Cobranzas
interface Collection {
  id: string;
  fecha: Date;
  clienteId: string;
  clienteNombre: string;
  notaPedido: string;
  deudaOriginal: number;
  aCuenta: number;
  saldoTotal: number;
  vendedorId: string;
  vendedor: string;
  vehiculoPlaca: string;
  diasRuta: number; // Días de ruta del vendedor
  createdAt: Date;
}

// Mock data
const mockVendedores = [
  { id: '1', nombre: 'Carlos Ruiz', placa: 'ABC-123' },
  { id: '2', nombre: 'María López', placa: 'DEF-456' },
  { id: '3', nombre: 'Pedro Sánchez', placa: 'GHI-789' },
];

const mockCobranzas: Collection[] = [
  {
    id: '1',
    fecha: new Date(),
    clienteId: '1',
    clienteNombre: 'Distribuidora El Sol',
    notaPedido: 'NP-001',
    deudaOriginal: 500,
    aCuenta: 200,
    saldoTotal: 300,
    vendedorId: '1',
    vendedor: 'Carlos Ruiz',
    vehiculoPlaca: 'ABC-123',
    diasRuta: 3,
    createdAt: new Date(),
  },
  {
    id: '2',
    fecha: new Date(),
    clienteId: '2',
    clienteNombre: 'Mayorista Central',
    notaPedido: 'NP-003',
    deudaOriginal: 1200,
    aCuenta: 600,
    saldoTotal: 600,
    vendedorId: '1',
    vendedor: 'Carlos Ruiz',
    vehiculoPlaca: 'ABC-123',
    diasRuta: 3,
    createdAt: new Date(),
  },
  {
    id: '3',
    fecha: new Date(Date.now() - 86400000),
    clienteId: '3',
    clienteNombre: 'Tienda Juanita',
    notaPedido: 'NP-002',
    deudaOriginal: 350,
    aCuenta: 350,
    saldoTotal: 0,
    vendedorId: '2',
    vendedor: 'María López',
    vehiculoPlaca: 'DEF-456',
    diasRuta: 2,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    fecha: new Date(Date.now() - 172800000),
    clienteId: '4',
    clienteNombre: 'Super Mayorista Norte',
    notaPedido: 'NP-004',
    deudaOriginal: 2500,
    aCuenta: 1000,
    saldoTotal: 1500,
    vendedorId: '3',
    vendedor: 'Pedro Sánchez',
    vehiculoPlaca: 'GHI-789',
    diasRuta: 5,
    createdAt: new Date(Date.now() - 172800000),
  },
];

const CollectionsPage = () => {
  const [cobranzas, setCobranzas] = useState<Collection[]>(mockCobranzas);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendedor, setFilterVendedor] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfWeek(new Date(), { locale: es }),
    to: endOfWeek(new Date(), { locale: es }),
  });
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  // Filtrar cobranzas
  const filteredCobranzas = cobranzas.filter(cobranza => {
    const matchesSearch = cobranza.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cobranza.notaPedido.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendedor = filterVendedor === 'all' || cobranza.vendedorId === filterVendedor;
    const matchesEstado = filterEstado === 'all' || 
                          (filterEstado === 'PAGADO' && cobranza.saldoTotal === 0) ||
                          (filterEstado === 'PARCIAL' && cobranza.saldoTotal > 0 && cobranza.aCuenta > 0) ||
                          (filterEstado === 'PENDIENTE' && cobranza.aCuenta === 0);
    const matchesDate = cobranza.fecha >= dateRange.from && cobranza.fecha <= dateRange.to;
    return matchesSearch && matchesVendedor && matchesEstado && matchesDate;
  });

  // KPIs
  const totalCobrado = filteredCobranzas.reduce((acc, c) => acc + c.aCuenta, 0);
  const totalPendiente = filteredCobranzas.reduce((acc, c) => acc + c.saldoTotal, 0);
  const totalDeuda = filteredCobranzas.reduce((acc, c) => acc + c.deudaOriginal, 0);
  const cobranzasCompletas = filteredCobranzas.filter(c => c.saldoTotal === 0).length;
  const cobranzasParciales = filteredCobranzas.filter(c => c.saldoTotal > 0 && c.aCuenta > 0).length;
  const clientesCobrados = new Set(filteredCobranzas.map(c => c.clienteId)).size;
  const efectividadCobranza = totalDeuda > 0 ? (totalCobrado / totalDeuda * 100).toFixed(1) : '0';

  const getEstadoBadge = (cobranza: Collection) => {
    if (cobranza.saldoTotal === 0) {
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Pagado</Badge>;
    } else if (cobranza.aCuenta > 0) {
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">Parcial</Badge>;
    }
    return <Badge className="bg-red-500/10 text-red-500 border-red-500/30">Pendiente</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Cobranzas</h1>
          <p className="text-muted-foreground">Reporte de cobranzas realizadas por carros-vendedores</p>
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
                Registrar Cobranza
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Cobranza</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Distribuidora El Sol</SelectItem>
                      <SelectItem value="2">Mayorista Central</SelectItem>
                      <SelectItem value="3">Tienda Juanita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>N° Nota de Pedido</Label>
                  <Input placeholder="NP-XXX" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Deuda</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>A Cuenta</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsNewDialogOpen(false)}>
                    Registrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <DollarSign className="h-5 w-5 text-emerald-500 mb-2" />
              <p className="text-xs text-muted-foreground">Total Cobrado</p>
              <p className="text-lg font-bold text-foreground">S/ {totalCobrado.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <Clock className="h-5 w-5 text-amber-500 mb-2" />
              <p className="text-xs text-muted-foreground">Pendiente</p>
              <p className="text-lg font-bold text-foreground">S/ {totalPendiente.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <DollarSign className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-xs text-muted-foreground">Deuda Total</p>
              <p className="text-lg font-bold text-foreground">S/ {totalDeuda.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <TrendingUp className="h-5 w-5 text-green-500 mb-2" />
              <p className="text-xs text-muted-foreground">Efectividad</p>
              <p className="text-lg font-bold text-foreground">{efectividadCobranza}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <Users className="h-5 w-5 text-purple-500 mb-2" />
              <p className="text-xs text-muted-foreground">Clientes</p>
              <p className="text-lg font-bold text-foreground">{clientesCobrados}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <DollarSign className="h-5 w-5 text-cyan-500 mb-2" />
              <p className="text-xs text-muted-foreground">Pagos Completos</p>
              <p className="text-lg font-bold text-foreground">{cobranzasCompletas}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <AlertTriangle className="h-5 w-5 text-orange-500 mb-2" />
              <p className="text-xs text-muted-foreground">Pagos Parciales</p>
              <p className="text-lg font-bold text-foreground">{cobranzasParciales}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o nota de pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterVendedor} onValueChange={setFilterVendedor}>
              <SelectTrigger>
                <SelectValue placeholder="Vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los vendedores</SelectItem>
                {mockVendedores.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PAGADO">Pagado</SelectItem>
                <SelectItem value="PARCIAL">Pago Parcial</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.from, 'dd/MM')} - {format(dateRange.to, 'dd/MM')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setDateRange({ from: new Date(), to: new Date() })}
                  >
                    Hoy
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setDateRange({ 
                      from: startOfWeek(new Date(), { locale: es }), 
                      to: endOfWeek(new Date(), { locale: es }) 
                    })}
                  >
                    Esta semana
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setDateRange({ 
                      from: startOfMonth(new Date()), 
                      to: endOfMonth(new Date()) 
                    })}
                  >
                    Este mes
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Cobranzas</TabsTrigger>
          <TabsTrigger value="vendedor">Por Vendedor</TabsTrigger>
          <TabsTrigger value="rutas">Por Días de Ruta</TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>N° Nota Pedido</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead className="text-right">Deuda</TableHead>
                    <TableHead className="text-right">A Cuenta</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCobranzas.map((cobranza) => (
                    <TableRow key={cobranza.id}>
                      <TableCell>{format(cobranza.fecha, 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="font-medium">{cobranza.clienteNombre}</TableCell>
                      <TableCell className="font-mono">{cobranza.notaPedido}</TableCell>
                      <TableCell>{cobranza.vendedor}</TableCell>
                      <TableCell className="text-right">S/ {cobranza.deudaOriginal.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">S/ {cobranza.aCuenta.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold">S/ {cobranza.saldoTotal.toLocaleString()}</TableCell>
                      <TableCell>{getEstadoBadge(cobranza)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendedor">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Cobranzas por Vendedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVendedores.map(vendedor => {
                  const cobranzasVendedor = filteredCobranzas.filter(c => c.vendedorId === vendedor.id);
                  const totalCobradoVendedor = cobranzasVendedor.reduce((acc, c) => acc + c.aCuenta, 0);
                  const totalPendienteVendedor = cobranzasVendedor.reduce((acc, c) => acc + c.saldoTotal, 0);
                  const clientesVendedor = new Set(cobranzasVendedor.map(c => c.clienteId)).size;
                  
                  return (
                    <Card key={vendedor.id} className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{vendedor.nombre}</p>
                              <p className="text-sm text-muted-foreground">{vendedor.placa}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Cobranzas</p>
                            <p className="font-bold">{cobranzasVendedor.length}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Clientes</p>
                            <p className="font-bold">{clientesVendedor}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Cobrado</p>
                            <p className="font-bold text-emerald-600">S/ {totalCobradoVendedor.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Pendiente</p>
                            <p className="font-bold text-amber-600">S/ {totalPendienteVendedor.toLocaleString()}</p>
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

        <TabsContent value="rutas">
          <Card>
            <CardHeader>
              <CardTitle>Cobranzas por Días de Ruta</CardTitle>
              <p className="text-sm text-muted-foreground">Los carros-vendedores realizan rutas de varios días</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead className="text-center">Días de Ruta</TableHead>
                    <TableHead className="text-right">Total Cobrado</TableHead>
                    <TableHead className="text-right">Pendiente</TableHead>
                    <TableHead className="text-right">Promedio/Día</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVendedores.map(vendedor => {
                    const cobranzasVendedor = filteredCobranzas.filter(c => c.vendedorId === vendedor.id);
                    const diasRuta = cobranzasVendedor.length > 0 ? cobranzasVendedor[0].diasRuta : 0;
                    const totalCobrado = cobranzasVendedor.reduce((acc, c) => acc + c.aCuenta, 0);
                    const totalPendiente = cobranzasVendedor.reduce((acc, c) => acc + c.saldoTotal, 0);
                    const promedioDia = diasRuta > 0 ? totalCobrado / diasRuta : 0;
                    
                    return (
                      <TableRow key={vendedor.id}>
                        <TableCell className="font-medium">{vendedor.nombre}</TableCell>
                        <TableCell>{vendedor.placa}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{diasRuta} días</Badge>
                        </TableCell>
                        <TableCell className="text-right text-emerald-600 font-bold">
                          S/ {totalCobrado.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-amber-600">
                          S/ {totalPendiente.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          S/ {promedioDia.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollectionsPage;
