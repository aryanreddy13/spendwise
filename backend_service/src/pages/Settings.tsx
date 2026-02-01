import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Monitor, Moon, Sun, User, Bell, Shield, HelpCircle, Mail, CreditCard, Edit2, Check, X, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import type { LanguageCode } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { name, setName, logout } = useUser();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  // Notification preferences
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [overspendAlerts, setOverspendAlerts] = useState(true);
  const [subscriptionAlerts, setSubscriptionAlerts] = useState(true);

  const handleSaveName = () => {
    if (tempName.trim().length < 2 || !/^[A-Za-z\s]+$/.test(tempName)) {
      toast.error(t.onboarding.validationError);
      return;
    }
    setName(tempName.trim());
    setIsEditingName(false);
    toast.success(t.settings.nameUpdated);
  };

  const handleCancelEdit = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const handleLogout = () => {
    logout();
    toast.success(t.settings.loggedOut);
    setTimeout(() => navigate('/'), 500);
  };

  const handleDeleteAccount = () => {
    logout();
    toast.success(t.settings.accountDeleted);
    navigate('/');
  };

  // Generate FAQ items from translation
  const faqs = [1, 2, 3, 4, 5, 6, 7].map(i => ({
    question: t.settings.faqItems[`q${i}`],
    answer: t.settings.faqItems[`a${i}`]
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">{t.settings.title}</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Main Settings */}
        <div className="lg:col-span-2 space-y-6">

          {/* Account Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.settings.accountSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.common.profile}</Label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="icon" variant="outline" onClick={handleSaveName}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{name}</span>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingName(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      {t.common.edit}
                    </Button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.settings.email}</Label>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>user@example.com</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{t.settings.verified}</Badge>
                </div>
              </div>

              {/* Linked Accounts */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.settings.linkedAccounts}</Label>
                <div className="p-4 border rounded-lg border-dashed">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t.settings.bankConnections}</p>
                      <p className="text-xs text-muted-foreground">{t.settings.connectPrompt}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-3">{t.settings.comingSoon}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                {t.settings.preferences}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.settings.theme}</Label>
                <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        {t.settings.lightMode}
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        {t.settings.darkMode}
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        {t.settings.systemDefault}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.settings.languageSection}</Label>
                <Select value={language} onValueChange={(value: LanguageCode) => setLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t.languages.en}</SelectItem>
                    <SelectItem value="hi">{t.languages.hi}</SelectItem>
                    <SelectItem value="ta">{t.languages.ta}</SelectItem>
                    <SelectItem value="te">{t.languages.te}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{t.settings.languageNote}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t.settings.notifications}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t.settings.budgetAlerts}</p>
                  <p className="text-xs text-muted-foreground">{t.settings.budgetAlertsDesc}</p>
                </div>
                <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t.settings.overspendAlerts}</p>
                  <p className="text-xs text-muted-foreground">{t.settings.overspendAlertsDesc}</p>
                </div>
                <Switch checked={overspendAlerts} onCheckedChange={setOverspendAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t.settings.subAlerts}</p>
                  <p className="text-xs text-muted-foreground">{t.settings.subAlertsDesc}</p>
                </div>
                <Switch checked={subscriptionAlerts} onCheckedChange={setSubscriptionAlerts} />
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t.settings.faq}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-sm font-medium text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Privacy & Actions */}
        <div className="space-y-6">
          {/* Privacy & Security */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.settings.privacy}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium mb-1">{t.settings.dataUsage}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.settings.dataUsageDesc}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                  <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                    {t.settings.noSell}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300 leading-relaxed">
                    {t.settings.noSellDesc}
                  </p>
                </div>
                <Button variant="outline" className="w-full text-xs" size="sm">
                  {t.settings.requestDeletion}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button variant="secondary" onClick={handleLogout} className="w-full gap-2">
            <LogOut className="h-4 w-4" />
            {t.settings.logout}
          </Button>

          {/* Delete Account */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2 bg-red-100 text-red-600 hover:bg-red-200 border-none shadow-none dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                <Trash2 className="h-4 w-4" />
                {t.settings.deleteAccount}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.settings.deleteConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.settings.deleteConfirmDesc}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">{t.settings.deleteAccount}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Version Info */}
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">{t.app.name}</p>
            <p className="text-xs text-muted-foreground">{t.settings.version} 2.0.4 (Build 4521)</p>
            <p className="text-xs text-muted-foreground">{t.settings.copyright}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
