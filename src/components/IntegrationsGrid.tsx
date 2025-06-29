import React from 'react';
import IntegrationCard from '@/components/IntegrationCard';
import GeminiIntegrationCard from '@/components/GeminiIntegrationCard';
import { Video, MessageSquare, ClipboardList, Database, LineChart, Search } from 'lucide-react';

const IntegrationsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <GeminiIntegrationCard />
      <IntegrationCard
        name="Zoom"
        description="Video transcription and meeting insights"
        status="connected"
        icon={<Video className="w-6 h-6" />}
        metrics={{ meetings: 45, transcriptions: 42 }}
      />
      <IntegrationCard
        name="Slack"
        description="Real-time notifications and slash commands"
        status="connected"
        icon={<MessageSquare className="w-6 h-6" />}
        metrics={{ channels: 12, notifications: 156 }}
      />
      <IntegrationCard
        name="Jira"
        description="Automated ticket creation and updates"
        status="connected"
        icon={<ClipboardList className="w-6 h-6" />}
        metrics={{ tickets: 23, automated: 18 }}
      />
      <IntegrationCard
        name="MongoDB"
        description="Metadata and document storage"
        status="connected"
        icon={<Database className="w-6 h-6" />}
        metrics={{ documents: "2.3M", size: "45GB" }}
      />
      <IntegrationCard
        name="InfluxDB"
        description="Time-series metrics and analytics"
        status="connected"
        icon={<LineChart className="w-6 h-6" />}
        metrics={{ points: "890K", queries: 1200 }}
      />
      <IntegrationCard
        name="Milvus"
        description="Vector embeddings and similarity search"
        status="warning"
        icon={<Search className="w-6 h-6" />}
        metrics={{ vectors: "1.2M", searches: 450 }}
      />
    </div>
  );
};

export default IntegrationsGrid;