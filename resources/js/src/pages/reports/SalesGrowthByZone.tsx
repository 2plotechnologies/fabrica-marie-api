import { useState } from 'react';
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
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  MapPin,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Weight,
} from 'lucide-react';
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
  Legend,
  Cell,
  ComposedChart,
  Area,
} from 'recharts';

// Datos del Excel - Ventas brutas en kilos por zona
const salesByZoneData = {
  zonas: [
    { 
      name: 'Ayacucho', 
      data: [23000, 36000, 38000, 33000, 31000, 27000, 29000, 31000, 28500, 31000, 26000, 24000],
      annual: 357500 
    },
    { 
      name: 'Chupaca y Márgenes', 
      data: [2500, 2500, 3000, 3000, 3500, 3500, 4500, 3500, 3000, 3500, 3000, 2800],
      annual: 38300 
    },
    { 
      name: 'Huancayo Ciudad', 
      data: [29000, 31000, 31000, 31000, 30000, 32000, 35000, 33000, 32000, 31000, 29000, 24500],
      annual: 368500 
    },
    { 
      name: 'Huancavelica', 
      data: [4200, 2200, 6500, 4800, 6400, 6500, 8700, 6400, 6300, 6500, 6500, 4500],
      annual: 69500 
    },
    { 
      name: 'Lima', 
      data: [3000, 4500, 4300, 4300, 4100, 5400, 6300, 4200, 4300, 4200, 3500, 4300],
      annual: 52400 
    },
    { 
      name: 'Selva Central', 
      data: [6000, 10000, 12000, 10000, 8000, 10000, 12000, 10000, 10000, 6000, 6000, 6000],
      annual: 106000 
    },
    { 
      name: 'Cerro de Pasco', 
      data: [700, 800, 700, 1600, 2100, 2150, 2200, 2100, 800, 2100, 700, 2000],
      annual: 17950 
    },
    { 
      name: 'Selva Oriental', 
      data: [2200, 4200, 4300, 4800, 4300, 4120, 2200, 4300, 5300, 4200, 2200, 4300],
      annual: 46420 
    },
    { 
      name: 'Concepción y Jauja', 
      data: [650, 900, 1200, 850, 1100, 1350, 1450, 1100, 1200, 750, 950, 1100],
      annual: 12600 
    },
  ],
  months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};

// Calcular % de crecimiento mes a mes
const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Generar datos de crecimiento por zona
const growthByZoneData = salesByZoneData.zonas.map(zona => {
  const growth = zona.data.map((value, index) => {
    if (index === 0) return 0;
    return calculateGrowth(value, zona.data[index - 1]);
  });
  return {
    name: zona.name,
    growth,
    annual: zona.annual,
  };
});

// Datos para gráficos de líneas (todas las zonas)
const monthlyTrendData = salesByZoneData.months.map((month, index) => {
  const dataPoint: Record<string, string | number> = { month };
  salesByZoneData.zonas.forEach(zona => {
    dataPoint[zona.name] = zona.data[index];
  });
  dataPoint['Total'] = salesByZoneData.zonas.reduce((sum, zona) => sum + zona.data[index], 0);
  return dataPoint;
});

// Colores para cada zona
const zoneColors: Record<string, string> = {
  'Ayacucho': 'hsl(var(--primary))',
  'Chupaca y Márgenes': 'hsl(221, 83%, 53%)',
  'Huancayo Ciudad': 'hsl(142, 76%, 36%)',
  'Huancavelica': 'hsl(45, 93%, 47%)',
  'Lima': 'hsl(262, 83%, 58%)',
  'Selva Central': 'hsl(0, 72%, 51%)',
  'Cerro de Pasco': 'hsl(199, 89%, 48%)',
  'Selva Oriental': 'hsl(320, 60%, 50%)',
  'Concepción y Jauja': 'hsl(25, 95%, 53%)',
};

