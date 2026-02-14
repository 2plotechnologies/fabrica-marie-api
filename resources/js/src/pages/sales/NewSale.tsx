import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus,
  ShoppingCart,
  User,
  Package,
  Trash2,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProducts, mockClients } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const NewSale = () => {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [searchProduct, setSearchProduct] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<'CONTADO' | 'CREDITO'>('CONTADO');
  const [discount, setDiscount] = useState(0);

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const addToCart = (product: typeof mockProducts[0]) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }]);
    }
    
    toast.success(`${product.name} agregado al carrito`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  const selectedClientData = mockClients.find(c => c.id === selectedClient);

  const handleSubmit = () => {
    if (!selectedClient) {
      toast.error('Selecciona un cliente');
      return;
    }
    if (cart.length === 0) {
      toast.error('Agrega productos al carrito');
      return;
    }
    
    toast.success('Venta registrada exitosamente');
    setCart([]);
    setSelectedClient('');
    setDiscount(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Nueva Venta</h1>
        <p className="text-muted-foreground mt-1">
          Registra una venta en ruta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Client Selection */}
          <div className="bg-card rounded-xl border shadow-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Cliente</h3>
            </div>
            
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente..." />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{client.businessName}</span>
                      {client.status === 'MOROSO' && (
                        <Badge variant="destructive" className="ml-2 text-xs">Moroso</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedClientData && (
              <div className="mt-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deuda actual:</span>
                  <span className="font-medium">S/ {selectedClientData.currentDebt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Límite de crédito:</span>
                  <span className="font-medium">S/ {selectedClientData.creditLimit.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Product Search */}
          <div className="bg-card rounded-xl border shadow-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Productos</h3>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar producto..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-secondary/50 transition-colors animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                  onClick={() => addToCart(product)}
                >
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">S/ {product.price.toFixed(2)}</p>
                    <Button size="sm" variant="ghost" className="h-7 px-2 mt-1">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border shadow-card p-5 sticky top-20 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Carrito</h3>
              <Badge variant="secondary" className="ml-auto">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </Badge>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">El carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        S/ {item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-4" />

            {/* Payment Type */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Tipo de Pago</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentType === 'CONTADO' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setPaymentType('CONTADO')}
                >
                  <Banknote className="h-4 w-4" />
                  Contado
                </Button>
                <Button
                  variant={paymentType === 'CREDITO' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setPaymentType('CREDITO')}
                >
                  <CreditCard className="h-4 w-4" />
                  Crédito
                </Button>
              </div>
            </div>

            {/* Discount */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Descuento (S/)</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Descuento</span>
                  <span>-S/ {discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-display text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              variant="gradient" 
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={cart.length === 0 || !selectedClient}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Registrar Venta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSale;
