import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  DollarSign,
  Lock,
  Unlock,
  TrendingUp,
  Calculator,
  AlertTriangle,
  Eye,
  CalendarDays,
  FileText,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock cash register data
const mockCashRegister = {
  id: '1',
  status: 'ABIERTA',
  openingBalance: 500.00,
  currentBalance: 2850.50,
  salesTotal: 2150.50,
  collectionsTotal: 800.00,
  expensesTotal: 600.00,
  openedAt: new Date(),
  openedBy: 'Juan Domínguez',
};

const mockRecentMovements = [
  { id: '1', type: 'INGRESO', category: 'Venta', amount: 135.00, description: 'Venta #001234', time: new Date() },
  { id: '2', type: 'INGRESO', category: 'Cobranza', amount: 250.00, description: 'Pago Bodega Don Pedro', time: new Date() },
  { id: '3', type: 'EGRESO', category: 'Gasto', amount: 50.00, description: 'Combustible', time: new Date() },
  { id: '4', type: 'INGRESO', category: 'Venta', amount: 85.00, description: 'Venta #001235', time: new Date() },
  { id: '5', type: 'EGRESO', category: 'Devolución', amount: 30.00, description: 'Devolución cliente', time: new Date() },
];

// Tipo para pendientes de caja
interface CashPending {
  id: string;
  fechaOrigen: Date;
  fechaCierre: Date;
  cajero: string;
  tipo: 'FALTANTE' | 'SOBRANTE' | 'DOCUMENTO' | 'VALE' | 'DEPOSITO_PENDIENTE';
  monto: number;
  descripcion: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'REGULARIZADO' | 'APROBADO';
  diasPendiente: number;
  referencia?: string;
  observaciones?: string;
  responsable?: string;
}

// Mock data para pendientes (algunos con meses de antigüedad)
const mockPendientes: CashPending[] = [
  {
    id: '1',
    fechaOrigen: new Date(Date.now() - 86400000 * 120), // 4 meses atrás
    fechaCierre: new Date(Date.now() - 86400000 * 120),
    cajero: 'Juan Domínguez',
    tipo: 'FALTANTE',
    monto: 150.00,
    descripcion: 'Diferencia en cierre de caja',
    estado: 'EN_PROCESO',
    diasPendiente: 120,
    referencia: 'CJ-2024-0234',
    observaciones: 'Vendedor indica que entregó billete de S/100 falso',
    responsable: 'Carlos Ruiz',
  },
  {
    id: '2',
    fechaOrigen: new Date(Date.now() - 86400000 * 90), // 3 meses atrás
    fechaCierre: new Date(Date.now() - 86400000 * 90),
    cajero: 'María López',
    tipo: 'VALE',
    monto: 80.00,
    descripcion: 'Vale de combustible sin liquidar',
    estado: 'PENDIENTE',
    diasPendiente: 90,
    referencia: 'VL-2024-0567',
    observaciones: 'Esperando factura de grifo',
  },
  {
    id: '3',
    fechaOrigen: new Date(Date.now() - 86400000 * 45), // 45 días atrás
    fechaCierre: new Date(Date.now() - 86400000 * 45),
    cajero: 'Pedro Sánchez',
    tipo: 'DEPOSITO_PENDIENTE',
    monto: 500.00,
    descripcion: 'Depósito banco sin confirmar',
    estado: 'EN_PROCESO',
    diasPendiente: 45,
    referencia: 'DEP-2024-0089',
    observaciones: 'Se envió voucher pero banco no confirma',
  },
  {
    id: '4',
    fechaOrigen: new Date(Date.now() - 86400000 * 30), // 30 días atrás
    fechaCierre: new Date(Date.now() - 86400000 * 30),
    cajero: 'Ana García',
    tipo: 'DOCUMENTO',
    monto: 250.00,
    descripcion: 'Factura de proveedor sin registrar',
    estado: 'PENDIENTE',
    diasPendiente: 30,
    referencia: 'DOC-2024-0123',
    observaciones: 'Pendiente aprobación de gerencia',
  },
  {
    id: '5',
    fechaOrigen: new Date(Date.now() - 86400000 * 7), // 7 días atrás
    fechaCierre: new Date(Date.now() - 86400000 * 7),
    cajero: 'Juan Domínguez',
    tipo: 'SOBRANTE',
    monto: 35.00,
    descripcion: 'Sobrante en cierre de caja',
    estado: 'PENDIENTE',
    diasPendiente: 7,
    referencia: 'CJ-2024-0456',
    observaciones: 'Revisando ventas del día para identificar origen',
  },
  {
    id: '6',
    fechaOrigen: new Date(Date.now() - 86400000 * 180), // 6 meses atrás
    fechaCierre: new Date(Date.now() - 86400000 * 180),
    cajero: 'Carlos Mendoza',
    tipo: 'FALTANTE',
    monto: 320.00,
    descripcion: 'Faltante en entrega de ruta',
    estado: 'EN_PROCESO',
    diasPendiente: 180,
    referencia: 'CJ-2024-0102',
    observaciones: 'Vendedor firmó acuerdo de descuento por planilla',
    responsable: 'Luis Torres',
  },
];

