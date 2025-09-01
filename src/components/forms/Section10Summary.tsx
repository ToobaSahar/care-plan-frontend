import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signaturesSchema, optionalAttachmentsSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { User, Calendar, CheckCircle, FileText, Shield, Pill, FileCheck, Users, MessageSquare, Info } from 'lucide-react';
import type { Signatures, OptionalAttachments } from '../../schema/assessment';
import { useNavigate } from 'react-router-dom';

interface Section10SummaryProps {
  readOnly?: boolean;
  onCompleteAssessment?: () => void;
}

export const Section10Summary: React.FC<Section10SummaryProps> = ({ readOnly = false, onCompleteAssessment }) => {
  const navigate = useNavigate();
  const { data: signaturesData, updateData: updateSignatures } = useCurrentSectionData<'signatures'>('signatures');
  const { data: attachmentsData, updateData: updateAttachments } = useCurrentSectionData<'optionalAttachments'>('optionalAttachments');

  const {
    register: registerSignatures,
    handleSubmit: handleSubmitSignatures,
    setValue: setSignatureValue,
    formState: { errors: signatureErrors },
  } = useForm<Signatures>({
    resolver: zodResolver(signaturesSchema),
    defaultValues: signaturesData || {},
  });

  const {
    register: registerAttachments,
    handleSubmit: handleSubmitAttachments,
    setValue: setAttachmentValue,
    formState: { errors: attachmentErrors },
  } = useForm<OptionalAttachments>({
    resolver: zodResolver(optionalAttachmentsSchema),
    defaultValues: attachmentsData || {},
  });

  useEffect(() => {
    if (signaturesData) {
      Object.entries(signaturesData).forEach(([key, value]) => {
        setSignatureValue(key as keyof Signatures, value as any);
      });
    }
  }, [signaturesData, setSignatureValue]);

  useEffect(() => {
    if (attachmentsData) {
      Object.entries(attachmentsData).forEach(([key, value]) => {
        setAttachmentValue(key as keyof OptionalAttachments, value as any);
      });
    }
  }, [attachmentsData, setAttachmentValue]);

  const onSubmitSignatures = (formData: Signatures) => {
    updateSignatures(formData);
  };

  const onSubmitAttachments = (formData: OptionalAttachments) => {
    updateAttachments(formData);
  };

  const handleSignatureChange = (field: keyof Signatures, value: any) => {
    setSignatureValue(field, value);
    updateSignatures({ [field]: value });
  };

  const handleAttachmentChange = (field: keyof OptionalAttachments, value: boolean) => {
    setAttachmentValue(field, value);
    updateAttachments({ [field]: value });
  };

  if (readOnly) {
    return (
      <div className="space-y-6">
        {/* Signatures Read Only */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signatures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assessor Name</label>
              <p className="mt-1 text-sm text-gray-900">{signaturesData?.assessor_name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assessor Date</label>
              <p className="mt-1 text-sm text-gray-900">{signaturesData?.assessor_date || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Individual/Representative Name</label>
              <p className="mt-1 text-sm text-gray-900">{signaturesData?.individual_representative_name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Individual/Representative Date</label>
              <p className="mt-1 text-sm text-gray-900">{signaturesData?.individual_representative_date || '-'}</p>
            </div>
          </div>
        </div>

        {/* Optional Attachments Read Only */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Attachments</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(attachmentsData || {}).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <CheckCircle className={`w-4 h-4 mr-2 ${value ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Signatures Section */}
      <form onSubmit={handleSubmitSignatures(onSubmitSignatures)} className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            Signatures
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assessor Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Assessor
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  {...registerSignatures('assessor_name')}
                  onChange={(e) => handleSignatureChange('assessor_name', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter assessor name"
                />
                {signatureErrors.assessor_name && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.assessor_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature
                </label>
                <textarea
                  {...registerSignatures('assessor_signature')}
                  onChange={(e) => handleSignatureChange('assessor_signature', e.target.value)}
                  disabled={readOnly}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Digital signature or signature notes"
                />
                {signatureErrors.assessor_signature && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.assessor_signature.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  {...registerSignatures('assessor_date')}
                  onChange={(e) => handleSignatureChange('assessor_date', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
                {signatureErrors.assessor_date && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.assessor_date.message}</p>
                )}
              </div>
            </div>

            {/* Individual/Representative Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Individual / Representative
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  {...registerSignatures('individual_representative_name')}
                  onChange={(e) => handleSignatureChange('individual_representative_name', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter individual or representative name"
                />
                {signatureErrors.individual_representative_name && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.individual_representative_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature
                </label>
                <textarea
                  {...registerSignatures('individual_representative_signature')}
                  onChange={(e) => handleSignatureChange('individual_representative_signature', e.target.value)}
                  disabled={readOnly}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Digital signature or signature notes"
                />
                {signatureErrors.individual_representative_signature && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.individual_representative_signature.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  {...registerSignatures('individual_representative_date')}
                  onChange={(e) => handleSignatureChange('individual_representative_date', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
                {signatureErrors.individual_representative_date && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.individual_representative_date.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Optional Attachments Section */}
      <form onSubmit={handleSubmitAttachments(onSubmitAttachments)} className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-gray-600" />
            Optional Attachments
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="risk_assessments"
                {...registerAttachments('risk_assessments')}
                onChange={(e) => handleAttachmentChange('risk_assessments', e.target.checked)}
                disabled={readOnly}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="risk_assessments" className="ml-2 block text-sm text-gray-900 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                Risk Assessments (falls, choking, capacity)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="dnacpr"
                {...registerAttachments('dnacpr')}
                onChange={(e) => handleAttachmentChange('dnacpr', e.target.checked)}
                disabled={readOnly}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="dnacpr" className="ml-2 block text-sm text-gray-900 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                DNACPR
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="respect_form"
                {...registerAttachments('respect_form')}
                onChange={(e) => handleAttachmentChange('respect_form', e.target.checked)}
                disabled={readOnly}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="respect_form" className="ml-2 block text-sm text-gray-900 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                ReSPECT Form
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="medication_list"
                {...registerAttachments('medication_list')}
                onChange={(e) => handleAttachmentChange('medication_list', e.target.checked)}
                disabled={readOnly}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="medication_list" className="ml-2 block text-sm text-gray-900 flex items-center">
                <Pill className="w-4 h-4 mr-2 text-blue-600" />
                Medication List
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="poa_documentation"
                {...registerAttachments('poa_documentation')}
                onChange={(e) => handleAttachmentChange('poa_documentation', e.target.checked)}
                disabled={readOnly}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="poa_documentation" className="ml-2 block text-sm text-gray-900 flex items-center">
                <FileCheck className="w-4 h-4 mr-2 text-blue-600" />
                PoA Documentation
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="peep_evacuation_plan"
                {...registerAttachments('peep_evacuation_plan')}
                onChange={(e) => handleAttachmentChange('peep_evacuation_plan', e.target.checked)}
                disabled={readOnly}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="peep_evacuation_plan" className="ml-2 block text-sm text-gray-900 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                PEEP (Evacuation Plan)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="communication_passport"
                {...registerAttachments('communication_passport')}
                onChange={(e) => handleAttachmentChange('communication_passport', e.target.checked)}
                disabled={readOnly}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="communication_passport" className="ml-2 block text-sm text-gray-900 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                Communication Passport
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Complete Assessment Button */}
      {!readOnly && onCompleteAssessment && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Complete Assessment
          </h3>
          <p className="text-green-700 mb-4">
            Once you have completed all sections and reviewed the information, click the button below to finalize the assessment and generate the AI care plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onCompleteAssessment}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Assessment & Generate Care Plan
            </button>
            <button
              onClick={() => navigate('/critical-information')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Info className="w-5 h-5 mr-2" />
              View Critical Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