// Datos para el ranking de zonas
const zoneRanking = salesByZoneData.zonas
  .map(zona => ({
    name: zona.name,
    annual: zona.annual,
    avgMonthly: zona.annual / 12,
    maxMonth: Math.max(...zona.data),
    minMonth: Math.min(...zona.data),
  }))
  .sort((a, b) => b.annual - a.annual);

// Total general
const totalAnnual = salesByZoneData.zonas.reduce((sum, zona) => sum + zona.annual, 0);

const SalesGrowthByZone = () => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('ventas');

  const exportReport = (reportName: string) => {
    console.log(`Exportando reporte: ${reportName}`);
  };

  // Filtrar datos según zona seleccionada
  const filteredZones = selectedZone === 'all' 
    ? salesByZoneData.zonas 
    : salesByZoneData.zonas.filter(z => z.name === selectedZone);

  // Datos para gráfico de barras comparativo
  const barChartData = salesByZoneData.months.map((month, index) => {
    const dataPoint: Record<string, string | number> = { month };
    filteredZones.forEach(zona => {
      dataPoint[zona.name] = zona.data[index];
    });
    return dataPoint;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Weight className="h-6 w-6 text-primary" />
            Ventas Brutas en Kilos por Zona
          </h1>
          <p className="text-muted-foreground">
            Análisis de crecimiento mes a mes por cada zona
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-48">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Zona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Zonas</SelectItem>
              {salesByZoneData.zonas.map(zona => (
                <SelectItem key={zona.name} value={zona.name}>{zona.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportReport('ventas-zona')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">Total Anual</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {(totalAnnual / 1000).toFixed(0)}K kg
                </p>
              </div>
              <Weight className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Promedio Mensual</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {((totalAnnual / 12) / 1000).toFixed(0)}K kg
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Zonas Activas</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {salesByZoneData.zonas.length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-400">Mejor Mes</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  Julio
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
          <TabsTrigger value="ventas" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Ventas en Kilos
          </TabsTrigger>
          <TabsTrigger value="crecimiento" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            % Crecimiento
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ranking por Zona
          </TabsTrigger>
        </TabsList>

        {/* Ventas en Kilos Tab */}
        <TabsContent value="ventas" className="space-y-6">
          {/* Gráfico de Tendencia */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Tendencia de Ventas por Zona
                </CardTitle>
                <CardDescription>Evolución mensual en kilos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => exportReport('tendencia-zona')}>
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} kg`, '']}
                  />
                  <Legend />
                  {selectedZone === 'all' ? (
                    <>
                      <Line type="monotone" dataKey="Total" stroke="hsl(var(--primary))" strokeWidth={3} name="Total" />
                      <Line type="monotone" dataKey="Huancayo Ciudad" stroke={zoneColors['Huancayo Ciudad']} strokeWidth={2} />
                      <Line type="monotone" dataKey="Ayacucho" stroke={zoneColors['Ayacucho']} strokeWidth={2} />
                      <Line type="monotone" dataKey="Selva Central" stroke={zoneColors['Selva Central']} strokeWidth={2} />
                    </>
                  ) : (
                    <Line type="monotone" dataKey={selectedZone} stroke={zoneColors[selectedZone]} strokeWidth={3} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabla de Ventas */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-primary" />
                  Ventas Brutas en Kilos
                </CardTitle>
                <CardDescription>Detalle mensual por zona</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => exportReport('tabla-ventas')}>
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">Zona</TableHead>
                      {salesByZoneData.months.map(month => (
                        <TableHead key={month} className="text-right min-w-[80px]">{month}</TableHead>
                      ))}
                      <TableHead className="text-right font-bold min-w-[100px]">Anual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredZones.map((zona) => (
                      <TableRow key={zona.name}>
                        <TableCell className="font-medium sticky left-0 bg-background">{zona.name}</TableCell>
                        {zona.data.map((value, index) => (
                          <TableCell key={index} className="text-right">
                            {value.toLocaleString()}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-bold text-primary">
                          {zona.annual.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedZone === 'all' && (
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell className="sticky left-0 bg-muted/50">TOTAL</TableCell>
                        {salesByZoneData.months.map((_, index) => (
                          <TableCell key={index} className="text-right">
                            {salesByZoneData.zonas.reduce((sum, z) => sum + z.data[index], 0).toLocaleString()}
                          </TableCell>
                        ))}
                        <TableCell className="text-right text-primary">
                          {totalAnnual.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crecimiento Tab */}
        <TabsContent value="crecimiento" className="space-y-6">
          {/* Fórmula */}
          <Card className="shadow-card border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Fórmula de Crecimiento</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    ((Kilos del mes actual - Kilos del mes anterior) / Kilos del mes anterior) × 100 = % de crecimiento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Crecimiento */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Crecimiento Mensual por Zona
                </CardTitle>
                <CardDescription>Porcentaje de crecimiento mes a mes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => exportReport('crecimiento-zona')}>
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={salesByZoneData.months.map((month, index) => {
                  const dataPoint: Record<string, string | number> = { month };
                  growthByZoneData.forEach(zona => {
                    dataPoint[zona.name] = parseFloat(zona.growth[index].toFixed(2));
                  });
                  return dataPoint;
                })}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
                  />
                  <Legend />
                  {(selectedZone === 'all' ? ['Huancayo Ciudad', 'Ayacucho', 'Selva Central'] : [selectedZone]).map(zoneName => (
                    <Bar 
                      key={zoneName} 
                      dataKey={zoneName} 
                      fill={zoneColors[zoneName]} 
                      name={zoneName}
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabla de Crecimiento */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  % de Crecimiento de Ventas en Kilos
                </CardTitle>
                <CardDescription>Mes a mes por cada zona</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => exportReport('tabla-crecimiento')}>
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">Zona</TableHead>
                      {salesByZoneData.months.map(month => (
                        <TableHead key={month} className="text-right min-w-[70px]">{month}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {growthByZoneData
                      .filter(zona => selectedZone === 'all' || zona.name === selectedZone)
                      .map((zona) => (
                      <TableRow key={zona.name}>
                        <TableCell className="font-medium sticky left-0 bg-background">{zona.name}</TableCell>
                        {zona.growth.map((value, index) => (
                          <TableCell key={index} className="text-right">
                            <Badge 
                              variant={value > 0 ? 'default' : value < 0 ? 'destructive' : 'secondary'}
                              className={`text-xs ${value > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                            >
                              {value > 0 && '+'}
                              {value.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranking Tab */}
        <TabsContent value="ranking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras Ranking */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Ranking Anual por Zona
                </CardTitle>
                <CardDescription>Total de ventas en kilos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={zoneRanking} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="name" width={120} className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()} kg`, 'Total Anual']}
                    />
                    <Bar dataKey="annual" radius={[0, 4, 4, 0]}>
                      {zoneRanking.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index < 3 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} fillOpacity={index < 3 ? 1 : 0.5} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lista de Ranking */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Detalle por Zona
                </CardTitle>
                <CardDescription>Estadísticas anuales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zoneRanking.map((zona, index) => (
                    <div key={zona.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-amber-500' : 
                          index === 1 ? 'bg-slate-400' : 
                          index === 2 ? 'bg-amber-700' : 'bg-muted-foreground/50'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{zona.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Prom: {(zona.avgMonthly / 1000).toFixed(1)}K kg/mes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{(zona.annual / 1000).toFixed(1)}K kg</p>
                        <p className="text-xs text-muted-foreground">
                          Min: {(zona.minMonth / 1000).toFixed(1)}K | Max: {(zona.maxMonth / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participación de Mercado */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Participación por Zona
              </CardTitle>
              <CardDescription>Porcentaje del total anual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {zoneRanking.map((zona) => {
                  const percentage = ((zona.annual / totalAnnual) * 100).toFixed(1);
                  return (
                    <div key={zona.name} className="p-4 rounded-lg bg-muted/30 text-center">
                      <p className="text-2xl font-bold text-primary">{percentage}%</p>
                      <p className="text-sm text-muted-foreground truncate">{zona.name}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesGrowthByZone;
