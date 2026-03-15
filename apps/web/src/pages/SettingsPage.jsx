
import React from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>{t('settings.notifications')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('settings.email_alerts')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.email_alerts_desc')}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('settings.daily_digest')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.daily_digest_desc')}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
