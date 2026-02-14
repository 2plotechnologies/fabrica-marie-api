import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  MessageSquare,
  Plus,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  User,
  History,
  Target,
  Star
} from 'lucide-react';

// Tipos para el CRM
interface ClientInteraction {
  id: string;
  clientId: string;
  type: 'LLAMADA' | 'VISITA' | 'MENSAJE' | 'VENTA' | 'COBRANZA' | 'RECLAMO';
  description: string;
  date: Date;
  userId: string;
  userName: string;
}

interface ClientTask {
  id: string;
  clientId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  assignedTo: string;
}

interface CRMClient {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  routeName: string;
  status: 'ACTIVO' | 'INACTIVO' | 'MOROSO';
  lastPurchaseDate: Date | null;
  purchasedToday: boolean;
  totalPurchases: number;
  averageTicket: number;
  purchaseFrequency: string;
  creditLimit: number;
  currentDebt: number;
  loyaltyPoints: number;
  lastInteraction: Date | null;
  interactionCount: number;
}

// Mock data para el CRM
const mockCRMClients: CRMClient[] = [
  {
    id: '1',
    businessName: 'Bodega El Sol',
    ownerName: 'María García',
    phone: '987654321',
    email: 'maria@bodegaelsol.com',
    address: 'Av. Los Pinos 234, San Juan',
    routeName: 'Ruta Norte A',
    status: 'ACTIVO',
    lastPurchaseDate: new Date(),
    purchasedToday: true,
    totalPurchases: 45,
    averageTicket: 350,
    purchaseFrequency: 'Semanal',
    creditLimit: 2000,
    currentDebt: 450,
    loyaltyPoints: 1250,
    lastInteraction: new Date(),
    interactionCount: 28
  },
  {
    id: '2',
    businessName: 'Minimarket La Esquina',
    ownerName: 'Carlos Mendoza',
    phone: '956123456',
    email: 'carlos@laesquina.com',
    address: 'Jr. Libertad 567, Miraflores',
    routeName: 'Ruta Centro',
    status: 'ACTIVO',
    lastPurchaseDate: new Date(Date.now() - 86400000 * 3),
    purchasedToday: false,
    totalPurchases: 32,
    averageTicket: 520,
    purchaseFrequency: 'Quincenal',
    creditLimit: 3000,
    currentDebt: 0,
    loyaltyPoints: 890,
    lastInteraction: new Date(Date.now() - 86400000 * 2),
    interactionCount: 15
  },
  {
    id: '3',
    businessName: 'Tienda Doña Rosa',
    ownerName: 'Rosa Quispe',
    phone: '912345678',
    address: 'Calle San Martín 123',
    routeName: 'Ruta Sur',
    status: 'ACTIVO',
    lastPurchaseDate: new Date(),
    purchasedToday: true,
    totalPurchases: 68,
    averageTicket: 280,
    purchaseFrequency: 'Diario',
    creditLimit: 1500,
    currentDebt: 200,
    loyaltyPoints: 2100,
    lastInteraction: new Date(),
    interactionCount: 42
  },
  {
    id: '4',
    businessName: 'Abarrotes San Pedro',
    ownerName: 'Pedro Vargas',
    phone: '945678912',
    email: 'pedro.vargas@email.com',
    address: 'Av. Túpac Amaru 890',
    routeName: 'Ruta Norte B',
    status: 'MOROSO',
    lastPurchaseDate: new Date(Date.now() - 86400000 * 15),
    purchasedToday: false,
    totalPurchases: 22,
    averageTicket: 410,
    purchaseFrequency: 'Mensual',
    creditLimit: 2500,
    currentDebt: 1800,
    loyaltyPoints: 450,
    lastInteraction: new Date(Date.now() - 86400000 * 5),
    interactionCount: 18
  },
  {
    id: '5',
    businessName: 'Market Express',
    ownerName: 'Luis Fernández',
    phone: '978451236',
    email: 'lfernandez@marketexpress.com',
    address: 'Av. Principal 456, Centro',
    routeName: 'Ruta Centro',
    status: 'ACTIVO',
    lastPurchaseDate: new Date(Date.now() - 86400000),
    purchasedToday: false,
    totalPurchases: 56,
    averageTicket: 680,
    purchaseFrequency: 'Semanal',
    creditLimit: 5000,
    currentDebt: 1200,
    loyaltyPoints: 1890,
    lastInteraction: new Date(Date.now() - 86400000),
    interactionCount: 35
  },
  {
    id: '6',
    businessName: 'Bodega Santa María',
    ownerName: 'Ana Ramírez',
    phone: '963852741',
    address: 'Jr. Comercio 321',
    routeName: 'Ruta Sur',
    status: 'ACTIVO',
    lastPurchaseDate: new Date(),
    purchasedToday: true,
    totalPurchases: 89,
    averageTicket: 320,
    purchaseFrequency: 'Diario',
    creditLimit: 3000,
    currentDebt: 500,
    loyaltyPoints: 3200,
    lastInteraction: new Date(),
    interactionCount: 56
  }
];

