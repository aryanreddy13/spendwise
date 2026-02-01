import { useTranslation } from '@/hooks/useTranslation';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-4 px-6 border-t border-border bg-muted/30">
      <p className="text-sm text-muted-foreground text-center">
        {t.footer.disclaimer}
      </p>
    </footer>
  );
};
