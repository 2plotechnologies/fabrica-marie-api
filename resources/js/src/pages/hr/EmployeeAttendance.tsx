import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  DollarSign,
  TrendingUp,
  Download,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { es } from 'date-fns/locale';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'PRESENTE' | 'AUSENTE' | 'TARDANZA' | 'PERMISO' | 'VACACIONES';
  hoursWorked: number;
}

interface EmployeeSalary {
  id: string;
  name: string;
  baseSalary: number;
  daysWorked: number;
  totalDays: number;
  tardanzas: number;
  ausencias: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
}

// Generate mock attendance data
const generateMockAttendance = (): AttendanceRecord[] => {
  const employees = [
    { id: 'emp-1', name: 'Pedro García' },
    { id: 'emp-2', name: 'Luis Mendoza' },
    { id: 'emp-3', name: 'María Fernández' },
    { id: 'emp-4', name: 'Carlos Ramos' },
  ];

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: today > monthEnd ? monthEnd : today });
  
  const records: AttendanceRecord[] = [];
  
  employees.forEach(emp => {
    days.forEach(day => {
      if (isWeekend(day)) return;
      
      const random = Math.random();
      let status: AttendanceRecord['status'] = 'PRESENTE';
      let checkIn: Date | undefined;
      let checkOut: Date | undefined;
      let hoursWorked = 8;
      
      if (random > 0.95) {
        status = 'AUSENTE';
        hoursWorked = 0;
      } else if (random > 0.9) {
        status = 'TARDANZA';
        checkIn = new Date(day.setHours(9, 30));
        checkOut = new Date(day.setHours(18, 0));
        hoursWorked = 7.5;
      } else if (random > 0.85) {
        status = 'PERMISO';
        hoursWorked = 0;
      } else {
        checkIn = new Date(day.setHours(8, 0));
        checkOut = new Date(day.setHours(17, 0));
      }
      
      records.push({
        id: `att-${emp.id}-${format(day, 'yyyy-MM-dd')}`,
        employeeId: emp.id,
        employeeName: emp.name,
        date: day,
        checkIn,
        checkOut,
        status,
        hoursWorked,
      });
    });
  });
  
  return records;
};

const mockAttendance = generateMockAttendance();

const mockSalaries: EmployeeSalary[] = [
  {
    id: 'emp-1',
    name: 'Pedro García',
    baseSalary: 2500,
    daysWorked: 22,
    totalDays: 24,
    tardanzas: 1,
    ausencias: 1,
    bonuses: 500,
    deductions: 120,
    netSalary: 2880,
  },
  {
    id: 'emp-2',
    name: 'Luis Mendoza',
    baseSalary: 2200,
    daysWorked: 24,
    totalDays: 24,
    tardanzas: 0,
    ausencias: 0,
    bonuses: 200,
    deductions: 0,
    netSalary: 2400,
  },
  {
    id: 'emp-3',
    name: 'María Fernández',
    baseSalary: 1800,
    daysWorked: 23,
    totalDays: 24,
    tardanzas: 2,
    ausencias: 0,
    bonuses: 150,
    deductions: 60,
    netSalary: 1890,
  },
  {
    id: 'emp-4',
    name: 'Carlos Ramos',
    baseSalary: 2000,
    daysWorked: 21,
    totalDays: 24,
    tardanzas: 1,
    ausencias: 2,
    bonuses: 0,
    deductions: 250,
    netSalary: 1750,
  },
];

