import { Construction, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ComingSoon = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').filter(Boolean).join(' / ') || 'Esta página';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="h-20 w-20 rounded-2xl bg-gradient-warm flex items-center justify-center mb-6 shadow-glow animate-pulse-glow">
        <Construction className="h-10 w-10 text-primary-foreground" />
      </div>
      
      <h1 className="text-2xl lg:text-3xl font-display font-bold text-center mb-2">
        Próximamente
      </h1>
      
      <p className="text-muted-foreground text-center max-w-md mb-6">
        <span className="capitalize">{pageName}</span> está en desarrollo. 
        Pronto tendrás acceso a esta funcionalidad.
      </p>
      
      <Button asChild variant="outline" className="gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>
      </Button>
    </div>
  );
};

export default ComingSoon;
