import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  RefreshCw,
  Signal,
  Activity,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock GPS Data - simulating external API
interface GPSDevice {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  status: 'ACTIVO' | 'INACTIVO' | 'SIN_SEÑAL';
  lastUpdate: Date;
  batteryLevel: number;
  address?: string;
}

const mockGPSDevices: GPSDevice[] = [
  {
    id: 'gps-001',
    vehicleId: 'v-1',
    vehiclePlate: 'ABC-123',
    driverName: 'Pedro García',
    latitude: -12.0651,
    longitude: -75.2048,
    speed: 35,
    heading: 180,
    status: 'ACTIVO',
    lastUpdate: new Date(),
    batteryLevel: 85,
    address: 'Jr. Real 456, Huancayo',
  },
  {
    id: 'gps-002',
    vehicleId: 'v-2',
    vehiclePlate: 'XYZ-789',
    driverName: 'Luis Mendoza',
    latitude: -12.0700,
    longitude: -75.2100,
    speed: 0,
    heading: 90,
    status: 'ACTIVO',
    lastUpdate: new Date(Date.now() - 300000),
    batteryLevel: 62,
    address: 'Av. Ferrocarril 789, Huancayo',
  },
  {
    id: 'gps-003',
    vehicleId: 'v-3',
    vehiclePlate: 'DEF-456',
    driverName: 'Carlos Ramos',
    latitude: -12.0580,
    longitude: -75.1980,
    speed: 45,
    heading: 270,
    status: 'ACTIVO',
    lastUpdate: new Date(Date.now() - 60000),
    batteryLevel: 91,
    address: 'Calle Puno 123, El Tambo',
  },
  {
    id: 'gps-004',
    vehicleId: 'v-4',
    vehiclePlate: 'GHI-321',
    driverName: 'Miguel Torres',
    latitude: -12.0750,
    longitude: -75.2200,
    speed: 0,
    heading: 0,
    status: 'SIN_SEÑAL',
    lastUpdate: new Date(Date.now() - 3600000),
    batteryLevel: 15,
    address: 'Última ubicación: Chilca',
  },
];

const GPSTracking = () => {
  const [devices, setDevices] = useState<GPSDevice[]>(mockGPSDevices);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simular actualización de datos GPS
  const refreshData = async () => {
    setIsRefreshing(true);
    // Simular llamada a API externa
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDevices(prev => prev.map(device => ({
      ...device,
      speed: device.status === 'ACTIVO' ? Math.floor(Math.random() * 60) : 0,
      lastUpdate: device.status !== 'SIN_SEÑAL' ? new Date() : device.lastUpdate,
    })));
    
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Auto-refresh cada 30 segundos
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredDevices = selectedDevice === 'all' 
    ? devices 
    : devices.filter(d => d.id === selectedDevice);

  const stats = {
    total: devices.length,
    active: devices.filter(d => d.status === 'ACTIVO').length,
    moving: devices.filter(d => d.speed > 0).length,
    offline: devices.filter(d => d.status === 'SIN_SEÑAL').length,
  };

  const getStatusBadge = (status: GPSDevice['status']) => {
    const styles = {
      ACTIVO: { variant: 'default' as const, className: 'bg-success', icon: CheckCircle },
      INACTIVO: { variant: 'secondary' as const, className: '', icon: Clock },
      SIN_SEÑAL: { variant: 'destructive' as const, className: '', icon: AlertTriangle },
    };
    const style = styles[status];
    const Icon = style.icon;
    return (
      <Badge variant={style.variant} className={style.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Seguimiento GPS
          </h1>
          <p className="text-muted-foreground">
            Monitoreo en tiempo real de vehículos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Última actualización: {format(lastRefresh, 'HH:mm:ss', { locale: es })}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Dispositivos</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Signal className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-success">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Movimiento</p>
                <p className="text-2xl font-bold text-blue-600">{stats.moving}</p>
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
                <p className="text-sm text-muted-foreground">Sin Señal</p>
                <p className="text-2xl font-bold text-destructive">{stats.offline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los vehículos</SelectItem>
                {devices.map(device => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.vehiclePlate} - {device.driverName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Ubicación de Vehículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead>Conductor</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Velocidad</TableHead>
                <TableHead>Batería</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actualización</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map(device => (
                <TableRow key={device.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{device.vehiclePlate}</span>
                    </div>
                  </TableCell>
                  <TableCell>{device.driverName}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-sm truncate">{device.address}</p>
                      <p className="text-xs text-muted-foreground">
                        {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className={device.speed > 0 ? 'text-blue-600 font-medium' : ''}>
                        {device.speed} km/h
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className={`h-full rounded-full ${
                            device.batteryLevel > 50 ? 'bg-success' : 
                            device.batteryLevel > 20 ? 'bg-warning' : 'bg-destructive'
                          }`}
                          style={{ width: `${device.batteryLevel}%` }}
                        />
                      </div>
                      <span className="text-sm">{device.batteryLevel}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(device.lastUpdate, "dd/MM HH:mm:ss", { locale: es })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* API Info */}
      <Card className="shadow-card border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Signal className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">API GPS Externa</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Este módulo está preparado para conectarse a un proveedor de GPS externo. 
                Los datos actuales son simulados. Configure la API en Configuración → Integraciones.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPSTracking;
