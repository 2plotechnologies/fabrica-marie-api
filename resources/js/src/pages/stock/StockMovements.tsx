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
import { Search, ArrowUpCircle, ArrowDownCircle, RotateCcw, Settings2, Calendar, Filter } from 'lucide-react';
import { mockStockMovements } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StockMovements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredMovements = mockStockMovements.filter((movement) => {
    const matchesSearch = movement.product?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ENTRADA':
        return <ArrowDownCircle className="h-4 w-4 text-emerald-500" />;
      case 'SALIDA':
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
      case 'DEVOLUCION':
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      case 'AJUSTE':
        return <Settings2 className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      ENTRADA: { variant: 'default', label: 'Entrada' },
      SALIDA: { variant: 'destructive', label: 'Salida' },
      DEVOLUCION: { variant: 'secondary', label: 'Devolución' },
      AJUSTE: { variant: 'outline', label: 'Ajuste' },
    };
    const config = variants[type] || { variant: 'outline', label: type };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const stats = {
    entradas: mockStockMovements.filter(m => m.type === 'ENTRADA').reduce((acc, m) => acc + m.quantity, 0),
    salidas: mockStockMovements.filter(m => m.type === 'SALIDA').reduce((acc, m) => acc + m.quantity, 0),
    devoluciones: mockStockMovements.filter(m => m.type === 'DEVOLUCION').reduce((acc, m) => acc + m.quantity, 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Movimientos de Stock
          </h1>
          <p className="text-muted-foreground">
            Registro de entradas, salidas y ajustes de inventario
          </p>
        </div>
        <Button className="bg-gradient-warm hover:opacity-90">
          <ArrowDownCircle className="h-4 w-4 mr-2" />
          Registrar Movimiento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <ArrowDownCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entradas</p>
                <p className="text-2xl font-bold text-foreground">{stats.entradas}</p>
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
                <p className="text-sm text-muted-foreground">Salidas</p>
                <p className="text-2xl font-bold text-foreground">{stats.salidas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Devoluciones</p>
                <p className="text-2xl font-bold text-foreground">{stats.devoluciones}</p>
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
                placeholder="Buscar por producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="ENTRADA">Entradas</SelectItem>
                <SelectItem value="SALIDA">Salidas</SelectItem>
                <SelectItem value="DEVOLUCION">Devoluciones</SelectItem>
                <SelectItem value="AJUSTE">Ajustes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Historial de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-center">Stock Anterior</TableHead>
                <TableHead className="text-center">Stock Nuevo</TableHead>
                <TableHead>Referencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {format(movement.createdAt, "dd MMM yyyy, HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(movement.type)}
                      {getTypeBadge(movement.type)}
                    </div>
                  </TableCell>
                  <TableCell>{movement.product?.name}</TableCell>
                  <TableCell className="text-center font-semibold">
                    <span className={movement.type === 'SALIDA' ? 'text-red-500' : 'text-emerald-500'}>
                      {movement.type === 'SALIDA' ? '-' : '+'}{movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {movement.previousStock}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {movement.newStock}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {movement.reference}
                    </code>
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

export default StockMovements;
