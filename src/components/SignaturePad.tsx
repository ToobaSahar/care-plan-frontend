import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Download, Upload, X } from 'lucide-react';
import { useAssessment } from '../state/useAssessment';
import { supabase } from '../lib/supabase';

interface SignaturePadProps {
  assessmentId: string;
  readOnly?: boolean;
  onSignatureSaved?: (signatureUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  assessmentId,
  readOnly = false,
  onSignatureSaved,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [existingSignature, setExistingSignature] = useState<string | null>(null);
  const { currentAssessment } = useAssessment();

  useEffect(() => {
    if (assessmentId) {
      loadExistingSignature();
    }
  }, [assessmentId]);

  const loadExistingSignature = async () => {
    try {
      const { data, error } = await supabase
        .from('signatures')
        .select('*')
        .eq('assessment_id', assessmentId)
        .single();

      if (data && !error) {
        setExistingSignature(data.signature_url);
        setHasSignature(true);
      }
    } catch (error) {
      console.error('Error loading signature:', error);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;
        
        // Set drawing style
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      
      if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      
      if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setHasSignature(true);
  };

  const clearCanvas = () => {
    if (readOnly) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const saveSignature = async () => {
    if (!canvasRef.current || !hasSignature) return;

    setIsUploading(true);
    try {
      const canvas = canvasRef.current;
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Create unique filename
      const timestamp = new Date().getTime();
      const filename = `signature_${timestamp}.png`;
      const filePath = `signatures/${assessmentId}/${filename}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('signatures')
        .upload(filePath, blob, {
          contentType: 'image/png',
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('signatures')
        .getPublicUrl(filePath);

      // Save signature record to database
      const { error: dbError } = await supabase.from('signatures').upsert({
        assessment_id: assessmentId,
        signature_url: urlData.publicUrl,
        file_path: filePath,
        signed_at: new Date().toISOString(),
      }, {
        onConflict: 'assessment_id'
      });

      if (dbError) throw dbError;

      // Update state
      setExistingSignature(urlData.publicUrl);
      setHasSignature(true);
      
      // Call callback
      if (onSignatureSaved) {
        onSignatureSaved(urlData.publicUrl);
      }

      alert('Signature saved successfully!');
    } catch (error) {
      console.error('Error saving signature:', error);
      alert('Error saving signature. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSignature = () => {
    if (!existingSignature) return;
    
    const link = document.createElement('a');
    link.href = existingSignature;
    link.download = `signature_${assessmentId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (existingSignature && !readOnly) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Digital Signature</h3>
          <button
            onClick={() => setExistingSignature(null)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Create New Signature
          </button>
        </div>
        
        <div className="border rounded-lg p-4">
          <img
            src={existingSignature}
            alt="Digital Signature"
            className="max-w-full h-auto border"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={downloadSignature}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Digital Signature</h3>
        {!readOnly && (
          <div className="flex space-x-2">
            <button
              onClick={clearCanvas}
              disabled={!hasSignature}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </button>
            <button
              onClick={saveSignature}
              disabled={!hasSignature || isUploading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Saving...' : 'Save Signature'}
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="text-sm text-gray-500 text-center">
        {readOnly ? (
          'Signature capture is disabled in read-only mode'
        ) : (
          'Use your mouse or touch to draw your signature above'
        )}
      </div>

      {!hasSignature && !readOnly && (
        <div className="text-center py-4 text-gray-400">
          <PenTool className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm">Draw your signature to continue</p>
        </div>
      )}
    </div>
  );
};
