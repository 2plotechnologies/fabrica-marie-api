import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Calendar,
  Truck,
  MapPin,
  Clock,
  Route,
  Fuel,
  AlertTriangle,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface TripReport {
  id: string;
  vehiclePlate: string;
  driverName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  totalDistance: number;
  totalTime: number; // minutes
  maxSpeed: number;
  avgSpeed: number;
  stops: number;
  fuelUsed: number;
  alerts: number;
}

const mockTripReports: TripReport[] = [
  {
    id: 'trip-001',
    vehiclePlate: 'ABC-123',
    driverName: 'Pedro García',
    date: new Date(),
    startTime: new Date(new Date().setHours(8, 0)),
    endTime: new Date(new Date().setHours(17, 30)),
    totalDistance: 156.5,
    totalTime: 570,
    maxSpeed: 85,
    avgSpeed: 35,
    stops: 24,
    fuelUsed: 18.5,
    alerts: 2,
  },
  {
    id: 'trip-002',
    vehiclePlate: 'XYZ-789',
    driverName: 'Luis Mendoza',
    date: new Date(),
    startTime: new Date(new Date().setHours(7, 30)),
    endTime: new Date(new Date().setHours(16, 0)),
    totalDistance: 132.8,
    totalTime: 510,
    maxSpeed: 72,
    avgSpeed: 32,
    stops: 18,
    fuelUsed: 15.2,
    alerts: 0,
  },
  {
    id: 'trip-003',
    vehiclePlate: 'DEF-456',
    driverName: 'Carlos Ramos',
    date: subDays(new Date(), 1),
    startTime: new Date(subDays(new Date(), 1).setHours(8, 30)),
    endTime: new Date(subDays(new Date(), 1).setHours(18, 0)),
    totalDistance: 178.2,
    totalTime: 570,
    maxSpeed: 90,
    avgSpeed: 38,
    stops: 28,
    fuelUsed: 21.3,
    alerts: 3,
  },
];

const GPSReports = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportType, setReportType] = useState('trips');

  const filteredReports = mockTripReports.filter(report => {
    const matchesVehicle = selectedVehicle === 'all' || report.vehiclePlate === selectedVehicle;
    const reportDate = format(report.date, 'yyyy-MM-dd');
    const matchesDate = reportDate >= dateFrom && reportDate <= dateTo;
    return matchesVehicle && matchesDate;
  });

  const totals = {
    distance: filteredReports.reduce((sum, r) => sum + r.totalDistance, 0),
    time: filteredReports.reduce((sum, r) => sum + r.totalTime, 0),
    fuel: filteredReports.reduce((sum, r) => sum + r.fuelUsed, 0),
    alerts: filteredReports.reduce((sum, r) => sum + r.alerts, 0),
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const vehicles = [...new Set(mockTripReports.map(r => r.vehiclePlate))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Reportes GPS
          </h1>
          <p className="text-muted-foreground">
            Análisis de recorridos y rendimiento de flota
          </p>
        </div>
        <Button className="bg-gradient-warm hover:opacity-90">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Route className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Distancia Total</p>
                <p className="text-2xl font-bold text-foreground">{totals.distance.toFixed(1)} km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Total</p>
                <p className="text-2xl font-bold text-foreground">{formatDuration(totals.time)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Fuel className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Combustible</p>
                <p className="text-2xl font-bold text-foreground">{totals.fuel.toFixed(1)} L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alertas</p>
                <p className="text-2xl font-bold text-destructive">{totals.alerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trips">Recorridos</SelectItem>
                  <SelectItem value="speed">Velocidad</SelectItem>
                  <SelectItem value="stops">Paradas</SelectItem>
                  <SelectItem value="fuel">Combustible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Vehículo</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los vehículos</SelectItem>
                  {vehicles.map(plate => (
                    <SelectItem key={plate} value={plate}>{plate}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Desde</Label>
              <Input 
                type="date" 
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label>Hasta</Label>
              <Input 
                type="date" 
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalle de Recorridos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Conductor</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Distancia</TableHead>
                <TableHead>Vel. Max/Prom</TableHead>
                <TableHead>Paradas</TableHead>
                <TableHead>Combustible</TableHead>
                <TableHead>Alertas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map(report => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell>
                    {format(report.date, "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{report.vehiclePlate}</span>
                    </div>
                  </TableCell>
                  <TableCell>{report.driverName}</TableCell>
                  <TableCell className="text-sm">
                    {format(report.startTime, "HH:mm")} - {format(report.endTime, "HH:mm")}
                    <br />
                    <span className="text-muted-foreground">
                      {formatDuration(report.totalTime)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {report.totalDistance.toFixed(1)} km
                  </TableCell>
                  <TableCell>
                    <span className={report.maxSpeed > 80 ? 'text-destructive' : ''}>
                      {report.maxSpeed}
                    </span>
                    <span className="text-muted-foreground"> / {report.avgSpeed} km/h</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {report.stops}
                    </div>
                  </TableCell>
                  <TableCell>
                    {report.fuelUsed.toFixed(1)} L
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {(report.totalDistance / report.fuelUsed).toFixed(1)} km/L
                    </span>
                  </TableCell>
                  <TableCell>
                    {report.alerts > 0 ? (
                      <Badge variant="destructive">{report.alerts}</Badge>
                    ) : (
                      <Badge variant="secondary">0</Badge>
                    )}
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

export default GPSReports;
