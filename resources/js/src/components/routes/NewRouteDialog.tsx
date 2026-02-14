import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Plus, Route } from 'lucide-react';
import { toast } from 'sonner';
import { mockUsers } from '@/data/mockData';

interface NewRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteCreated?: (route: any) => void;
}

const NewRouteDialog = ({ open, onOpenChange, onRouteCreated }: NewRouteDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    zone: '',
    description: '',
    assignedSellerId: '',
    estimatedClients: '',
    frequency: 'diaria',
  });

  const zones = [
    { id: 'Norte', label: 'Zona Norte', color: '#3b82f6' },
    { id: 'Sur', label: 'Zona Sur', color: '#22c55e' },
    { id: 'Centro', label: 'Zona Centro', color: '#f59e0b' },
    { id: 'Este', label: 'Zona Este', color: '#8b5cf6' },
    { id: 'Oeste', label: 'Zona Oeste', color: '#ec4899' },
  ];

  const frequencies = [
    { id: 'diaria', label: 'Diaria' },
    { id: 'semanal', label: 'Semanal' },
    { id: 'quincenal', label: 'Quincenal' },
    { id: 'mensual', label: 'Mensual' },
  ];

  const sellers = mockUsers.filter(u => u.role === 'VENDEDOR');

  const handleSubmit = () => {
    if (!formData.name || !formData.zone) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    const newRoute = {
      id: `route-${Date.now()}`,
      name: formData.name,
      zone: formData.zone,
      description: formData.description,
      assignedSellerId: formData.assignedSellerId || undefined,
      clientCount: parseInt(formData.estimatedClients) || 0,
      frequency: formData.frequency,
      status: 'ACTIVA' as const,
      createdAt: new Date().toISOString(),
    };

    onRouteCreated?.(newRoute);
    toast.success(`Ruta "${formData.name}" creada exitosamente`);
    
    // Reset form
    setFormData({
      name: '',
      zone: '',
      description: '',
      assignedSellerId: '',
      estimatedClients: '',
      frequency: 'diaria',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Nueva Ruta de Venta
          </DialogTitle>
          <DialogDescription>
            Crea una nueva ruta y asígnala a un vendedor para comenzar a gestionar clientes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="routeName">Nombre de la Ruta *</Label>
              <Input
                id="routeName"
                placeholder="Ej: Ruta Miraflores"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone">Zona *</Label>
              <Select
                value={formData.zone}
                onValueChange={(value) => setFormData(prev => ({ ...prev, zone: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona zona" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        {zone.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe los límites o características de la ruta..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seller">Vendedor Asignado</Label>
              <Select
                value={formData.assignedSellerId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, assignedSellerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.firstName} {seller.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frecuencia de Visita</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.id} value={freq.id}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedClients">Clientes Estimados</Label>
            <Input
              id="estimatedClients"
              type="number"
              placeholder="0"
              value={formData.estimatedClients}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedClients: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Número aproximado de clientes que se espera cubrir en esta ruta
            </p>
          </div>

          {formData.zone && (
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: zones.find(z => z.id === formData.zone)?.color + '20' }}
              >
                <MapPin 
                  className="h-5 w-5"
                  style={{ color: zones.find(z => z.id === formData.zone)?.color }}
                />
              </div>
              <div>
                <p className="font-medium">{formData.name || 'Nueva Ruta'}</p>
                <p className="text-sm text-muted-foreground">
                  {zones.find(z => z.id === formData.zone)?.label} • {frequencies.find(f => f.id === formData.frequency)?.label}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Ruta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRouteDialog;