const mockInteractions: ClientInteraction[] = [
  { id: '1', clientId: '1', type: 'VENTA', description: 'Venta de 5 cajas de galletas surtidas', date: new Date(), userId: '1', userName: 'Juan Domínguez' },
  { id: '2', clientId: '1', type: 'LLAMADA', description: 'Seguimiento de pedido anterior', date: new Date(Date.now() - 86400000 * 2), userId: '1', userName: 'Juan Domínguez' },
  { id: '3', clientId: '1', type: 'VISITA', description: 'Visita comercial para presentar nuevos productos', date: new Date(Date.now() - 86400000 * 5), userId: '2', userName: 'María López' },
  { id: '4', clientId: '2', type: 'COBRANZA', description: 'Cobro de factura pendiente S/ 450', date: new Date(Date.now() - 86400000), userId: '1', userName: 'Juan Domínguez' },
  { id: '5', clientId: '3', type: 'VENTA', description: 'Pedido regular semanal', date: new Date(), userId: '2', userName: 'María López' },
];

const mockTasks: ClientTask[] = [
  { id: '1', clientId: '4', title: 'Cobrar deuda pendiente', description: 'Cliente tiene deuda de S/ 1,800 vencida hace 15 días', dueDate: new Date(Date.now() + 86400000), status: 'PENDIENTE', priority: 'ALTA', assignedTo: 'Juan Domínguez' },
  { id: '2', clientId: '2', title: 'Presentar promoción mensual', description: 'Ofrecer descuento del 10% en compras mayores a S/ 500', dueDate: new Date(Date.now() + 86400000 * 3), status: 'PENDIENTE', priority: 'MEDIA', assignedTo: 'María López' },
  { id: '3', clientId: '5', title: 'Renovar línea de crédito', description: 'Cliente solicita aumento de límite de crédito', dueDate: new Date(Date.now() + 86400000 * 7), status: 'EN_PROGRESO', priority: 'MEDIA', assignedTo: 'Carlos Ruiz' },
];

const ClientsCRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [purchaseFilter, setPurchaseFilter] = useState<'all' | 'today' | 'pending'>('all');
  const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);
  const [newNote, setNewNote] = useState('');
  const [newInteractionType, setNewInteractionType] = useState<string>('LLAMADA');

  const filteredClients = mockCRMClients.filter(client => {
    const matchesSearch = 
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    if (purchaseFilter === 'today') {
      return matchesSearch && client.purchasedToday;
    } else if (purchaseFilter === 'pending') {
      return matchesSearch && !client.purchasedToday;
    }
    return matchesSearch;
  });

  const stats = {
    totalClients: mockCRMClients.length,
    purchasedToday: mockCRMClients.filter(c => c.purchasedToday).length,
    pendingToday: mockCRMClients.filter(c => !c.purchasedToday).length,
    pendingTasks: mockTasks.filter(t => t.status !== 'COMPLETADA').length
  };

  const getClientInteractions = (clientId: string) => {
    return mockInteractions.filter(i => i.clientId === clientId);
  };

  const getClientTasks = (clientId: string) => {
    return mockTasks.filter(t => t.clientId === clientId);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'LLAMADA': return <Phone className="h-4 w-4" />;
      case 'VISITA': return <MapPin className="h-4 w-4" />;
      case 'MENSAJE': return <MessageSquare className="h-4 w-4" />;
      case 'VENTA': return <ShoppingCart className="h-4 w-4" />;
      case 'COBRANZA': return <Target className="h-4 w-4" />;
      case 'RECLAMO': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getInteractionBadgeClass = (type: string) => {
    switch (type) {
      case 'VENTA': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'COBRANZA': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'LLAMADA': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'VISITA': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'RECLAMO': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'ALTA': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'MEDIA': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'BAJA': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatShortDate = (date: Date | null) => {
    if (!date) return 'Sin compras';
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">CRM - Seguimiento de Clientes</h1>
          <p className="text-muted-foreground">Gestiona las relaciones y seguimiento comercial</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Interacción
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">En seguimiento activo</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Compraron Hoy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.purchasedToday}</div>
            <p className="text-xs text-green-600 dark:text-green-500">Clientes atendidos</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">Sin Compra Hoy</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.pendingToday}</div>
            <p className="text-xs text-amber-600 dark:text-amber-500">Pendientes de visitar</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Tareas Pendientes</CardTitle>
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.pendingTasks}</div>
            <p className="text-xs text-blue-600 dark:text-blue-500">Por completar</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, negocio o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={purchaseFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setPurchaseFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={purchaseFilter === 'today' ? 'default' : 'outline'}
                onClick={() => setPurchaseFilter('today')}
                size="sm"
                className={purchaseFilter === 'today' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Compraron Hoy
              </Button>
              <Button
                variant={purchaseFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setPurchaseFilter('pending')}
                size="sm"
                className={purchaseFilter === 'pending' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Sin Compra
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({filteredClients.length})</CardTitle>
          <CardDescription>Click en un cliente para ver detalles y gestionar interacciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead className="text-right">Ticket Prom.</TableHead>
                  <TableHead className="text-right">Puntos</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow 
                    key={client.id}
                    className={`cursor-pointer transition-colors ${
                      client.purchasedToday 
                        ? 'bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50 dark:hover:bg-green-900/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {client.purchasedToday ? (
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Compró</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-amber-500" />
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pendiente</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{client.businessName}</p>
                        <p className="text-sm text-muted-foreground">{client.ownerName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                        {client.email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{client.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.routeName}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      S/ {client.averageTicket.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{client.loyaltyPoints.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={client.purchasedToday ? 'text-green-600 dark:text-green-400 font-medium' : 'text-muted-foreground'}>
                        {formatShortDate(client.lastPurchaseDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); }}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); }}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedClient && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      {selectedClient.businessName}
                      {selectedClient.purchasedToday ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Compró Hoy
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Sin Compra Hoy
                        </Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription>{selectedClient.ownerName} • {selectedClient.routeName}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Client Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{selectedClient.totalPurchases}</p>
                  <p className="text-xs text-muted-foreground">Compras Totales</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">S/ {selectedClient.averageTicket}</p>
                  <p className="text-xs text-muted-foreground">Ticket Promedio</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{selectedClient.purchaseFrequency}</p>
                  <p className="text-xs text-muted-foreground">Frecuencia</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <p className="text-2xl font-bold text-foreground">{selectedClient.loyaltyPoints}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Puntos Fidelización</p>
                </div>
              </div>

              {/* Contact & Credit Info */}
              <div className="grid md:grid-cols-2 gap-4 py-4 border-y border-border">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Información de Contacto</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    {selectedClient.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedClient.address}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Información de Crédito</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Límite de Crédito:</span>
                      <span className="font-medium">S/ {selectedClient.creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deuda Actual:</span>
                      <span className={`font-medium ${selectedClient.currentDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        S/ {selectedClient.currentDebt.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Disponible:</span>
                      <span className="font-medium text-green-600">
                        S/ {(selectedClient.creditLimit - selectedClient.currentDebt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs for Interactions and Tasks */}
              <Tabs defaultValue="interactions" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="interactions">
                    <History className="h-4 w-4 mr-2" />
                    Historial
                  </TabsTrigger>
                  <TabsTrigger value="tasks">
                    <Target className="h-4 w-4 mr-2" />
                    Tareas
                  </TabsTrigger>
                  <TabsTrigger value="notes">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Nueva Nota
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="interactions" className="mt-4">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {getClientInteractions(selectedClient.id).length > 0 ? (
                      getClientInteractions(selectedClient.id).map((interaction) => (
                        <div key={interaction.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className={`p-2 rounded-full ${getInteractionBadgeClass(interaction.type)}`}>
                            {getInteractionIcon(interaction.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className={getInteractionBadgeClass(interaction.type)}>
                                {interaction.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(interaction.date)}</span>
                            </div>
                            <p className="text-sm mt-1">{interaction.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">Por: {interaction.userName}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No hay interacciones registradas</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="mt-4">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {getClientTasks(selectedClient.id).length > 0 ? (
                      getClientTasks(selectedClient.id).map((task) => (
                        <div key={task.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{task.title}</span>
                              <Badge className={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Vence: {formatShortDate(task.dueDate)}
                              </span>
                              <span>Asignado a: {task.assignedTo}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Completar</Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No hay tareas pendientes</p>
                    )}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Tarea
                  </Button>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tipo de Interacción</label>
                      <Select value={newInteractionType} onValueChange={setNewInteractionType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LLAMADA">Llamada</SelectItem>
                          <SelectItem value="VISITA">Visita</SelectItem>
                          <SelectItem value="MENSAJE">Mensaje</SelectItem>
                          <SelectItem value="VENTA">Venta</SelectItem>
                          <SelectItem value="COBRANZA">Cobranza</SelectItem>
                          <SelectItem value="RECLAMO">Reclamo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descripción</label>
                      <Textarea 
                        placeholder="Describe la interacción con el cliente..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Interacción
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsCRM;
