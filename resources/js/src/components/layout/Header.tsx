import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileMenuButton } from './Sidebar';
import { RoleSelector } from './RoleSelector';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <MobileMenuButton onClick={onMenuClick} />
        <div className="hidden md:block">
          <p className="text-sm text-muted-foreground capitalize">{currentDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Role Selector */}
        <div className="hidden md:block">
          <RoleSelector />
        </div>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9 w-48 lg:w-64 bg-secondary/50 border-transparent focus:border-primary"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="h-8 w-8 rounded-full bg-gradient-warm flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </Button>
      </div>
    </header>
  );
};
