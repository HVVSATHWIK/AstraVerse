
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { User, Mail, Phone, MapPin, Calendar, Shield, Settings, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  trigger: React.ReactNode;
}

const UserProfileModal = ({ trigger }: UserProfileModalProps) => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: '',
    company: '',
    location: '',
    phone: '',
    website: '',
    notifications: {
      email: true,
      desktop: true,
      workflow: true,
      security: true
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      dataSharing: false
    }
  });

  const handleSave = async () => {
    try {
      await updateProfile({ 
        full_name: formData.full_name 
      });
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  if (!user || !profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">User Profile</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl">
                  {profile.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{profile.full_name}</h3>
                <p className="text-slate-400">{user.email}</p>
                <Badge variant="outline" className="bg-green-500/20 text-green-400">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    ) : (
                      <p className="text-white">{profile.full_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-slate-400">No bio added yet</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-slate-300">Company</Label>
                    {isEditing ? (
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="Your company"
                      />
                    ) : (
                      <p className="text-slate-400">No company specified</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Email</Label>
                    <p className="text-white">{user.email}</p>
                  </div>

                  <div>
                    <Label className="text-slate-300">Phone</Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="Your phone number"
                      />
                    ) : (
                      <p className="text-slate-400">No phone number added</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-slate-300">Location</Label>
                    {isEditing ? (
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="Your location"
                      />
                    ) : (
                      <p className="text-slate-400">No location specified</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <div className="text-sm text-slate-400">
                <p>Member since {new Date(profile.created_at).toLocaleDateString()}</p>
                <p>Last updated {new Date(profile.updated_at).toLocaleDateString()}</p>
              </div>
              
              <div className="space-x-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="border-slate-600 text-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Login Notifications</Label>
                    <p className="text-slate-400 text-sm">Get notified of new logins to your account</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-slate-400 text-sm">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Desktop Notifications</Label>
                    <p className="text-slate-400 text-sm">Show desktop notifications</p>
                  </div>
                  <Switch 
                    checked={formData.notifications.desktop}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, desktop: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Workflow Updates</Label>
                    <p className="text-slate-400 text-sm">Notifications for workflow status changes</p>
                  </div>
                  <Switch 
                    checked={formData.notifications.workflow}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, workflow: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Public Profile</Label>
                    <p className="text-slate-400 text-sm">Make your profile visible to other users</p>
                  </div>
                  <Switch 
                    checked={formData.privacy.profileVisible}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        privacy: { ...prev.privacy, profileVisible: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Activity Visibility</Label>
                    <p className="text-slate-400 text-sm">Show your activity to other users</p>
                  </div>
                  <Switch 
                    checked={formData.privacy.activityVisible}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        privacy: { ...prev.privacy, activityVisible: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Data Sharing</Label>
                    <p className="text-slate-400 text-sm">Allow anonymous usage data collection</p>
                  </div>
                  <Switch 
                    checked={formData.privacy.dataSharing}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        privacy: { ...prev.privacy, dataSharing: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
