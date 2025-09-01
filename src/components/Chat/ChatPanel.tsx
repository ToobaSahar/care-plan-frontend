import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Paperclip, X as XIcon } from 'lucide-react';
import { useAssessment } from '../../state/useAssessment';
import { Message } from './Message';

// Simple mock AI response for chat functionality
interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolsUsed?: Record<string, unknown>;
}

interface ChatPanelProps {
  assessmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ assessmentId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentAssessment } = useAssessment();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load existing chat messages
  useEffect(() => {
    if (isOpen && assessmentId) {
      loadChatHistory();
    }
  }, [isOpen, assessmentId]);

  const loadChatHistory = async () => {
    try {
      // TODO: Load from chat_messages table
      // For now, start with empty messages
      setMessages([]);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Mock AI response for now
      const mockResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `I understand you said: "${userMessage.content}". This is a mock response as the AI functionality has been removed.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, mockResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3')) {
        setSelectedFile(file);
      } else {
        alert('Please select only .mp3 files');
        e.target.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-blue-600 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Assessment Info */}
      {currentAssessment && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            <div className="font-medium">Assessment ID:</div>
            <div className="font-mono text-xs">{currentAssessment.id.slice(0, 8)}...</div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Hello! I'm here to help with your assessment.</p>
            <p className="text-xs mt-1">I can help you:</p>
            <ul className="text-xs mt-2 space-y-1">
              <li>• Prefill form fields</li>
              <li>• Validate sections</li>
              <li>• Generate risk summaries</li>
              <li>• Create PDF reports</li>
            </ul>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {/* File Attachment Display */}
        {selectedFile && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Paperclip className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800 truncate">{selectedFile.name}</span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 hover:bg-blue-100 rounded-md transition-colors"
            >
              <XIcon className="w-3 h-3 text-blue-600" />
            </button>
          </div>
        )}

        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about the assessment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading || isStreaming}
          />
          
          {/* File Attachment Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isStreaming}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach MP3 file"
          >
            <Paperclip className="w-4 h-4 text-gray-600" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || isStreaming}
            className={`
              px-4 py-2 rounded-md transition-colors
              ${inputValue.trim() && !isLoading && !isStreaming
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line • Only .mp3 files allowed
        </div>
      </div>
    </div>
  );
};

// Floating chat button
export const ChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
};
