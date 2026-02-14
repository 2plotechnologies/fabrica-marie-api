import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Building2, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  Upload,
  Cookie,
} from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();
  const [companySettings, setCompanySettings] = useState({
    name: 'Fabricas Rey del Centro',
    ruc: '20123456789',
    address: 'Av. Industrial 456, Lima',
    phone: '01-4567890',
    email: 'contacto@fabricasrey.com',
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    payments: true,
    dailyReport: false,
    overdueDebts: true,
  });

  const handleSaveCompany = () => {
    toast({
      title: "Configuración guardada",
      description: "Los datos de la empresa han sido actualizados",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notificaciones actualizadas",
      description: "Las preferencias de notificación han sido guardadas",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Configuración
        </h1>
        <p className="text-muted-foreground">
          Administra la configuración general del sistema
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Apariencia</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>
                Datos generales de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-2xl bg-gradient-warm flex items-center justify-center">
                  <Cookie className="h-12 w-12 text-primary-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Cambiar Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG hasta 2MB
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC</Label>
                  <Input
                    id="ruc"
                    value={companySettings.ruc}
                    onChange={(e) => setCompanySettings({ ...companySettings, ruc: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-gradient-warm hover:opacity-90" onClick={handleSaveCompany}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Preferencias de Notificaciones
              </CardTitle>
              <CardDescription>
                Configura cómo y cuándo recibir alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Stock Bajo</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe alertas cuando un producto esté por debajo del mínimo
                    </p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevos Pedidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificación al recibir un nuevo pedido
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newOrders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newOrders: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pagos Recibidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Alerta cuando se registre un pago
                    </p>
                  </div>
                  <Switch
                    checked={notifications.payments}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, payments: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deudas Vencidas</Label>
                    <p className="text-sm text-muted-foreground">
                      Alerta diaria de cuentas por cobrar vencidas
                    </p>
                  </div>
                  <Switch
                    checked={notifications.overdueDebts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, overdueDebts: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reporte Diario</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe un resumen diario por correo
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dailyReport}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, dailyReport: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-gradient-warm hover:opacity-90" onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Preferencias
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Gestiona la seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cambiar Contraseña</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input type="password" placeholder="Contraseña actual" />
                    <Input type="password" placeholder="Nueva contraseña" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación de dos factores</Label>
                    <p className="text-sm text-muted-foreground">
                      Añade una capa extra de seguridad
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sesiones Activas</Label>
                    <p className="text-sm text-muted-foreground">
                      Gestiona los dispositivos conectados
                    </p>
                  </div>
                  <Button variant="outline">Ver Sesiones</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Apariencia
              </CardTitle>
              <CardDescription>
                Personaliza la apariencia del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecciona el tema de la interfaz
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-24 flex-col gap-2">
                      <div className="h-8 w-8 rounded-full bg-background border-2" />
                      <span>Claro</span>
                    </Button>
                    <Button variant="outline" className="flex-1 h-24 flex-col gap-2">
                      <div className="h-8 w-8 rounded-full bg-foreground" />
                      <span>Oscuro</span>
                    </Button>
                    <Button variant="outline" className="flex-1 h-24 flex-col gap-2 border-primary">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-background to-foreground" />
                      <span>Sistema</span>
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Formato de Fecha</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cómo se muestran las fechas en el sistema
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">DD/MM/YYYY</Button>
                    <Button variant="outline" className="flex-1">MM/DD/YYYY</Button>
                    <Button variant="outline" className="flex-1">YYYY-MM-DD</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
