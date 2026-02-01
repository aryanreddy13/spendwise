import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { t, language, setLanguage, detectedLanguage } = useLanguage();
  return { t, language, setLanguage, detectedLanguage };
};
