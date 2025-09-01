import React from 'react';
import { Bot, User, CheckCircle, AlertCircle } from 'lucide-react';
import type { AgentMessage } from '../../lib/agents/relevance';

interface MessageProps {
  message: AgentMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const hasTools = message.toolsUsed && Object.keys(message.toolsUsed).length > 0;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderToolUsage = () => {
    if (!hasTools) return null;

    return (
      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center space-x-2 text-xs text-blue-700">
          <CheckCircle className="w-3 h-3" />
          <span className="font-medium">Tools used:</span>
        </div>
        <div className="mt-1 space-y-1">
          {Object.entries(message.toolsUsed).map(([tool, result]) => (
            <div key={tool} className="text-xs text-blue-600">
              <span className="font-medium">{tool}:</span>{' '}
              {typeof result === 'string' ? result : JSON.stringify(result)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700'
          }
        `}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Message Content */}
        <div className={`
          px-3 py-2 rounded-lg text-sm
          ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
          }
        `}>
          {/* Message Text */}
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {/* Tool Usage */}
          {!isUser && renderToolUsage()}
          
          {/* Timestamp */}
          <div className={`
            text-xs mt-1
            ${isUser ? 'text-blue-200' : 'text-gray-500'}
          `}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

// System message component for tool execution results
export const SystemMessage: React.FC<{ content: string; type?: 'success' | 'error' | 'info' }> = ({ 
  content, 
  type = 'info' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="flex justify-center my-4">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-md border text-xs ${getStyles()}`}>
        {getIcon()}
        <span>{content}</span>
      </div>
    </div>
  );
};
