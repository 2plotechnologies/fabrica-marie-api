import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield } from 'lucide-react';

const roleStyles: Record<UserRole, { bg: string; text: string; border: string; hoverBg: string }> = {
  ADMIN: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700', hoverBg: 'hover:bg-red-700' },
  GERENTE: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700', hoverBg: 'hover:bg-purple-700' },
  SUPERVISOR: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700', hoverBg: 'hover:bg-blue-700' },
  VENDEDOR: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700', hoverBg: 'hover:bg-emerald-700' },
  ALMACENERO: { bg: 'bg-amber-500', text: 'text-black', border: 'border-amber-600', hoverBg: 'hover:bg-amber-600' },
  CAJERO: { bg: 'bg-cyan-600', text: 'text-white', border: 'border-cyan-700', hoverBg: 'hover:bg-cyan-700' },
  RRHH: { bg: 'bg-pink-600', text: 'text-white', border: 'border-pink-700', hoverBg: 'hover:bg-pink-700' },
  FIDELIZACION: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600', hoverBg: 'hover:bg-orange-600' },
  MANTENIMIENTO: { bg: 'bg-slate-600', text: 'text-white', border: 'border-slate-700', hoverBg: 'hover:bg-slate-700' },
};

export const RoleSelector = () => {
  const { currentRole, setCurrentRole, roleLabels } = useRole();
  const roles = Object.keys(roleLabels) as UserRole[];
  const currentStyle = roleStyles[currentRole];

  return (
    <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border/50">
      <Shield className="h-4 w-4 text-muted-foreground" />
      <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as UserRole)}>
        <SelectTrigger 
          className={`w-[150px] h-8 text-xs font-semibold border-2 rounded-md shadow-sm ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} ${currentStyle.hoverBg} transition-colors`}
        >
          <SelectValue placeholder="Seleccionar rol" />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border shadow-lg z-50">
          {roles.map((role) => {
            const style = roleStyles[role];
            return (
              <SelectItem 
                key={role} 
                value={role} 
                className="text-xs cursor-pointer focus:bg-accent"
              >
                <span className={`inline-flex items-center px-3 py-1 rounded-md font-semibold ${style.bg} ${style.text}`}>
                  {roleLabels[role]}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