const EmployeeAttendance = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [viewMode, setViewMode] = useState<'attendance' | 'salary'>('attendance');

  const filteredAttendance = mockAttendance.filter(record => 
    selectedEmployee === 'all' || record.employeeId === selectedEmployee
  );

  const employees = [...new Set(mockAttendance.map(r => ({ id: r.employeeId, name: r.employeeName })))];
  const uniqueEmployees = employees.filter((emp, index, self) => 
    index === self.findIndex(e => e.id === emp.id)
  );

  const stats = {
    totalPresent: filteredAttendance.filter(r => r.status === 'PRESENTE').length,
    totalAbsent: filteredAttendance.filter(r => r.status === 'AUSENTE').length,
    totalLate: filteredAttendance.filter(r => r.status === 'TARDANZA').length,
    totalHours: filteredAttendance.reduce((sum, r) => sum + r.hoursWorked, 0),
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const styles = {
      PRESENTE: { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
      AUSENTE: { className: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
      TARDANZA: { className: 'bg-warning/10 text-warning border-warning/20', icon: AlertCircle },
      PERMISO: { className: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Calendar },
      VACACIONES: { className: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Calendar },
    };
    const style = styles[status];
    const Icon = style.icon;
    return (
      <Badge variant="outline" className={style.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Asistencia y Salarios
          </h1>
          <p className="text-muted-foreground">
            Control de asistencia y cálculo de salarios mensuales
          </p>
        </div>
        <Button className="bg-gradient-warm hover:opacity-90">
          <Download className="h-4 w-4 mr-2" />
          Exportar Planilla
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Asistencias</p>
                <p className="text-2xl font-bold text-success">{stats.totalPresent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ausencias</p>
                <p className="text-2xl font-bold text-destructive">{stats.totalAbsent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tardanzas</p>
                <p className="text-2xl font-bold text-warning">{stats.totalLate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horas Totales</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle & Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'attendance' ? 'default' : 'outline'}
                onClick={() => setViewMode('attendance')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Asistencia
              </Button>
              <Button
                variant={viewMode === 'salary' ? 'default' : 'outline'}
                onClick={() => setViewMode('salary')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Salarios del Mes
              </Button>
            </div>
            
            {viewMode === 'attendance' && (
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Filtrar por empleado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los empleados</SelectItem>
                  {uniqueEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'attendance' ? (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Registro de Asistencia - {format(new Date(), 'MMMM yyyy', { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.slice(-20).reverse().map(record => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(record.employeeName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{record.employeeName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(record.date, "dd/MM/yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      {record.checkIn ? format(record.checkIn, "HH:mm") : '-'}
                    </TableCell>
                    <TableCell>
                      {record.checkOut ? format(record.checkOut, "HH:mm") : '-'}
                    </TableCell>
                    <TableCell>{record.hoursWorked}h</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Proyección de Salarios - {format(new Date(), 'MMMM yyyy', { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Salario Base</TableHead>
                  <TableHead>Días Trabajados</TableHead>
                  <TableHead>Tardanzas</TableHead>
                  <TableHead>Ausencias</TableHead>
                  <TableHead>Bonos</TableHead>
                  <TableHead>Descuentos</TableHead>
                  <TableHead className="text-right">Salario Neto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSalaries.map(salary => (
                  <TableRow key={salary.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(salary.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{salary.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>S/ {salary.baseSalary.toLocaleString('es-PE')}</TableCell>
                    <TableCell>
                      {salary.daysWorked}/{salary.totalDays}
                      <div className="w-16 bg-muted rounded-full h-1.5 mt-1">
                        <div 
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(salary.daysWorked / salary.totalDays) * 100}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {salary.tardanzas > 0 ? (
                        <Badge variant="outline" className="bg-warning/10 text-warning">
                          {salary.tardanzas}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {salary.ausencias > 0 ? (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive">
                          {salary.ausencias}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-success">
                      +S/ {salary.bonuses.toLocaleString('es-PE')}
                    </TableCell>
                    <TableCell className="text-destructive">
                      -S/ {salary.deductions.toLocaleString('es-PE')}
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      S/ {salary.netSalary.toLocaleString('es-PE')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Total */}
            <div className="mt-4 pt-4 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Planilla</p>
                <p className="text-2xl font-bold text-primary">
                  S/ {mockSalaries.reduce((sum, s) => sum + s.netSalary, 0).toLocaleString('es-PE')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeAttendance;
