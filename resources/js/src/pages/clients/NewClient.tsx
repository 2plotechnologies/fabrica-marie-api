import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Building2, Phone, Mail, MapPin, CreditCard, Save, ArrowLeft, Search, Navigation } from 'lucide-react';
import { mockRoutes } from '@/data/mockData';

// Mock address suggestions (simulating geocoding API)
const mockAddressSuggestions = [
  { address: 'Jr. Real 456, Huancayo, Junín', lat: -12.0651, lng: -75.2048 },
  { address: 'Av. Giráldez 123, Huancayo, Junín', lat: -12.0680, lng: -75.2100 },
  { address: 'Calle Ancash 789, El Tambo, Junín', lat: -12.0550, lng: -75.2200 },
  { address: 'Jr. Puno 321, Chilca, Junín', lat: -12.0750, lng: -75.1950 },
  { address: 'Av. Huancavelica 555, Huancayo, Junín', lat: -12.0620, lng: -75.2080 },
];

const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [docType, setDocType] = useState<'ruc' | 'dni'>('ruc');
  const [addressSearch, setAddressSearch] = useState('');
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState(mockAddressSuggestions);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    document: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    routeId: '',
    creditLimit: '',
  });

  useEffect(() => {
    if (addressSearch.length > 2) {
      const filtered = mockAddressSuggestions.filter(s => 
        s.address.toLowerCase().includes(addressSearch.toLowerCase())
      );
      setFilteredAddresses(filtered.length > 0 ? filtered : mockAddressSuggestions);
    }
  }, [addressSearch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressSelect = (suggestion: typeof mockAddressSuggestions[0]) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.address,
      latitude: suggestion.lat.toString(),
      longitude: suggestion.lng.toString(),
    }));
    setAddressSearch(suggestion.address);
    setShowAddressSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cliente registrado",
      description: `${formData.businessName} ha sido registrado exitosamente.`,
    });
    navigate('/clientes/lista');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Nuevo Cliente
          </h1>
          <p className="text-muted-foreground">
            Registra un nuevo cliente en el sistema
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Información del Negocio */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Información del Negocio
              </CardTitle>
              <CardDescription>
                Datos generales del establecimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del Negocio *</Label>
                <Input
                  id="businessName"
                  placeholder="Ej: Bodega Don Pedro"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Nombre del Propietario *</Label>
                <Input
                  id="ownerName"
                  placeholder="Ej: Pedro García"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo Doc.</Label>
                  <Select value={docType} onValueChange={(v: 'ruc' | 'dni') => setDocType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ruc">RUC</SelectItem>
                      <SelectItem value="dni">DNI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="document">
                    {docType === 'ruc' ? 'RUC' : 'DNI'} *
                  </Label>
                  <Input
                    id="document"
                    placeholder={docType === 'ruc' ? '20XXXXXXXXX' : 'XXXXXXXX'}
                    maxLength={docType === 'ruc' ? 11 : 8}
                    value={formData.document}
                    onChange={(e) => handleInputChange('document', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Datos para comunicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="987654321"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Popover open={showAddressSuggestions} onOpenChange={setShowAddressSuggestions}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="Buscar dirección..."
                        className="pl-10"
                        value={addressSearch}
                        onChange={(e) => {
                          setAddressSearch(e.target.value);
                          setShowAddressSuggestions(true);
                        }}
                        onFocus={() => setShowAddressSuggestions(true)}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar dirección..." value={addressSearch} onValueChange={setAddressSearch} />
                      <CommandList>
                        <CommandEmpty>No se encontraron direcciones</CommandEmpty>
                        <CommandGroup heading="Sugerencias">
                          {filteredAddresses.map((suggestion, idx) => (
                            <CommandItem 
                              key={idx} 
                              onSelect={() => handleAddressSelect(suggestion)}
                              className="cursor-pointer"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>{suggestion.address}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.address && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-primary" />
                      {formData.address}
                    </p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Lat: {formData.latitude}</span>
                      <span>Lng: {formData.longitude}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuración Comercial */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Configuración Comercial
              </CardTitle>
              <CardDescription>
                Asignación de ruta y límites de crédito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="route">Ruta Asignada</Label>
                  <Select 
                    value={formData.routeId} 
                    onValueChange={(v) => handleInputChange('routeId', v)}
                  >
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Seleccionar ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoutes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name} - {route.zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Límite de Crédito (S/)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    placeholder="5000"
                    min="0"
                    step="100"
                    value={formData.creditLimit}
                    onChange={(e) => handleInputChange('creditLimit', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-warm hover:opacity-90">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cliente
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewClient;
