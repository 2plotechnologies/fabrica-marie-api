import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download,
  Calendar,
  Users,
  Package,
  Wallet,
  MapPin,
  Truck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Weight,
} from 'lucide-react';
import { 
  mockDashboardKPIs, 
  mockSales, 
  mockClients, 
  mockProducts, 
  mockRoutes,
  mockUsers,
  mockStock,
} from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Datos extendidos para reportes
const salesByMonth = [
  { month: 'Jul', ventas: 85000, cobranzas: 72000, meta: 80000 },
  { month: 'Ago', ventas: 92000, cobranzas: 85000, meta: 85000 },
  { month: 'Sep', ventas: 78000, cobranzas: 75000, meta: 90000 },
  { month: 'Oct', ventas: 105000, cobranzas: 98000, meta: 95000 },
  { month: 'Nov', ventas: 118000, cobranzas: 110000, meta: 100000 },
  { month: 'Dic', ventas: 125680, cobranzas: 115000, meta: 110000 },
];

const salesByRoute = [
  { name: 'Ruta Norte', ventas: 45000, clientes: 25, visitas: 120 },
  { name: 'Ruta Sur', ventas: 52000, clientes: 30, visitas: 145 },
  { name: 'Ruta Centro', ventas: 38000, clientes: 18, visitas: 85 },
];

const productPerformance = [
  { name: 'Galletas Premium', unidades: 850, ingresos: 7225, margen: 35 },
  { name: 'Chocolate', unidades: 720, ingresos: 6480, margen: 32 },
  { name: 'Integrales', unidades: 580, ingresos: 4350, margen: 40 },
  { name: 'Rellenas', unidades: 450, ingresos: 4500, margen: 28 },
  { name: 'Mantequilla', unidades: 620, ingresos: 4030, margen: 38 },
];

const sellerPerformance = [
  { id: 'seller-1', nombre: 'Juan Pérez', ventas: 45200, cobros: 38500, clientes: 25, efectividad: 92 },
  { id: 'seller-2', nombre: 'Ana García', ventas: 52800, cobros: 48200, clientes: 30, efectividad: 88 },
  { id: 'seller-3', nombre: 'Carlos Ruiz', ventas: 38600, cobros: 35100, clientes: 18, efectividad: 85 },
];

const clientsByStatus = [
  { name: 'Activos', value: 65, color: '#10b981' },
  { name: 'Morosos', value: 8, color: '#ef4444' },
];

const dailySales = [
  { dia: 'Lun', ventas: 4200, transacciones: 15 },
  { dia: 'Mar', ventas: 5100, transacciones: 18 },
  { dia: 'Mie', ventas: 4800, transacciones: 16 },
  { dia: 'Jue', ventas: 5500, transacciones: 20 },
  { dia: 'Vie', ventas: 6200, transacciones: 22 },
  { dia: 'Sab', ventas: 3800, transacciones: 12 },
];

const topClients = [
  { nombre: 'Supermercado La Familia', ventas: 12500, frecuencia: 8 },
  { nombre: 'Bodega Don Pedro', ventas: 8200, frecuencia: 12 },
  { nombre: 'Minimarket El Sol', ventas: 6800, frecuencia: 10 },
  { nombre: 'Bodega Los Ángeles', ventas: 5400, frecuencia: 6 },
  { nombre: 'Tienda Central', ventas: 4200, frecuencia: 8 },
];

