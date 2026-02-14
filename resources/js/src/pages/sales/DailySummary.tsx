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
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  CalendarIcon, FileDown, Plus, DollarSign, TrendingUp, TrendingDown, 
  Truck, Search, Eye, Receipt, Wallet, ArrowDownCircle, ArrowUpCircle,
  Calculator, CheckCircle2, AlertCircle
} from 'lucide-react';

// Tipos basados en el Excel de Resumen de Ingresos y Egresos
interface Expense {
  id: string;
  descripcion: string;
  categoria: 'GERENCIA' | 'DISTRIBUCION' | 'PRODUCCION';
  monto: number;
}

interface DailySummary {
  id: string;
  fecha: Date;
  vendedorId: string;
  vendedor: string;
  vehiculoPlaca: string;
  
  // Ingresos
  contado: number;
  credito: number;
  cobranza: number;
  depositos: number;
  viaticos: number;
  
  // Egresos
  gastos: Expense[];
  totalGastos: number;
  
  // Resumen
  saldoEntregar: number;
  saldoEntregado: number;
  diferencia: number;
  
  estado: 'PENDIENTE' | 'ENTREGADO' | 'VERIFICADO';
  firma: boolean;
  createdAt: Date;
}

// Mock data
const mockVendedores = [
  { id: '1', nombre: 'Carlos Ruiz', placa: 'ABC-123' },
  { id: '2', nombre: 'María López', placa: 'DEF-456' },
  { id: '3', nombre: 'Pedro Sánchez', placa: 'GHI-789' },
];

const mockResumenes: DailySummary[] = [
  {
    id: '1',
    fecha: new Date(),
    vendedorId: '1',
    vendedor: 'Carlos Ruiz',
    vehiculoPlaca: 'ABC-123',
    contado: 5001.5,
    credito: 1200,
    cobranza: 800,
    depositos: 500,
    viaticos: 200,
    gastos: [
      { id: '1', descripcion: 'Almuerzo', categoria: 'DISTRIBUCION', monto: 16 },
      { id: '2', descripcion: 'Reparación de balanza', categoria: 'GERENCIA', monto: 100 },
      { id: '3', descripcion: 'Adelanto de módulo', categoria: 'GERENCIA', monto: 230 },
      { id: '4', descripcion: 'Petróleo', categoria: 'DISTRIBUCION', monto: 235 },
      { id: '5', descripcion: 'Viáticos Huancavelica', categoria: 'DISTRIBUCION', monto: 360.5 },
    ],
    totalGastos: 941.5,
    saldoEntregar: 4060,
    saldoEntregado: 4060,
    diferencia: 0,
    estado: 'VERIFICADO',
    firma: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    fecha: new Date(),
    vendedorId: '2',
    vendedor: 'María López',
    vehiculoPlaca: 'DEF-456',
    contado: 3500,
    credito: 800,
    cobranza: 600,
    depositos: 300,
    viaticos: 150,
    gastos: [
      { id: '1', descripcion: 'Almuerzo', categoria: 'DISTRIBUCION', monto: 15 },
      { id: '2', descripcion: 'Combustible', categoria: 'DISTRIBUCION', monto: 180 },
      { id: '3', descripcion: 'Peaje', categoria: 'DISTRIBUCION', monto: 25 },
    ],
    totalGastos: 220,
    saldoEntregar: 3280,
    saldoEntregado: 3280,
    diferencia: 0,
    estado: 'ENTREGADO',
    firma: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    fecha: new Date(Date.now() - 86400000),
    vendedorId: '3',
    vendedor: 'Pedro Sánchez',
    vehiculoPlaca: 'GHI-789',
    contado: 4200,
    credito: 1500,
    cobranza: 1000,
    depositos: 400,
    viaticos: 180,
    gastos: [
      { id: '1', descripcion: 'Almuerzo', categoria: 'DISTRIBUCION', monto: 18 },
      { id: '2', descripcion: 'Combustible', categoria: 'DISTRIBUCION', monto: 200 },
      { id: '3', descripcion: 'Reparación menor', categoria: 'GERENCIA', monto: 50 },
    ],
    totalGastos: 268,
    saldoEntregar: 3932,
    saldoEntregado: 3900,
    diferencia: -32,
    estado: 'VERIFICADO',
    firma: true,
    createdAt: new Date(Date.now() - 86400000),
  },
];