const CurrentCash = () => {
  const { toast } = useToast();
  const [isOpenCashDialog, setIsOpenCashDialog] = useState(false);
  const [isCloseCashDialog, setIsCloseCashDialog] = useState(false);
  const [isMovementDialog, setIsMovementDialog] = useState(false);
  const [movementType, setMovementType] = useState<'INGRESO' | 'EGRESO'>('INGRESO');
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingCount, setClosingCount] = useState('');

  const isOpen = mockCashRegister.status === 'ABIERTA';

  const handleOpenCash = () => {
    toast({
      title: "Caja abierta",
      description: `Caja abierta con S/ ${openingAmount} de saldo inicial`,
    });
    setIsOpenCashDialog(false);
  };

  const handleCloseCash = () => {
    const difference = parseFloat(closingCount || '0') - mockCashRegister.currentBalance;
    toast({
      title: "Caja cerrada",
      description: difference === 0 
        ? "Cierre cuadrado correctamente" 
        : `Diferencia de S/ ${Math.abs(difference).toFixed(2)} ${difference > 0 ? 'sobrante' : 'faltante'}`,
    });
    setIsCloseCashDialog(false);
  };

  const handleMovement = () => {
    toast({
      title: movementType === 'INGRESO' ? "Ingreso registrado" : "Egreso registrado",
      description: "El movimiento ha sido registrado correctamente",
    });
    setIsMovementDialog(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Caja Actual
          </h1>
          <p className="text-muted-foreground">
            Control y gestión de caja del día
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <>
              <Dialog open={isMovementDialog} onOpenChange={setIsMovementDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowDownCircle className="h-4 w-4 mr-2" />
                    Movimiento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Movimiento</DialogTitle>
                    <DialogDescription>
                      Ingresa los detalles del movimiento de caja
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Tipo de Movimiento</Label>
                      <Select 
                        value={movementType} 
                        onValueChange={(v: 'INGRESO' | 'EGRESO') => setMovementType(v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INGRESO">Ingreso</SelectItem>
                          <SelectItem value="EGRESO">Egreso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {movementType === 'INGRESO' ? (
                            <>
                              <SelectItem value="venta">Venta</SelectItem>
                              <SelectItem value="cobranza">Cobranza</SelectItem>
                              <SelectItem value="otro_ingreso">Otro Ingreso</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="gasto">Gasto Operativo</SelectItem>
                              <SelectItem value="combustible">Combustible</SelectItem>
                              <SelectItem value="devolucion">Devolución</SelectItem>
                              <SelectItem value="otro_egreso">Otro Egreso</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Monto (S/)</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea placeholder="Detalle del movimiento..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMovementDialog(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      className={movementType === 'INGRESO' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
                      onClick={handleMovement}
                    >
                      Registrar {movementType === 'INGRESO' ? 'Ingreso' : 'Egreso'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isCloseCashDialog} onOpenChange={setIsCloseCashDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Lock className="h-4 w-4 mr-2" />
                    Cerrar Caja
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cerrar Caja</DialogTitle>
                    <DialogDescription>
                      Realiza el conteo final y cierra la caja del día
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Saldo teórico:</span>
                        <span className="font-semibold">S/ {mockCashRegister.currentBalance.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Conteo Real (S/)</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={closingCount}
                        onChange={(e) => setClosingCount(e.target.value)}
                      />
                    </div>
                    {closingCount && (
                      <div className={`p-4 rounded-lg ${
                        parseFloat(closingCount) === mockCashRegister.currentBalance 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20' 
                          : 'bg-amber-50 dark:bg-amber-900/20'
                      }`}>
                        <div className="flex justify-between">
                          <span>Diferencia:</span>
                          <span className={`font-bold ${
                            parseFloat(closingCount) === mockCashRegister.currentBalance 
                              ? 'text-emerald-600' 
                              : 'text-amber-600'
                          }`}>
                            S/ {(parseFloat(closingCount) - mockCashRegister.currentBalance).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCloseCashDialog(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleCloseCash}>
                      Confirmar Cierre
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Dialog open={isOpenCashDialog} onOpenChange={setIsOpenCashDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-warm hover:opacity-90">
                  <Unlock className="h-4 w-4 mr-2" />
                  Abrir Caja
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Abrir Caja</DialogTitle>
                  <DialogDescription>
                    Ingresa el saldo inicial para abrir la caja
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Saldo Inicial (S/)</Label>
                    <Input 
                      type="number" 
                      placeholder="500.00"
                      value={openingAmount}
                      onChange={(e) => setOpeningAmount(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpenCashDialog(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-gradient-warm hover:opacity-90" onClick={handleOpenCash}>
                    Abrir Caja
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Status Card */}
      <Card className={`shadow-card ${isOpen ? 'border-emerald-200 dark:border-emerald-900/30' : 'border-gray-200'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                isOpen ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <Wallet className={`h-7 w-7 ${isOpen ? 'text-emerald-600' : 'text-gray-500'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Estado de Caja</h3>
                  <Badge variant={isOpen ? 'default' : 'secondary'}>
                    {isOpen ? 'Abierta' : 'Cerrada'}
                  </Badge>
                </div>
                {isOpen && (
                  <p className="text-sm text-muted-foreground">
                    Abierta por {mockCashRegister.openedBy} a las {format(mockCashRegister.openedAt, "HH:mm", { locale: es })}
                  </p>
                )}
              </div>
            </div>
            {isOpen && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Saldo Actual</p>
                <p className="text-3xl font-bold text-emerald-600">
                  S/ {mockCashRegister.currentBalance.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isOpen && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Apertura</p>
                    <p className="text-xl font-bold text-foreground">
                      S/ {mockCashRegister.openingBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ventas</p>
                    <p className="text-xl font-bold text-emerald-600">
                      S/ {mockCashRegister.salesTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cobranzas</p>
                    <p className="text-xl font-bold text-foreground">
                      S/ {mockCashRegister.collectionsTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <ArrowUpCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Egresos</p>
                    <p className="text-xl font-bold text-red-600">
                      S/ {mockCashRegister.expensesTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs para Movimientos y Pendientes */}
          <Tabs defaultValue="movimientos" className="space-y-4">
            <TabsList>
              <TabsTrigger value="movimientos" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Movimientos Recientes
              </TabsTrigger>
              <TabsTrigger value="pendientes" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Pendientes ({mockPendientes.filter(p => p.estado !== 'REGULARIZADO' && p.estado !== 'APROBADO').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movimientos">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Movimientos Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentMovements.map((movement) => (
                      <div 
                        key={movement.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            movement.type === 'INGRESO' 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {movement.type === 'INGRESO' 
                              ? <ArrowDownCircle className="h-5 w-5 text-emerald-600" />
                              : <ArrowUpCircle className="h-5 w-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{movement.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {movement.category} · {format(movement.time, "HH:mm")}
                            </p>
                          </div>
                        </div>
                        <p className={`font-bold ${
                          movement.type === 'INGRESO' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'INGRESO' ? '+' : '-'} S/ {movement.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pendientes">
              <div className="space-y-4">
                {/* KPIs de Pendientes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                    <CardContent className="pt-4">
                      <div className="flex flex-col">
                        <AlertTriangle className="h-5 w-5 text-red-500 mb-2" />
                        <p className="text-xs text-muted-foreground">Faltantes Pendientes</p>
                        <p className="text-lg font-bold text-red-500">
                          S/ {mockPendientes.filter(p => p.tipo === 'FALTANTE' && p.estado !== 'REGULARIZADO').reduce((acc, p) => acc + p.monto, 0).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                    <CardContent className="pt-4">
                      <div className="flex flex-col">
                        <FileText className="h-5 w-5 text-amber-500 mb-2" />
                        <p className="text-xs text-muted-foreground">Documentos/Vales</p>
                        <p className="text-lg font-bold text-amber-500">
                          S/ {mockPendientes.filter(p => (p.tipo === 'DOCUMENTO' || p.tipo === 'VALE') && p.estado !== 'REGULARIZADO').reduce((acc, p) => acc + p.monto, 0).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardContent className="pt-4">
                      <div className="flex flex-col">
                        <DollarSign className="h-5 w-5 text-blue-500 mb-2" />
                        <p className="text-xs text-muted-foreground">Depósitos Pendientes</p>
                        <p className="text-lg font-bold text-blue-500">
                          S/ {mockPendientes.filter(p => p.tipo === 'DEPOSITO_PENDIENTE' && p.estado !== 'REGULARIZADO').reduce((acc, p) => acc + p.monto, 0).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                    <CardContent className="pt-4">
                      <div className="flex flex-col">
                        <CalendarDays className="h-5 w-5 text-purple-500 mb-2" />
                        <p className="text-xs text-muted-foreground">Más Antiguo</p>
                        <p className="text-lg font-bold text-purple-500">
                          {Math.max(...mockPendientes.filter(p => p.estado !== 'REGULARIZADO').map(p => p.diasPendiente))} días
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabla de Pendientes */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Pendientes por Regularizar
                    </CardTitle>
                    <CardDescription>
                      Listado de pendientes en proceso de regularización - algunos pueden tener meses de antigüedad
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Referencia</TableHead>
                          <TableHead>Fecha Origen</TableHead>
                          <TableHead>Antigüedad</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Cajero/Responsable</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Observaciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPendientes
                          .filter(p => p.estado !== 'REGULARIZADO' && p.estado !== 'APROBADO')
                          .sort((a, b) => b.diasPendiente - a.diasPendiente)
                          .map((pendiente) => (
                          <TableRow key={pendiente.id} className={pendiente.diasPendiente > 90 ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
                            <TableCell className="font-mono text-sm">{pendiente.referencia}</TableCell>
                            <TableCell>{format(pendiente.fechaOrigen, 'dd/MM/yyyy')}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  pendiente.diasPendiente > 90 
                                    ? 'bg-red-500/10 text-red-500 border-red-500/30' 
                                    : pendiente.diasPendiente > 30 
                                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                      : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                                }
                              >
                                {pendiente.diasPendiente} días
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                pendiente.tipo === 'FALTANTE' ? 'bg-red-500/10 text-red-500' :
                                pendiente.tipo === 'SOBRANTE' ? 'bg-emerald-500/10 text-emerald-500' :
                                pendiente.tipo === 'VALE' ? 'bg-amber-500/10 text-amber-500' :
                                pendiente.tipo === 'DOCUMENTO' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-purple-500/10 text-purple-500'
                              }>
                                {pendiente.tipo === 'DEPOSITO_PENDIENTE' ? 'Depósito' : pendiente.tipo.charAt(0) + pendiente.tipo.slice(1).toLowerCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{pendiente.cajero}</p>
                                {pendiente.responsable && (
                                  <p className="text-xs text-muted-foreground">Resp: {pendiente.responsable}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                              <span className="text-sm">{pendiente.descripcion}</span>
                            </TableCell>
                            <TableCell className={`text-right font-bold ${
                              pendiente.tipo === 'FALTANTE' ? 'text-red-500' : 
                              pendiente.tipo === 'SOBRANTE' ? 'text-emerald-500' : ''
                            }`}>
                              S/ {pendiente.monto.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                pendiente.estado === 'PENDIENTE' ? 'bg-gray-500/10 text-gray-500' :
                                pendiente.estado === 'EN_PROCESO' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-emerald-500/10 text-emerald-500'
                              }>
                                {pendiente.estado === 'EN_PROCESO' ? 'En Proceso' : pendiente.estado}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <span className="text-xs text-muted-foreground">{pendiente.observaciones}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Resumen por Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Resumen por Tipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['FALTANTE', 'SOBRANTE', 'VALE', 'DOCUMENTO', 'DEPOSITO_PENDIENTE'].map(tipo => {
                          const pendientesTipo = mockPendientes.filter(p => p.tipo === tipo && p.estado !== 'REGULARIZADO');
                          const totalMonto = pendientesTipo.reduce((acc, p) => acc + p.monto, 0);
                          
                          if (pendientesTipo.length === 0) return null;
                          
                          const tipoLabels: Record<string, string> = {
                            'FALTANTE': 'Faltantes',
                            'SOBRANTE': 'Sobrantes',
                            'VALE': 'Vales',
                            'DOCUMENTO': 'Documentos',
                            'DEPOSITO_PENDIENTE': 'Depósitos',
                          };
                          
                          return (
                            <div key={tipo} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{tipoLabels[tipo]}</span>
                                <Badge variant="outline">{pendientesTipo.length}</Badge>
                              </div>
                              <p className={`font-bold ${tipo === 'FALTANTE' ? 'text-red-500' : tipo === 'SOBRANTE' ? 'text-emerald-500' : ''}`}>
                                S/ {totalMonto.toFixed(2)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Por Antigüedad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { label: 'Más de 90 días', min: 90, max: 999, color: 'text-red-500' },
                          { label: '30 - 90 días', min: 30, max: 90, color: 'text-amber-500' },
                          { label: 'Menos de 30 días', min: 0, max: 30, color: 'text-blue-500' },
                        ].map(rango => {
                          const pendientesRango = mockPendientes.filter(
                            p => p.diasPendiente >= rango.min && p.diasPendiente < rango.max && p.estado !== 'REGULARIZADO'
                          );
                          const totalMonto = pendientesRango.reduce((acc, p) => acc + p.monto, 0);
                          
                          return (
                            <div key={rango.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className={`font-medium ${rango.color}`}>{rango.label}</span>
                                <Badge variant="outline">{pendientesRango.length}</Badge>
                              </div>
                              <p className={`font-bold ${rango.color}`}>
                                S/ {totalMonto.toFixed(2)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default CurrentCash;