const ReportsMain = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('ventas');

  const kpis = mockDashboardKPIs;

  const exportReport = (reportName: string) => {
    // Simulación de exportación
    console.log(`Exportando reporte: ${reportName}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Centro de Reportes
          </h1>
          <p className="text-muted-foreground">
            Análisis completo del negocio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportReport('general')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Acceso rápido a reporte de crecimiento por zona */}
      <Card className="shadow-card border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/reportes/crecimiento-zonas')}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Weight className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ventas Brutas en Kilos por Zona</h3>
                <p className="text-sm text-muted-foreground">% de crecimiento de ventas mes a mes por cada zona</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Ver Reporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">Ventas del Mes</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  S/ {(kpis.sales.month / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="flex items-center text-emerald-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Cobranzas</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  S/ {((kpis.collections.today * 30) / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="flex items-center text-blue-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-400">Por Cobrar</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  S/ {(kpis.collections.pending / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="flex items-center text-red-600">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm font-medium">-5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Clientes Activos</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {kpis.clients.active}
                </p>
              </div>
              <div className="flex items-center text-emerald-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="ventas" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Ventas
          </TabsTrigger>
          <TabsTrigger value="cobranzas" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Cobranzas
          </TabsTrigger>
          <TabsTrigger value="productos" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="vendedores" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Vendedores
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Clientes
          </TabsTrigger>
        </TabsList>

        {/* Ventas Tab */}
        <TabsContent value="ventas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Ventas vs Meta Mensual
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => exportReport('ventas-mensual')}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `S/ ${value.toLocaleString()}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      name="Ventas"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meta" 
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Meta"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Ventas por Día (Semana Actual)
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => exportReport('ventas-diario')}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dia" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'ventas' ? `S/ ${value.toLocaleString()}` : value,
                        name === 'ventas' ? 'Ventas' : 'Transacciones'
                      ]}
                    />
                    <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Ventas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Route */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Ventas por Ruta
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => exportReport('ventas-ruta')}>
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ruta</TableHead>
                    <TableHead className="text-right">Ventas</TableHead>
                    <TableHead className="text-right">Clientes</TableHead>
                    <TableHead className="text-right">Visitas</TableHead>
                    <TableHead className="text-right">Ticket Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesByRoute.map((route) => (
                    <TableRow key={route.name}>
                      <TableCell className="font-medium">{route.name}</TableCell>
                      <TableCell className="text-right font-bold">S/ {route.ventas.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{route.clientes}</TableCell>
                      <TableCell className="text-right">{route.visitas}</TableCell>
                      <TableCell className="text-right">S/ {(route.ventas / route.visitas).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">S/ {salesByRoute.reduce((a, b) => a + b.ventas, 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{salesByRoute.reduce((a, b) => a + b.clientes, 0)}</TableCell>
                    <TableCell className="text-right">{salesByRoute.reduce((a, b) => a + b.visitas, 0)}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cobranzas Tab */}
        <TabsContent value="cobranzas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Ventas vs Cobranzas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `S/ ${value.toLocaleString()}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.4}
                      name="Ventas"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cobranzas" 
                      stroke="hsl(142, 76%, 36%)"
                      fill="hsl(142, 76%, 36%)"
                      fillOpacity={0.4}
                      name="Cobranzas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Resumen de Cartera</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Cobrado este mes</p>
                    <p className="text-2xl font-bold text-emerald-600">S/ 115,000</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendiente por cobrar</p>
                    <p className="text-2xl font-bold text-amber-600">S/ {kpis.collections.pending.toLocaleString()}</p>
                  </div>
                  <Wallet className="h-8 w-8 text-amber-600" />
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Vencido</p>
                    <p className="text-2xl font-bold text-red-600">S/ {kpis.collections.overdue.toLocaleString()}</p>
                  </div>
                  <Badge variant="destructive">Urgente</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Productos Tab */}
        <TabsContent value="productos" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Rendimiento de Productos
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => exportReport('productos')}>
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Unidades Vendidas</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-right">Margen %</TableHead>
                    <TableHead className="text-right">Stock Actual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product, index) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.unidades.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold">S/ {product.ingresos.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.margen >= 35 ? 'default' : 'secondary'}>
                          {product.margen}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {mockStock[index]?.quantity || 0} und
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Unidades Vendidas por Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-muted-foreground" />
                    <YAxis dataKey="name" type="category" width={120} className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="unidades" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Ingresos por Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `S/ ${value.toLocaleString()}`}
                    />
                    <Bar dataKey="ingresos" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vendedores Tab */}
        <TabsContent value="vendedores" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Ranking de Vendedores
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => exportReport('vendedores')}>
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead className="text-right">Ventas</TableHead>
                    <TableHead className="text-right">Cobros</TableHead>
                    <TableHead className="text-right">Clientes</TableHead>
                    <TableHead className="text-right">Efectividad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellerPerformance
                    .sort((a, b) => b.ventas - a.ventas)
                    .map((seller, index) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <Badge variant={index === 0 ? 'default' : 'outline'}>
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{seller.nombre}</TableCell>
                      <TableCell className="text-right font-bold">S/ {seller.ventas.toLocaleString()}</TableCell>
                      <TableCell className="text-right">S/ {seller.cobros.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{seller.clientes}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={seller.efectividad >= 90 ? 'default' : seller.efectividad >= 80 ? 'secondary' : 'destructive'}>
                          {seller.efectividad}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clientes Tab */}
        <TabsContent value="clientes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Distribución de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={clientsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {clientsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top 5 Clientes por Ventas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topClients.map((client, index) => (
                  <div key={client.nombre} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? 'default' : 'outline'}>{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{client.nombre}</p>
                        <p className="text-xs text-muted-foreground">{client.frecuencia} compras/mes</p>
                      </div>
                    </div>
                    <p className="font-bold">S/ {client.ventas.toLocaleString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsMain;
