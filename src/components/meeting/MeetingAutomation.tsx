
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Mic, 
  Users, 
  Calendar, 
  Clock, 
  FileText,
  Send,
  Play,
  Pause,
  Square,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Meeting {
  id: string;
  title: string;
  participants: string[];
  startTime: string;
  duration: number;
  status: 'scheduled' | 'recording' | 'completed' | 'processing';
  transcription?: {
    speakers: string[];
    segments: Array<{
      speaker: string;
      timestamp: string;
      text: string;
    }>;
  };
  summary?: {
    overview: string;
    keyDecisions: string[];
    actionItems: Array<{
      task: string;
      assignee: string;
      dueDate: string;
    }>;
    followUpItems: string[];
  };
}

const MeetingAutomation = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Q4 Strategy Planning',
      participants: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
      startTime: '2024-06-15T14:00:00Z',
      duration: 60,
      status: 'completed',
      transcription: {
        speakers: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
        segments: [
          {
            speaker: 'John Doe',
            timestamp: '00:02:15',
            text: 'Welcome everyone to our Q4 strategy planning session. Let\'s start by reviewing our current market position.'
          },
          {
            speaker: 'Sarah Smith',
            timestamp: '00:03:22',
            text: 'Thanks John. Our market research shows significant opportunities in the enterprise segment.'
          },
          {
            speaker: 'Mike Johnson',
            timestamp: '00:05:45',
            text: 'I agree with Sarah. We should prioritize the enterprise features for Q4 release.'
          }
        ]
      },
      summary: {
        overview: 'Strategic planning meeting focused on Q4 objectives and market positioning.',
        keyDecisions: [
          'Prioritize enterprise features for Q4 release',
          'Increase marketing budget by 20%',
          'Establish partnership with TechCorp'
        ],
        actionItems: [
          {
            task: 'Prepare enterprise feature specifications',
            assignee: 'Sarah Smith',
            dueDate: '2024-06-22'
          },
          {
            task: 'Draft marketing budget proposal',
            assignee: 'Mike Johnson',
            dueDate: '2024-06-20'
          }
        ],
        followUpItems: [
          'Schedule follow-up with TechCorp',
          'Review competitor analysis',
          'Prepare Q4 roadmap presentation'
        ]
      }
    },
    {
      id: '2',
      title: 'Weekly Team Standup',
      participants: ['Alice Cooper', 'Bob Wilson', 'Carol Davis'],
      startTime: '2024-06-15T10:00:00Z',
      duration: 30,
      status: 'processing'
    }
  ]);

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(meetings[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { toast } = useToast();

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    toast({
      title: 'Recording Started',
      description: 'Meeting recording and transcription has begun.',
    });

    // Clean up timer when recording stops
    setTimeout(() => {
      clearInterval(timer);
    }, 10000); // Auto-stop after 10 seconds for demo
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Create new meeting record
    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title: 'Live Recorded Meeting',
      participants: ['Current User'],
      startTime: new Date().toISOString(),
      duration: Math.floor(recordingTime / 60),
      status: 'processing'
    };
    
    setMeetings(prev => [newMeeting, ...prev]);
    
    toast({
      title: 'Recording Stopped',
      description: 'Processing transcription and generating meeting summary...',
    });

    // Simulate processing
    setTimeout(() => {
      setMeetings(prev => prev.map(meeting => 
        meeting.id === newMeeting.id 
          ? { 
              ...meeting, 
              status: 'completed',
              transcription: {
                speakers: ['Current User'],
                segments: [
                  {
                    speaker: 'Current User',
                    timestamp: '00:00:05',
                    text: 'This is a test recording to demonstrate the meeting automation features.'
                  }
                ]
              },
              summary: {
                overview: 'Test recording session to demonstrate AI-powered meeting automation.',
                keyDecisions: ['Demo completed successfully'],
                actionItems: [
                  {
                    task: 'Review meeting automation features',
                    assignee: 'Current User',
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  }
                ],
                followUpItems: ['Explore advanced features']
              }
            }
          : meeting
      ));
    }, 5000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'recording':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Video className="w-5 h-5 text-blue-400" />
            <span>Meeting Recording</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Mic className={`w-4 h-4 ${isRecording ? 'text-red-400' : 'text-slate-400'}`} />
                <span className="text-white font-mono">
                  {isRecording ? formatDuration(recordingTime) : '00:00'}
                </span>
              </div>
            </div>

            {isRecording && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-medium">RECORDING</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Meetings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meetings.map((meeting) => (
              <Card
                key={meeting.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedMeeting?.id === meeting.id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700/70'
                }`}
                onClick={() => setSelectedMeeting(meeting)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium text-sm">{meeting.title}</span>
                      <Badge variant="outline" className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Users className="w-3 h-3" />
                      <span>{meeting.participants.length} participants</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{meeting.duration}min</span>
                    </div>
                    
                    <div className="text-xs text-slate-400">
                      {new Date(meeting.startTime).toLocaleDateString()} at {' '}
                      {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {meeting.status === 'processing' && (
                    <Progress value={75} className="mt-2 h-1" />
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Meeting Details */}
        <div className="lg:col-span-2">
          {selectedMeeting ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{selectedMeeting.title}</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                      <Send className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="space-y-4">
                  <TabsList className="bg-slate-700/50">
                    <TabsTrigger value="summary" className="text-slate-300">Summary</TabsTrigger>
                    <TabsTrigger value="transcription" className="text-slate-300">Transcription</TabsTrigger>
                    <TabsTrigger value="actions" className="text-slate-300">Action Items</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    {selectedMeeting.summary ? (
                      <>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Overview</h4>
                          <p className="text-slate-300">{selectedMeeting.summary.overview}</p>
                        </div>

                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Key Decisions</h4>
                          <ul className="space-y-1">
                            {selectedMeeting.summary.keyDecisions.map((decision, index) => (
                              <li key={index} className="text-slate-300 flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span>{decision}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Follow-up Items</h4>
                          <ul className="space-y-1">
                            {selectedMeeting.summary.followUpItems.map((item, index) => (
                              <li key={index} className="text-slate-300 flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">Summary generation in progress...</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="transcription" className="space-y-4">
                    {selectedMeeting.transcription ? (
                      <div className="bg-slate-700/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        <div className="space-y-3">
                          {selectedMeeting.transcription.segments.map((segment, index) => (
                            <div key={index} className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <Badge variant="outline" className="text-xs">
                                  {segment.timestamp}
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <div className="text-blue-400 font-medium text-sm">{segment.speaker}:</div>
                                <p className="text-slate-300 text-sm">{segment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Mic className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">Transcription in progress...</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    {selectedMeeting.summary?.actionItems ? (
                      <div className="space-y-3">
                        {selectedMeeting.summary.actionItems.map((item, index) => (
                          <Card key={index} className="bg-slate-700/50 border-slate-600">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h5 className="text-white font-medium">{item.task}</h5>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-400">
                                    <span>Assigned to: {item.assignee}</span>
                                    <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                  Complete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">No action items identified yet.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No Meeting Selected</h3>
                <p className="text-slate-400">Select a meeting from the list to view its details.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingAutomation;
