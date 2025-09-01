import React, { useState, useRef } from 'react';
import { Upload, X, File, Download, Trash2 } from 'lucide-react';
import { useAssessment } from '../state/useAssessment';
import { supabase } from '../lib/supabase';

interface Attachment {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  description?: string;
}

interface AttachmentUploaderProps {
  assessmentId: string;
  readOnly?: boolean;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  assessmentId,
  readOnly = false,
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentAssessment } = useAssessment();

  // Load existing attachments
  React.useEffect(() => {
    if (assessmentId) {
      loadAttachments();
    }
  }, [assessmentId]);

  const loadAttachments = async () => {
    try {
      const { data, error } = await supabase
        .from('attachments')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Error loading attachments:', error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (readOnly) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!assessmentId) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const filename = `${timestamp}_${file.name}`;
      const filePath = `attachments/${assessmentId}/${filename}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('attachments')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          },
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      // Save attachment record to database
      const { error: dbError } = await supabase.from('attachments').insert({
        assessment_id: assessmentId,
        filename: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        description: '',
      });

      if (dbError) throw dbError;

      // Reload attachments
      await loadAttachments();
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAttachment = async (attachmentId: string, filePath: string) => {
    if (readOnly) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('attachments')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('attachments')
        .delete()
        .eq('id', attachmentId);

      if (dbError) throw dbError;

      // Reload attachments
      await loadAttachments();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      alert('Error deleting attachment. Please try again.');
    }
  };

  const downloadAttachment = async (attachment: Attachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .download(attachment.file_path);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Error downloading attachment. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
        {!readOnly && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />

      {/* Drag and drop area */}
      {!readOnly && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop files here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-500"
            >
              browse
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports any file type up to 10MB
          </p>
        </div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Uploading...</span>
            <span className="text-sm text-blue-700">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Attachments list */}
      {attachments.length > 0 ? (
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {attachment.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.file_size)} • {formatDate(attachment.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadAttachment(attachment)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                {!readOnly && (
                  <button
                    onClick={() => deleteAttachment(attachment.id, attachment.file_path)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <File className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm">No attachments yet</p>
          {!readOnly && (
            <p className="text-xs">Upload files to get started</p>
          )}
        </div>
      )}
    </div>
  );
};
