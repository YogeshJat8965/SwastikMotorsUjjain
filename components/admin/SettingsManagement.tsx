'use client';

import { useState, useEffect } from 'react';
import { Phone, Instagram, Bell, Save, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

interface Settings {
  whatsappNumber: string;
  instagramHandle: string;
  businessName: string;
  businessAddress: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: '+919876543210',
    instagramHandle: '@swastik_bikes',
    businessName: 'Swastik Bikes',
    businessAddress: 'Ujjain, Madhya Pradesh',
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your business settings and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Business Information</h2>
            
            <div className="space-y-4">
              <Input
                label="Business Name"
                value={settings.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
                placeholder="Swastik Bikes"
              />

              <Input
                label="Business Address"
                value={settings.businessAddress}
                onChange={(e) => updateField('businessAddress', e.target.value)}
                placeholder="Ujjain, Madhya Pradesh"
              />
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Settings</h2>
            
            <div className="space-y-4">
              <Input
                label="WhatsApp Number"
                value={settings.whatsappNumber}
                onChange={(e) => updateField('whatsappNumber', e.target.value)}
                placeholder="+919876543210"
                icon={<Phone className="w-5 h-5 text-gray-400" />}
              />

              <Input
                label="Instagram Handle"
                value={settings.instagramHandle}
                onChange={(e) => updateField('instagramHandle', e.target.value)}
                placeholder="@swastik_bikes"
                icon={<Instagram className="w-5 h-5 text-gray-400" />}
              />

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 mb-2 font-medium">📱 WhatsApp Configuration</p>
                <p className="text-sm text-blue-700">
                  This number will be used for:
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>Customer inquiries from vehicle listings</li>
                  <li>Rental booking confirmations</li>
                  <li>Sell request notifications</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-900 mb-2 font-medium">📸 Instagram Integration</p>
                <p className="text-sm text-purple-700">
                  Display your Instagram handle in the footer for social media presence
                </p>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive email alerts for new inquiries</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => updateField('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Receive SMS alerts for urgent updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => updateField('smsNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving || saved}
              icon={saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
