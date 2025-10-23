import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Save, MapPin, Building, CreditCard } from 'lucide-react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserProfile {
  id?: string;
  user_id?: string;
  business_name?: string;
  business_type?: string;
  gst_number?: string;
  pan_number?: string;
  website?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  timezone?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  balance?: number;
  hold_amount?: number;
  kyc_status?: string;
}

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Load user basic info
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Load extended profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      setUser(userData);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load profile data');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Upload logo if selected
      let logoUrl = profile.logo_url;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${user.id}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('kyc-documents')
          .upload(`${user.id}/${fileName}`, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('kyc-documents')
          .getPublicUrl(`${user.id}/${fileName}`);

        logoUrl = publicUrl;
      }

      // Update or insert profile
      const profileData = {
        ...profile,
        user_id: user.id,
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;

      // Update basic user info if changed
      if (profile.business_name !== user.name) {
        const { error: userError } = await supabase
          .from('users')
          .update({ name: profile.business_name })
          .eq('id', user.id);

        if (userError) throw userError;
      }

      toast.success('Profile updated successfully');
      await loadUserData(); // Reload data
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Logo file size must be less than 2MB');
        return;
      }
      setLogoFile(file);
    }
  };

  return (
    <SettingsLayout activeTab="profile">
      <div className="space-y-6">
        {/* Business Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Profile
            </CardTitle>
            <CardDescription>
              Update your business information and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {profile.business_name?.charAt(0) || user?.name?.charAt(0) || 'B'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="logo">Business Logo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-auto"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={profile.business_name || user?.name || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, business_name: e.target.value }))}
                  placeholder="Enter business name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={profile.business_type || ''}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, business_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="private_limited">Private Limited</SelectItem>
                    <SelectItem value="public_limited">Public Limited</SelectItem>
                    <SelectItem value="llp">LLP</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tax Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={profile.gst_number || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, gst_number: e.target.value.toUpperCase() }))}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  value={profile.pan_number || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
                  placeholder="AAAAA0000A"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Business Address
            </CardTitle>
            <CardDescription>
              Your registered business address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  value={profile.address_line_1 || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, address_line_1: e.target.value }))}
                  placeholder="Street address"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  value={profile.address_line_2 || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, address_line_2: e.target.value }))}
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.city || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profile.state || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  value={profile.pincode || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, pincode: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={profile.country || 'India'}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Account Status
            </CardTitle>
            <CardDescription>
              Current account information and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Account Balance</Label>
                <div className="text-2xl font-bold text-green-600">
                  ₹{(user?.balance || 0) / 100}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hold Amount</Label>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{(user?.hold_amount || 0) / 100}
                </div>
              </div>
              <div className="space-y-2">
                <Label>KYC Status</Label>
                <Badge variant={user?.kyc_status === 'approved' ? 'default' : 'secondary'}>
                  {user?.kyc_status || 'incomplete'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
}
