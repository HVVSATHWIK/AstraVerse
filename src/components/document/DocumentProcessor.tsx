
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Search, 
  Eye, 
  Download, 
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'processing' | 'completed' | 'error';
  uploadedAt: string;
  processedAt?: string;
  extractedText?: string;
  analysis?: {
    summary: string;
    keyPoints: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    entities: Array<{ type: string; value: string; confidence: number }>;
  };
}

const DocumentProcessor = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Q4_Report_2024.pdf',
      type: 'PDF',
      size: 2048000,
      status: 'completed',
      uploadedAt: '2024-06-15T10:30:00Z',
      processedAt: '2024-06-15T10:32:00Z',
      extractedText: 'Q4 2024 financial results show significant growth...',
      analysis: {
        summary: 'Quarterly financial report showing 25% revenue growth and improved market position.',
        keyPoints: ['25% revenue increase', 'Improved profit margins', 'Strong market expansion'],
        sentiment: 'positive',
        entities: [
          { type: 'ORGANIZATION', value: 'TechCorp Inc.', confidence: 0.95 },
          { type: 'MONEY', value: '$15.2M', confidence: 0.98 },
          { type: 'PERCENT', value: '25%', confidence: 0.92 }
        ]
      }
    },
    {
      id: '2',
      name: 'Legal_Contract_Draft.docx',
      type: 'DOCX',
      size: 156000,
      status: 'processing',
      uploadedAt: '2024-06-15T11:15:00Z'
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(documents[0]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc: Document = {
          id: `doc-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type.includes('pdf') ? 'PDF' : 'DOCX',
          size: file.size,
          status: 'processing',
          uploadedAt: new Date().toISOString()
        };
        
        setDocuments(prev => [...prev, newDoc]);
        
        // Simulate processing
        setTimeout(() => {
          setDocuments(prev => prev.map(doc => 
            doc.id === newDoc.id 
              ? { 
                  ...doc, 
                  status: 'completed',
                  processedAt: new Date().toISOString(),
                  extractedText: 'Sample extracted text from ' + file.name,
                  analysis: {
                    summary: 'AI-generated summary of the document content.',
                    keyPoints: ['Key point 1', 'Key point 2', 'Key point 3'],
                    sentiment: 'neutral',
                    entities: [
                      { type: 'PERSON', value: 'John Doe', confidence: 0.88 },
                      { type: 'DATE', value: '2024-06-15', confidence: 0.94 }
                    ]
                  }
                }
              : doc
          ));
          
          toast({
            title: 'Document Processed',
            description: `${file.name} has been successfully analyzed.`,
          });
        }, 3000);
      });
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Document List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Documents</span>
            </CardTitle>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              {documents.length} files
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" className="text-slate-300 border-slate-600">
                Upload Documents
              </Button>
            </label>
            <p className="text-slate-400 text-sm mt-2">PDF, DOC, DOCX, TXT</p>
          </div>

          {/* Document List */}
          <div className="space-y-2">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedDocument?.id === doc.id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700/70'
                }`}
                onClick={() => setSelectedDocument(doc)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className="text-white text-sm font-medium truncate">
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                        <span className="text-slate-400 text-xs">
                          {formatFileSize(doc.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {doc.status === 'processing' && (
                    <Progress value={65} className="mt-2 h-1" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Details */}
      <div className="lg:col-span-2">
        {selectedDocument ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>{selectedDocument.name}</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="analysis" className="space-y-4">
                <TabsList className="bg-slate-700/50">
                  <TabsTrigger value="analysis" className="text-slate-300">AI Analysis</TabsTrigger>
                  <TabsTrigger value="content" className="text-slate-300">Extracted Content</TabsTrigger>
                  <TabsTrigger value="metadata" className="text-slate-300">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4">
                  {selectedDocument.analysis ? (
                    <>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Summary</h4>
                        <p className="text-slate-300">{selectedDocument.analysis.summary}</p>
                      </div>

                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Key Points</h4>
                        <ul className="space-y-1">
                          {selectedDocument.analysis.keyPoints.map((point, index) => (
                            <li key={index} className="text-slate-300 flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Sentiment</h4>
                          <Badge 
                            variant="outline" 
                            className={
                              selectedDocument.analysis.sentiment === 'positive' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                : selectedDocument.analysis.sentiment === 'negative'
                                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                            }
                          >
                            {selectedDocument.analysis.sentiment.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Entities</h4>
                          <div className="space-y-1">
                            {selectedDocument.analysis.entities.map((entity, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-slate-300 text-sm">{entity.value}</span>
                                <Badge variant="outline" className="text-xs">
                                  {entity.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Zap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">Analysis in progress...</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Extracted Text</h4>
                    <div className="text-slate-300 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {selectedDocument.extractedText || 'Content extraction in progress...'}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">File Type:</span>
                        <span className="text-white">{selectedDocument.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">File Size:</span>
                        <span className="text-white">{formatFileSize(selectedDocument.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-white capitalize">{selectedDocument.status}</span>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Uploaded:</span>
                        <span className="text-white">
                          {new Date(selectedDocument.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedDocument.processedAt && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Processed:</span>
                          <span className="text-white">
                            {new Date(selectedDocument.processedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No Document Selected</h3>
              <p className="text-slate-400">Select a document from the list to view its details and analysis.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DocumentProcessor;
