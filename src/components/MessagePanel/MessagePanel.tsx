
import React, { useState } from 'react';
import { MessageSquare, X, Ruler, AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnits } from '@/contexts/UnitsContext';

interface Message {
  id: string;
  type: 'success' | 'error' | 'info' | 'measurement';
  title: string;
  content?: string;
  timestamp: Date;
  data?: any;
}

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

interface MessagePanelProps {
  measurements?: MeasureData[];
  onClearMeasurements?: () => void;
  onRemoveMeasurement?: (id: string) => void;
  messages?: Message[];
  onClearMessages?: () => void;
  onRemoveMessage?: (id: string) => void;
}

const MessagePanel = ({
  measurements = [],
  onClearMeasurements,
  onRemoveMeasurement,
  messages = [],
  onClearMessages,
  onRemoveMessage
}: MessagePanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'measurements'>('messages');
  const { formatValue, convertValue } = useUnits();

  const totalItems = messages.length + measurements.length;

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-600" />;
      case 'measurement':
        return <Ruler className="h-3 w-3 text-blue-600" />;
      default:
        return <Info className="h-3 w-3 text-blue-600" />;
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-white/95 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-lg"
          size="sm"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
          {totalItems > 0 && (
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg shadow-xl z-40 w-80 max-h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-800">Messages</h3>
          {totalItems > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {totalItems}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0 text-gray-500 hover:text-gray-800"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'messages'
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Messages ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('measurements')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'measurements'
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Measurements ({measurements.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-2 max-h-64 overflow-y-auto">
        {activeTab === 'messages' && (
          <div className="space-y-2">
            {messages.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearMessages}
                    className="h-6 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                </div>
                {messages.map((message) => (
                  <div key={message.id} className="bg-gray-50 rounded p-2 text-sm">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-1">
                        {getMessageIcon(message.type)}
                        <span className="font-medium text-gray-800">{message.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveMessage?.(message.id)}
                        className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                    {message.content && (
                      <p className="text-gray-600 text-xs">{message.content}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === 'measurements' && (
          <div className="space-y-2">
            {measurements.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Ruler className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No measurements</p>
                <p className="text-xs">Use the measure tool to add measurements</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearMeasurements}
                    className="h-6 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                </div>
                {measurements.map((measurement) => (
                  <div key={measurement.id} className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-700 font-medium">{measurement.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveMeasurement?.(measurement.id)}
                        className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-800 font-mono mb-1">
                      {formatValue(convertValue(measurement.distance, 'meters'))}
                    </div>
                    <div className="text-xs text-gray-500">
                      From: ({measurement.startPoint.x.toFixed(2)}, {measurement.startPoint.y.toFixed(2)}, {measurement.startPoint.z.toFixed(2)})
                    </div>
                    <div className="text-xs text-gray-500">
                      To: ({measurement.endPoint.x.toFixed(2)}, {measurement.endPoint.y.toFixed(2)}, {measurement.endPoint.z.toFixed(2)})
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePanel;
