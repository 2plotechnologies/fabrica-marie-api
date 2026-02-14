import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Package,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockStock, mockStockMovements } from '@/data/mockData';
import { cn } from '@/lib/utils';

const StockList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  const filteredStock = mockStock.filter(item => {
    const matchesSearch = 
      item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = !showLowStock || item.quantity < item.minStock;
    return matchesSearch && matchesLowStock;
  });

  const totalValue = mockStock.reduce((sum, item) => 
    sum + (item.quantity * (item.product?.price || 0)), 0
  );

  const lowStockCount = mockStock.filter(s => s.quantity < s.minStock).length;

  const getStockStatus = (quantity: number, minStock: number, maxStock: number) => {
    if (quantity < minStock) return { label: 'Bajo', color: 'text-destructive', bgColor: 'bg-destructive' };
    if (quantity < minStock * 1.5) return { label: 'Regular', color: 'text-warning', bgColor: 'bg-warning' };
    return { label: 'Óptimo', color: 'text-success', bgColor: 'bg-success' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Stock de Productos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona el inventario de tu almacén
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ArrowDownCircle className="h-4 w-4" />
            Entrada
          </Button>
          <Button variant="outline" className="gap-2">
            <ArrowUpCircle className="h-4 w-4" />
            Salida
          </Button>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Devolución
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Total Productos</p>
          <p className="text-2xl font-bold">{mockStock.length}</p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Unidades Totales</p>
          <p className="text-2xl font-bold">
            {mockStock.reduce((sum, s) => sum + s.quantity, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Bajo Mínimo</p>
          <p className={cn(
            "text-2xl font-bold",
            lowStockCount > 0 ? "text-destructive" : "text-success"
          )}>
            {lowStockCount}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Valor Inventario</p>
          <p className="text-2xl font-bold">
            S/ {totalValue.toLocaleString('es-PE')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showLowStock ? 'destructive' : 'outline'}
          onClick={() => setShowLowStock(!showLowStock)}
          className="gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          Stock Bajo ({lowStockCount})
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Ruma</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map((item, index) => {
                const status = getStockStatus(item.quantity, item.minStock, item.maxStock);
                const percentage = (item.quantity / item.maxStock) * 100;
                
                return (
                  <TableRow 
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${400 + index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.product?.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {item.product?.sku}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.rumaId}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className={cn("font-semibold", status.color)}>
                          {item.quantity}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          / {item.maxStock}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="space-y-1">
                        <Progress 
                          value={percentage} 
                          className={cn("h-2", `[&>div]:${status.bgColor}`)}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Mín: {item.minStock}</span>
                          <span>Máx: {item.maxStock}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          status.label === 'Bajo' && 'border-destructive/30 text-destructive bg-destructive/10',
                          status.label === 'Regular' && 'border-warning/30 text-warning bg-warning/10',
                          status.label === 'Óptimo' && 'border-success/30 text-success bg-success/10'
                        )}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        S/ {(item.quantity * (item.product?.price || 0)).toLocaleString('es-PE')}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-card rounded-xl border shadow-card p-5 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <h3 className="font-display text-lg font-semibold mb-4">Últimos Movimientos</h3>
        <div className="space-y-3">
          {mockStockMovements.map((movement, index) => (
            <div 
              key={movement.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 animate-fade-in"
              style={{ animationDelay: `${600 + index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  movement.type === 'ENTRADA' && 'bg-success/20',
                  movement.type === 'SALIDA' && 'bg-destructive/20',
                  movement.type === 'DEVOLUCION' && 'bg-warning/20'
                )}>
                  {movement.type === 'ENTRADA' && <ArrowDownCircle className="h-4 w-4 text-success" />}
                  {movement.type === 'SALIDA' && <ArrowUpCircle className="h-4 w-4 text-destructive" />}
                  {movement.type === 'DEVOLUCION' && <RotateCcw className="h-4 w-4 text-warning" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{movement.product?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {movement.type} • {movement.reference}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-semibold",
                  movement.type === 'ENTRADA' && 'text-success',
                  movement.type === 'SALIDA' && 'text-destructive',
                  movement.type === 'DEVOLUCION' && 'text-warning'
                )}>
                  {movement.type === 'SALIDA' ? '-' : '+'}{movement.quantity}
                </p>
                <p className="text-xs text-muted-foreground">
                  {movement.createdAt.toLocaleDateString('es-PE')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockList;
