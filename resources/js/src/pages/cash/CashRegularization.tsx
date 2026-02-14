import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileCheck, 
  Plus, 
  Search,
  CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CashRegularization {
  id: string;
  date: Date;
  originalClosing: number;
  realAmount: number;
  difference: number;
  type: 'SOBRANTE' | 'FALTANTE';
  reason: string;
  approvedBy?: string;
  status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  createdAt: Date;
  createdBy: string;
}

// Mock data
const mockRegularizations: CashRegularization[] = [
  {
    id: '1',
    date: new Date('2024-12-18'),
    originalClosing: 2850.50,
    realAmount: 2820.00,
    difference: -30.50,
    type: 'FALTANTE',
    reason: 'Error en vuelto a cliente, se identificó la diferencia',
    status: 'APROBADO',
    approvedBy: 'Juan Domínguez',
    createdAt: new Date('2024-12-18'),
    createdBy: 'María Fernández',
  },
  {
    id: '2',
    date: new Date('2024-12-17'),
    originalClosing: 3100.00,
    realAmount: 3125.00,
    difference: 25.00,
    type: 'SOBRANTE',
    reason: 'Cliente pagó de más y no se ubicó para devolución',
    status: 'APROBADO',
    approvedBy: 'Juan Domínguez',
    createdAt: new Date('2024-12-17'),
    createdBy: 'Carlos Pérez',
  },
  {
    id: '3',
    date: new Date('2024-12-16'),
    originalClosing: 2500.00,
    realAmount: 2450.00,
    difference: -50.00,
    type: 'FALTANTE',
    reason: 'Faltante por revisar grabaciones',
    status: 'PENDIENTE',
    createdAt: new Date('2024-12-16'),
    createdBy: 'María Fernández',
  },
];

const CashRegularization = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    originalClosing: '',
    realAmount: '',
    reason: '',
  });

  const filteredRegularizations = mockRegularizations.filter((reg) => {
    const matchesSearch = reg.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CashRegularization['status']) => {
    const variants: Record<CashRegularization['status'], { variant: 'default' | 'secondary' | 'destructive'; label: string; icon: React.ReactNode }> = {
      PENDIENTE: { variant: 'secondary', label: 'Pendiente', icon: <Clock className="h-3 w-3" /> },
      APROBADO: { variant: 'default', label: 'Aprobado', icon: <CheckCircle className="h-3 w-3" /> },
      RECHAZADO: { variant: 'destructive', label: 'Rechazado', icon: <AlertTriangle className="h-3 w-3" /> },
    };
    const { variant, label, icon } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon} {label}
      </Badge>
    );
  };

  const difference = formData.originalClosing && formData.realAmount
    ? parseFloat(formData.realAmount) - parseFloat(formData.originalClosing)
    : 0;

  const handleCreateRegularization = () => {
    if (!selectedDate || !formData.originalClosing || !formData.realAmount || !formData.reason) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Regularización creada",
      description: "La regularización ha sido enviada para aprobación.",
    });
    setIsAddDialogOpen(false);
    setFormData({ originalClosing: '', realAmount: '', reason: '' });
    setSelectedDate(undefined);
  };

  const stats = {
    pending: mockRegularizations.filter(r => r.status === 'PENDIENTE').length,
    totalFaltante: mockRegularizations
      .filter(r => r.type === 'FALTANTE' && r.status === 'APROBADO')
      .reduce((sum, r) => sum + Math.abs(r.difference), 0),
    totalSobrante: mockRegularizations
      .filter(r => r.type === 'SOBRANTE' && r.status === 'APROBADO')
      .reduce((sum, r) => sum + r.difference, 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Regularización de Caja
          </h1>
          <p className="text-muted-foreground">
            Cuadrar diferencias de cierres de días anteriores
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-warm hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Regularización
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Regularización</DialogTitle>
              <DialogDescription>
                Registra una diferencia encontrada en un cierre de caja anterior
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Fecha del Cierre</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cierre Original (S/)</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.originalClosing}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalClosing: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monto Real (S/)</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.realAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, realAmount: e.target.value }))}
                  />
                </div>
              </div>
              
              {formData.originalClosing && formData.realAmount && (
                <div className={cn(
                  "p-4 rounded-lg",
                  difference === 0 
                    ? "bg-emerald-50 dark:bg-emerald-900/20" 
                    : difference > 0 
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "bg-red-50 dark:bg-red-900/20"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Diferencia:</span>
                    <span className={cn(
                      "font-bold text-lg",
                      difference === 0 
                        ? "text-emerald-600" 
                        : difference > 0 
                          ? "text-blue-600"
                          : "text-red-600"
                    )}>
                      {difference > 0 ? '+' : ''} S/ {difference.toFixed(2)}
                    </span>
                  </div>
                  {difference !== 0 && (
                    <p className="text-sm mt-1">
                      {difference > 0 ? 'Sobrante' : 'Faltante'}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Motivo / Justificación</Label>
                <Textarea 
                  placeholder="Describe el motivo de la diferencia..."
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-gradient-warm hover:opacity-90" onClick={handleCreateRegularization}>
                Crear Regularización
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <ArrowDownCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Faltantes</p>
                <p className="text-2xl font-bold text-red-600">S/ {stats.totalFaltante.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ArrowUpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sobrantes</p>
                <p className="text-2xl font-bold text-blue-600">S/ {stats.totalSobrante.toFixed(2)}</p>
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
                placeholder="Buscar por motivo o responsable..."
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
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="APROBADO">Aprobado</SelectItem>
                <SelectItem value="RECHAZADO">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Regularizations Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Historial de Regularizaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Cierre Original</TableHead>
                <TableHead>Monto Real</TableHead>
                <TableHead>Diferencia</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegularizations.map((reg) => (
                <TableRow key={reg.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {format(reg.date, "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>S/ {reg.originalClosing.toFixed(2)}</TableCell>
                  <TableCell>S/ {reg.realAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-medium flex items-center gap-1",
                      reg.type === 'FALTANTE' ? "text-red-600" : "text-blue-600"
                    )}>
                      {reg.type === 'FALTANTE' ? (
                        <ArrowDownCircle className="h-4 w-4" />
                      ) : (
                        <ArrowUpCircle className="h-4 w-4" />
                      )}
                      S/ {Math.abs(reg.difference).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={reg.reason}>
                    {reg.reason}
                  </TableCell>
                  <TableCell>{getStatusBadge(reg.status)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{reg.createdBy}</p>
                      {reg.approvedBy && (
                        <p className="text-xs text-muted-foreground">
                          Aprobado: {reg.approvedBy}
                        </p>
                      )}
                    </div>
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

export default CashRegularization;
