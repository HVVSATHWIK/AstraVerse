import React, { useState, useEffect } from 'react';
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
import { User, Mail, Phone, MapPin, Calendar, Shield, Settings, Bell, Briefcase, Globe, Clock, Activity, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useUserActivityLogs } from '@/services/supabaseDataService';
import { useUserIntegrations } from '@/services/supabaseDataService';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface UserProfileModalProps {
  trigger: React.ReactNode;
}

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  bio: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.string().length(0)),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfileModal = ({ trigger }: UserProfileModalProps) => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Fetch activity logs and integrations
  const { data: activityLogs, isLoading: logsLoading } = useUserActivityLogs(20);
  const { data: integrations, isLoading: integrationsLoading } = useUserIntegrations();
  
  // User statistics (mock data for now)
  const [userStats] = useState({
    workflowsCreated: 12,
    tasksCompleted: 156,
    integrationsSynced: 8,
    successRate: 94.2,
    totalUptime: '15d 8h 42m',
    lastActive: new Date().toISOString()
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      company: profile?.company || '',
      location: profile?.location || '',
      phone: profile?.phone || '',
      website: profile?.website || '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        bio: profile?.bio || '',
        company: profile?.company || '',
        location: profile?.location || '',
        phone: profile?.phone || '',
        website: profile?.website || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile({ 
        full_name: values.full_name,
        bio: values.bio,
        company: values.company,
        location: values.location,
        phone: values.phone,
        website: values.website,
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!user || !profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">User Profile</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
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
                <div className="flex space-x-2">
                  <Badge variant="outline" className="bg-green-500/20 text-green-400">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>

            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">Full Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-slate-600 border-slate-500 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="bg-slate-600 border-slate-500 text-white"
                                placeholder="Tell us about yourself..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">Company</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-slate-600 border-slate-500 text-white"
                                placeholder="Your company"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">Phone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-slate-600 border-slate-500 text-white"
                                placeholder="Your phone number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">Location</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-slate-600 border-slate-500 text-white"
                                placeholder="Your location"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">Website</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-slate-600 border-slate-500 text-white"
                                placeholder="Your website"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="border-slate-600 text-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <>
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
                      <p className="text-white">{profile.full_name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-slate-300">Bio</Label>
                      <p className="text-slate-400 text-sm">{profile.bio || 'No bio added yet'}</p>
                    </div>

                    <div>
                      <Label className="text-slate-300">Company</Label>
                      <p className="text-slate-400 text-sm">{profile.company || 'No company specified'}</p>
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
                      <p className="text-slate-400 text-sm">{profile.phone || 'No phone number added'}</p>
                    </div>

                    <div>
                      <Label className="text-slate-300">Location</Label>
                      <p className="text-slate-400 text-sm">{profile.location || 'No location specified'}</p>
                    </div>

                    <div>
                      <Label className="text-slate-300">Website</Label>
                      <p className="text-slate-400 text-sm">
                        {profile.website ? (
                          <a 
                            href={profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {profile.website}
                          </a>
                        ) : 'No website added'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <div className="text-sm text-slate-400">
                    <p>Member since {new Date(profile.created_at).toLocaleDateString()}</p>
                    <p>Last updated {new Date(profile.updated_at).toLocaleDateString()}</p>
                  </div>
                  
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Edit Profile
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 mt-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-slate-600/50 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : activityLogs && activityLogs.length > 0 ? (
                  <div className="space-y-4">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="p-3 border border-slate-600 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-white font-medium">{log.action}</span>
                          </div>
                          <span className="text-slate-400 text-xs">{formatTimestamp(log.created_at)}</span>
                        </div>
                        <p className="text-slate-300 text-sm mt-1">{log.description}</p>
                        {log.metadata && (
                          <div className="mt-2 p-2 bg-slate-600/30 rounded text-xs text-slate-400">
                            {Object.entries(log.metadata).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span>{key}:</span>
                                <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">No activity found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6 mt-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {integrationsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-slate-600/50 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : integrations && integrations.length > 0 ? (
                  <div className="space-y-4">
                    {integrations.map((integration) => (
                      <div key={integration.id} className="p-3 border border-slate-600 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                              {integration.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{integration.name}</h4>
                              <p className="text-slate-400 text-xs">{integration.type}</p>
                            </div>
                          </div>
                          <Badge className={integration.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {integration.status === 'connected' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Last synced: {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">No integrations found</p>
                    <Button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600">
                      Connect New Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6 mt-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  User Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-600/30 rounded-lg text-center">
                    <h4 className="text-slate-300 text-sm">Workflows Created</h4>
                    <p className="text-2xl font-bold text-white">{userStats.workflowsCreated}</p>
                  </div>
                  <div className="p-4 bg-slate-600/30 rounded-lg text-center">
                    <h4 className="text-slate-300 text-sm">Tasks Completed</h4>
                    <p className="text-2xl font-bold text-white">{userStats.tasksCompleted}</p>
                  </div>
                  <div className="p-4 bg-slate-600/30 rounded-lg text-center">
                    <h4 className="text-slate-300 text-sm">Integrations Synced</h4>
                    <p className="text-2xl font-bold text-white">{userStats.integrationsSynced}</p>
                  </div>
                  <div className="p-4 bg-slate-600/30 rounded-lg text-center">
                    <h4 className="text-slate-300 text-sm">Success Rate</h4>
                    <p className="text-2xl font-bold text-green-400">{userStats.successRate}%</p>
                  </div>
                  <div className="p-4 bg-slate-600/30 rounded-lg text-center">
                    <h4 className="text-slate-300 text-sm">Total Uptime</h4>
                    <p className="text-2xl font-bold text-white">{userStats.totalUptime}</p>
                  </div>
                  <div className="p-4 bg-slate-600/30 rounded-lg text-center">
                    <h4 className="text-slate-300 text-sm">Last Active</h4>
                    <p className="text-xl font-bold text-white">{formatTimestamp(userStats.lastActive)}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-600/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Achievements</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge className="bg-purple-500/20 text-purple-400 py-1 px-3">Early Adopter</Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 py-1 px-3">Power User</Badge>
                    <Badge className="bg-green-500/20 text-green-400 py-1 px-3">Workflow Master</Badge>
                    <Badge className="bg-yellow-500/20 text-yellow-400 py-1 px-3">AI Pioneer</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Usage Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  <p className="text-slate-400">Usage timeline visualization coming soon</p>
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