const DailySummaryPage = () => {
  const [resumenes, setResumenes] = useState<DailySummary[]>(mockResumenes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendedor, setFilterVendedor] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfWeek(new Date(), { locale: es }),
    to: endOfWeek(new Date(), { locale: es }),
  });
  const [selectedResumen, setSelectedResumen] = useState<DailySummary | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  // Filtrar resúmenes
  const filteredResumenes = resumenes.filter(resumen => {
    const matchesSearch = resumen.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resumen.vehiculoPlaca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendedor = filterVendedor === 'all' || resumen.vendedorId === filterVendedor;
    const matchesEstado = filterEstado === 'all' || resumen.estado === filterEstado;
    const matchesDate = resumen.fecha >= dateRange.from && resumen.fecha <= dateRange.to;
    return matchesSearch && matchesVendedor && matchesEstado && matchesDate;
  });

  // KPIs
  const totalContado = filteredResumenes.reduce((acc, r) => acc + r.contado, 0);
  const totalCredito = filteredResumenes.reduce((acc, r) => acc + r.credito, 0);
  const totalCobranza = filteredResumenes.reduce((acc, r) => acc + r.cobranza, 0);
  const totalDepositos = filteredResumenes.reduce((acc, r) => acc + r.depositos, 0);
  const totalGastos = filteredResumenes.reduce((acc, r) => acc + r.totalGastos, 0);
  const totalEntregado = filteredResumenes.reduce((acc, r) => acc + r.saldoEntregado, 0);
  const totalDiferencias = filteredResumenes.reduce((acc, r) => acc + r.diferencia, 0);
  const totalIngresos = totalContado + totalCobranza + totalDepositos;

  // Gastos por categoría
  const gastosPorCategoria = {
    GERENCIA: 0,
    DISTRIBUCION: 0,
    PRODUCCION: 0,
  };
  filteredResumenes.forEach(r => {
    r.gastos.forEach(g => {
      gastosPorCategoria[g.categoria] += g.monto;
    });
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">Pendiente</Badge>;
      case 'ENTREGADO':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Entregado</Badge>;
      case 'VERIFICADO':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Verificado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getCategoriaBadge = (categoria: string) => {
    switch (categoria) {
      case 'GERENCIA':
        return <Badge className="bg-purple-500/10 text-purple-500">G</Badge>;
      case 'DISTRIBUCION':
        return <Badge className="bg-blue-500/10 text-blue-500">D</Badge>;
      case 'PRODUCCION':
        return <Badge className="bg-amber-500/10 text-amber-500">P</Badge>;
      default:
        return <Badge variant="outline">{categoria}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Resumen de Ventas y Egresos</h1>
          <p className="text-muted-foreground">Reporte diario de ingresos y egresos por carro-vendedor</p>
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
                Nuevo Resumen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Resumen Diario</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(new Date(), 'PPP', { locale: es })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" locale={es} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Vendedor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVendedores.map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Ingresos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Contado</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cobranza</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Depósitos</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Gastos</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2">
                      <Input className="col-span-5" placeholder="Descripción" />
                      <Select>
                        <SelectTrigger className="col-span-4">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GERENCIA">Gerencia (G)</SelectItem>
                          <SelectItem value="DISTRIBUCION">Distribución (D)</SelectItem>
                          <SelectItem value="PRODUCCION">Producción (P)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input className="col-span-2" type="number" placeholder="0.00" />
                      <Button size="icon" className="col-span-1">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Saldo a Entregar</Label>
                    <Input type="number" placeholder="0.00" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Saldo Entregado</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsNewDialogOpen(false)}>
                    Guardar Resumen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Ingresos</p>
                <p className="text-xl font-bold text-foreground">S/ {totalIngresos.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <ArrowDownCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Gastos</p>
                <p className="text-xl font-bold text-foreground">S/ {totalGastos.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Entregado</p>
                <p className="text-xl font-bold text-foreground">S/ {totalEntregado.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-br ${totalDiferencias >= 0 ? 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20' : 'from-red-500/10 to-red-600/5 border-red-500/20'}`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${totalDiferencias >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                <Calculator className={`h-5 w-5 ${totalDiferencias >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Diferencia</p>
                <p className={`text-xl font-bold ${totalDiferencias >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  S/ {totalDiferencias.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs detallados */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Contado</p>
            <p className="text-lg font-bold text-emerald-600">S/ {totalContado.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Crédito</p>
            <p className="text-lg font-bold text-amber-600">S/ {totalCredito.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Cobranza</p>
            <p className="text-lg font-bold text-blue-600">S/ {totalCobranza.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Gastos Gerencia</p>
            <p className="text-lg font-bold text-purple-600">S/ {gastosPorCategoria.GERENCIA.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Gastos Distribución</p>
            <p className="text-lg font-bold text-blue-600">S/ {gastosPorCategoria.DISTRIBUCION.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Gastos Producción</p>
            <p className="text-lg font-bold text-amber-600">S/ {gastosPorCategoria.PRODUCCION.toLocaleString()}</p>
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
                placeholder="Buscar por vendedor o placa..."
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
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="ENTREGADO">Entregado</SelectItem>
                <SelectItem value="VERIFICADO">Verificado</SelectItem>
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

      {/* Tabla principal */}
      <Card>
        <CardHeader>
          <CardTitle>Resúmenes Diarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead className="text-right">Contado</TableHead>
                <TableHead className="text-right">Cobranza</TableHead>
                <TableHead className="text-right">Depósitos</TableHead>
                <TableHead className="text-right">Gastos</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-right">Diferencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResumenes.map((resumen) => (
                <TableRow key={resumen.id}>
                  <TableCell>{format(resumen.fecha, 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="font-medium">{resumen.vendedor}</TableCell>
                  <TableCell>{resumen.vehiculoPlaca}</TableCell>
                  <TableCell className="text-right text-emerald-600">S/ {resumen.contado.toLocaleString()}</TableCell>
                  <TableCell className="text-right">S/ {resumen.cobranza.toLocaleString()}</TableCell>
                  <TableCell className="text-right">S/ {resumen.depositos.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-red-600">S/ {resumen.totalGastos.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">S/ {resumen.saldoEntregado.toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-bold ${resumen.diferencia >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {resumen.diferencia >= 0 ? '+' : ''}{resumen.diferencia.toFixed(2)}
                  </TableCell>
                  <TableCell>{getEstadoBadge(resumen.estado)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedResumen(resumen)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de detalle */}
      <Dialog open={!!selectedResumen} onOpenChange={() => setSelectedResumen(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resumen de Ventas y Egresos</DialogTitle>
          </DialogHeader>
          
          {selectedResumen && (
            <div className="space-y-6 py-4">
              {/* Header del resumen */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">{format(selectedResumen.fecha, 'PPP', { locale: es })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendedor</p>
                  <p className="font-medium">{selectedResumen.vendedor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehículo</p>
                  <p className="font-medium">{selectedResumen.vehiculoPlaca}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  {getEstadoBadge(selectedResumen.estado)}
                </div>
              </div>

              {/* Ingresos y Gastos lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ingresos */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                      Ingresos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contado</span>
                      <span className="font-medium">S/ {selectedResumen.contado.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crédito</span>
                      <span className="font-medium">S/ {selectedResumen.credito.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cobranza</span>
                      <span className="font-medium">S/ {selectedResumen.cobranza.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Depósitos</span>
                      <span className="font-medium">S/ {selectedResumen.depositos.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Viáticos</span>
                      <span className="font-medium">S/ {selectedResumen.viaticos.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total Ingresos</span>
                      <span className="text-emerald-600">
                        S/ {(selectedResumen.contado + selectedResumen.cobranza + selectedResumen.depositos).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Gastos */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ArrowDownCircle className="h-4 w-4 text-red-500" />
                      Descripción de Gastos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedResumen.gastos.map((gasto) => (
                      <div key={gasto.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{gasto.descripcion}</span>
                          {getCategoriaBadge(gasto.categoria)}
                        </div>
                        <span className="font-medium">S/ {gasto.monto.toLocaleString()}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total Gastos</span>
                      <span className="text-red-600">S/ {selectedResumen.totalGastos.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumen final */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Saldo a Entregar</p>
                      <p className="text-2xl font-bold">S/ {selectedResumen.saldoEntregar.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Saldo Entregado</p>
                      <p className="text-2xl font-bold text-blue-600">S/ {selectedResumen.saldoEntregado.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Diferencia</p>
                      <p className={`text-2xl font-bold ${selectedResumen.diferencia >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {selectedResumen.diferencia >= 0 ? '+' : ''}S/ {selectedResumen.diferencia.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedResumen.firma && (
                    <div className="mt-6 pt-4 border-t flex items-center justify-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span>Firmado y verificado</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailySummaryPage;
