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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, AlertTriangle, Phone, Ban, UserCheck, History, DollarSign } from 'lucide-react';
import { mockClients, mockAccountsReceivable } from '@/data/mockData';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const DelinquentClients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Get delinquent clients (status MOROSO or with overdue accounts)
  const delinquentClients = mockClients
    .filter(client => 
      client.status === 'MOROSO' || 
      mockAccountsReceivable.some(acc => 
        acc.clientId === client.id && acc.status === 'VENCIDA'
      )
    )
    .map(client => {
      const overdueAccounts = mockAccountsReceivable.filter(
        acc => acc.clientId === client.id && acc.status === 'VENCIDA'
      );
      const totalOverdue = overdueAccounts.reduce((acc, a) => acc + a.currentBalance, 0);
      const oldestOverdue = overdueAccounts.length > 0 
        ? Math.max(...overdueAccounts.map(a => differenceInDays(new Date(), a.dueDate)))
        : 0;
      
      return {
        ...client,
        overdueAmount: totalOverdue,
        overdueDays: oldestOverdue,
        overdueCount: overdueAccounts.length,
      };
    })
    .sort((a, b) => b.overdueAmount - a.overdueAmount);

  const filteredClients = delinquentClients.filter((client) =>
    client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOverdue = delinquentClients.reduce((acc, c) => acc + c.overdueAmount, 0);
  const avgDaysOverdue = delinquentClients.length > 0
    ? Math.round(delinquentClients.reduce((acc, c) => acc + c.overdueDays, 0) / delinquentClients.length)
    : 0;

  const getRiskLevel = (days: number) => {
    if (days > 60) return { label: 'Alto', variant: 'destructive' as const };
    if (days > 30) return { label: 'Medio', variant: 'secondary' as const };
    return { label: 'Bajo', variant: 'outline' as const };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Clientes Morosos
          </h1>
          <p className="text-muted-foreground">
            Gestión de clientes con deudas vencidas
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-400">
                Atención: {delinquentClients.length} clientes con deudas vencidas
              </h3>
              <p className="text-sm text-red-700 dark:text-red-500 mt-1">
                Total pendiente: <span className="font-bold">S/ {totalOverdue.toLocaleString()}</span>
                {' · '}
                Promedio de días vencidos: <span className="font-bold">{avgDaysOverdue} días</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Ban className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Morosos</p>
                <p className="text-2xl font-bold text-foreground">{delinquentClients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deuda Vencida</p>
                <p className="text-2xl font-bold text-red-600">
                  S/ {totalOverdue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Días Promedio</p>
                <p className="text-2xl font-bold text-foreground">{avgDaysOverdue} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente moroso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Lista de Morosos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Cuentas Vencidas</TableHead>
                <TableHead className="text-center">Días Vencido</TableHead>
                <TableHead>Riesgo</TableHead>
                <TableHead className="text-right">Deuda Vencida</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const risk = getRiskLevel(client.overdueDays);
                return (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{client.businessName}</p>
                        <p className="text-xs text-muted-foreground">{client.ownerName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{client.overdueCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-red-600">
                      {client.overdueDays} días
                    </TableCell>
                    <TableCell>
                      <Badge variant={risk.variant}>{risk.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      S/ {client.overdueAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              Contactar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Información de Contacto</DialogTitle>
                              <DialogDescription>
                                {client.businessName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Teléfono</p>
                                  <p className="font-medium">{client.phone}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Dirección</p>
                                  <p className="font-medium">{client.address}</p>
                                </div>
                              </div>
                              <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground mb-2">Resumen de Deuda</p>
                                <div className="flex justify-between text-lg">
                                  <span>Total vencido:</span>
                                  <span className="font-bold text-red-600">
                                    S/ {client.overdueAmount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="ghost">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DelinquentClients;
