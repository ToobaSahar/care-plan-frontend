import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Paperclip, X as XIcon } from 'lucide-react';
import { useAssessment } from '../../state/useAssessment';
import { Message } from './Message';
import type { AgentMessage } from './types';

// Simple mock AI response for chat functionality
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
    <div className="cf-arrive fixed inset-y-0 right-0 z-50 flex w-full max-w-[380px] flex-col xl:max-w-[340px] border-l border-oat-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-oat-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-100 bg-teal-50 text-teal-700">
            <Bot className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <h3 className="text-lg font-semibold text-teal-800">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close assistant"
          className="rounded-md p-1.5 text-oat-600 transition-colors duration-fast hover:bg-oat-100 hover:text-oat-900"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Assessment Info */}
      {currentAssessment && (
        <div className="border-b border-oat-200 bg-oat-100 px-5 py-2.5">
          <div className="flex items-baseline gap-2 text-xs text-oat-600">
            <div className="font-medium">Assessment ID:</div>
            <div className="font-mono text-xs">{currentAssessment.id.slice(0, 8)}...</div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="py-10 text-center text-oat-600">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-teal-600">
              <Bot className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="text-base font-medium text-oat-900">Hello! I'm here to help with your assessment.</p>
            <p className="mt-2 text-xs">I can help you:</p>
            <ul className="mt-2 space-y-1 text-xs">
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
          <div className="flex items-center gap-2 text-oat-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-oat-200 bg-white px-5 py-4">
        {/* File Attachment Display */}
        {selectedFile && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-3 py-2">
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

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about the assessment..."
            className="cf-input min-w-0 flex-1"
            disabled={isLoading}
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
            disabled={isLoading}
            className="flex w-11 flex-none items-center justify-center rounded-md border border-oat-300 bg-white text-oat-600 transition-colors duration-fast hover:bg-oat-100 hover:text-oat-900 disabled:cursor-not-allowed disabled:opacity-50"
            title="Attach MP3 file"
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={`
              flex w-11 flex-none items-center justify-center rounded-md transition-colors duration-fast
              ${inputValue.trim() && !isLoading
                ? 'bg-teal-600 text-white shadow-xs hover:bg-teal-700'
                : 'cursor-not-allowed bg-oat-200 text-oat-500'
              }
            `}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        
        <div className="mt-2.5 text-xs text-oat-500">
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
      className="fixed bottom-[5.5rem] right-5 w-14 h-14 bg-teal-700 text-white rounded-full shadow-lg hover:bg-teal-800 transition-colors duration-fast flex items-center justify-center z-40"
    >
      <MessageSquare className="w-6 h-6" aria-hidden="true" />
      <span className="sr-only">Open assistant</span>
    </button>
  );
};
