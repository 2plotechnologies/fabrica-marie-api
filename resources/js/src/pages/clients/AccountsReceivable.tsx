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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, CreditCard, DollarSign, AlertTriangle, Clock, Filter, CheckCircle } from 'lucide-react';
import { mockAccountsReceivable } from '@/data/mockData';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const AccountsReceivable = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentAmount, setPaymentAmount] = useState('');

  const filteredAccounts = mockAccountsReceivable.filter((account) => {
    const matchesSearch = account.client?.businessName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      PENDIENTE: { variant: 'secondary', label: 'Pendiente' },
      PARCIAL: { variant: 'outline', label: 'Parcial' },
      PAGADA: { variant: 'default', label: 'Pagada' },
      VENCIDA: { variant: 'destructive', label: 'Vencida' },
    };
    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDaysInfo = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date());
    if (days < 0) {
      return { text: `${Math.abs(days)} días vencido`, isOverdue: true };
    } else if (days === 0) {
      return { text: 'Vence hoy', isOverdue: false };
    } else {
      return { text: `${days} días restantes`, isOverdue: false };
    }
  };

  const handlePayment = () => {
    toast({
      title: "Pago registrado",
      description: `Se ha registrado un pago de S/ ${paymentAmount}`,
    });
    setPaymentAmount('');
  };

  const totalPending = mockAccountsReceivable
    .filter(a => a.status !== 'PAGADA')
    .reduce((acc, a) => acc + a.currentBalance, 0);

  const totalOverdue = mockAccountsReceivable
    .filter(a => a.status === 'VENCIDA')
    .reduce((acc, a) => acc + a.currentBalance, 0);

  const totalPartial = mockAccountsReceivable
    .filter(a => a.status === 'PARCIAL')
    .reduce((acc, a) => acc + a.currentBalance, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Cuentas por Cobrar
          </h1>
          <p className="text-muted-foreground">
            Gestión de deudas y cobranzas de clientes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total por Cobrar</p>
                <p className="text-2xl font-bold text-foreground">
                  S/ {totalPending.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencido</p>
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
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagos Parciales</p>
                <p className="text-2xl font-bold text-foreground">
                  S/ {totalPartial.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cuentas Activas</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockAccountsReceivable.filter(a => a.status !== 'PAGADA').length}
                </p>
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
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="PARCIAL">Parcial</SelectItem>
                <SelectItem value="VENCIDA">Vencida</SelectItem>
                <SelectItem value="PAGADA">Pagada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Listado de Cuentas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Monto Original</TableHead>
                <TableHead className="text-right">Saldo Actual</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => {
                const daysInfo = getDaysInfo(account.dueDate);
                return (
                  <TableRow key={account.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{account.client?.businessName}</p>
                        <p className="text-xs text-muted-foreground">
                          {account.client?.ownerName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      S/ {account.originalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      S/ {account.currentBalance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {format(account.dueDate, "dd MMM yyyy", { locale: es })}
                        </p>
                        <p className={`text-xs ${daysInfo.isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {daysInfo.text}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-gradient-warm hover:opacity-90">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Cobrar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Registrar Pago</DialogTitle>
                            <DialogDescription>
                              Cliente: {account.client?.businessName}
                              <br />
                              Saldo pendiente: S/ {account.currentBalance.toLocaleString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="amount">Monto a pagar (S/)</Label>
                              <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                max={account.currentBalance}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Método de Pago</Label>
                              <Select defaultValue="efectivo">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="efectivo">Efectivo</SelectItem>
                                  <SelectItem value="transferencia">Transferencia</SelectItem>
                                  <SelectItem value="yape">Yape</SelectItem>
                                  <SelectItem value="plin">Plin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancelar</Button>
                            <Button 
                              className="bg-gradient-warm hover:opacity-90"
                              onClick={handlePayment}
                            >
                              Confirmar Pago
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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

export default AccountsReceivable;
