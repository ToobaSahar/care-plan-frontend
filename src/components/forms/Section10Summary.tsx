import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signaturesSchema, optionalAttachmentsSchema } from '../../schema/assessment';
import { useAssessment, useCurrentSectionData } from '../../state/useAssessment';
import { User, CheckCircle, FileText, Shield, Pill, FileCheck, Users, MessageSquare, Info } from 'lucide-react';
import type { Signatures, OptionalAttachments } from '../../schema/assessment';
import { useNavigate } from 'react-router-dom';
import { DateField } from '../ui';

interface Section10SummaryProps {
  readOnly?: boolean;
  onCompleteAssessment?: () => void;
}

export const Section10Summary: React.FC<Section10SummaryProps> = ({ readOnly = false, onCompleteAssessment }) => {
  const navigate = useNavigate();
  // The pack is addressed by record. Without the id it falls back to the most
  // recently added service user, who is not reliably the person on screen.
  const assessmentId = useAssessment((state) => state.currentAssessment?.id);
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
        <div className="pt-1">
          <h3 className="cf-group-title">Signatures</h3>
          <div className="cf-grid">
            <div>
              <label className="cf-label">Assessor Name</label>
              <p className="cf-value">{signaturesData?.assessor_name || '-'}</p>
            </div>
            <div>
              <label className="cf-label">Assessor Date</label>
              <p className="cf-value">{signaturesData?.assessor_date || '-'}</p>
            </div>
            <div>
              <label className="cf-label">Individual/Representative Name</label>
              <p className="cf-value">{signaturesData?.individual_representative_name || '-'}</p>
            </div>
            <div>
              <label className="cf-label">Individual/Representative Date</label>
              <p className="cf-value">{signaturesData?.individual_representative_date || '-'}</p>
            </div>
          </div>
        </div>

        {/* Optional Attachments Read Only */}
        <div className="border-t border-oat-200 pt-6">
          <h3 className="cf-group-title">Optional Attachments</h3>
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
        <div className="pt-1">
          <h3 className="cf-group-title">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            Signatures
          </h3>
          
          <div className="cf-grid">
            {/* Assessor Information */}
            <div className="space-y-4">
              <h4 className="cf-subtitle">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Assessor
              </h4>
              
              <div>
                <label className="cf-label">
                  Name
                </label>
                <input
                  type="text"
                  {...registerSignatures('assessor_name')}
                  onChange={(e) => handleSignatureChange('assessor_name', e.target.value)}
                  disabled={readOnly}
                  className="cf-input"
                  placeholder="Enter assessor name"
                />
                {signatureErrors.assessor_name && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.assessor_name.message}</p>
                )}
              </div>

              <div>
                <label className="cf-label">
                  Signature
                </label>
                <textarea
                  {...registerSignatures('assessor_signature')}
                  onChange={(e) => handleSignatureChange('assessor_signature', e.target.value)}
                  disabled={readOnly}
                  rows={3}
                  className="cf-input"
                  placeholder="Digital signature or signature notes"
                />
                {signatureErrors.assessor_signature && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.assessor_signature.message}</p>
                )}
              </div>

              <div>
                <label className="cf-label">
                  Date
                </label>
                <DateField
                  name="assessor_date"
                  value={(signaturesData as any)?.assessor_date ?? ''}
                  disabled={readOnly}
                  onValueChange={(v) => {
                    setSignatureValue('assessor_date', v);
                    handleSignatureChange('assessor_date', v);
                  }}
                />
                {signatureErrors.assessor_date && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.assessor_date.message}</p>
                )}
              </div>
            </div>

            {/* Individual/Representative Information */}
            <div className="space-y-4">
              <h4 className="cf-subtitle">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Individual / Representative
              </h4>
              
              <div>
                <label className="cf-label">
                  Name
                </label>
                <input
                  type="text"
                  {...registerSignatures('individual_representative_name')}
                  onChange={(e) => handleSignatureChange('individual_representative_name', e.target.value)}
                  disabled={readOnly}
                  className="cf-input"
                  placeholder="Enter individual or representative name"
                />
                {signatureErrors.individual_representative_name && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.individual_representative_name.message}</p>
                )}
              </div>

              <div>
                <label className="cf-label">
                  Signature
                </label>
                <textarea
                  {...registerSignatures('individual_representative_signature')}
                  onChange={(e) => handleSignatureChange('individual_representative_signature', e.target.value)}
                  disabled={readOnly}
                  rows={3}
                  className="cf-input"
                  placeholder="Digital signature or signature notes"
                />
                {signatureErrors.individual_representative_signature && (
                  <p className="mt-1 text-sm text-red-600">{signatureErrors.individual_representative_signature.message}</p>
                )}
              </div>

              <div>
                <label className="cf-label">
                  Date
                </label>
                <DateField
                  name="individual_representative_date"
                  value={(signaturesData as any)?.individual_representative_date ?? ''}
                  disabled={readOnly}
                  onValueChange={(v) => {
                    setSignatureValue('individual_representative_date', v);
                    handleSignatureChange('individual_representative_date', v);
                  }}
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
        <div className="border-t border-oat-200 pt-6">
          <h3 className="cf-group-title">
            <FileCheck className="w-5 h-5 mr-2 text-gray-600" />
            Optional Attachments
          </h3>
          
          <div className="cf-grid">
            <div className="cf-check-row">
              <input
                type="checkbox"
                id="risk_assessments"
                {...registerAttachments('risk_assessments')}
                onChange={(e) => handleAttachmentChange('risk_assessments', e.target.checked)}
                disabled={readOnly}
                className="cf-check"
              />
              <label htmlFor="risk_assessments" className="cf-check-label">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                Risk Assessments (falls, choking, capacity)
              </label>
            </div>

            <div className="cf-check-row">
              <input
                type="checkbox"
                id="dnacpr"
                {...registerAttachments('dnacpr')}
                onChange={(e) => handleAttachmentChange('dnacpr', e.target.checked)}
                disabled={readOnly}
                className="cf-check"
              />
              <label htmlFor="dnacpr" className="cf-check-label">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                DNACPR
              </label>
            </div>

            <div className="cf-check-row">
              <input
                type="checkbox"
                id="respect_form"
                {...registerAttachments('respect_form')}
                onChange={(e) => handleAttachmentChange('respect_form', e.target.checked)}
                disabled={readOnly}
                className="cf-check"
              />
              <label htmlFor="respect_form" className="cf-check-label">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                ReSPECT Form
              </label>
            </div>

            <div className="cf-check-row">
              <input
                type="checkbox"
                id="medication_list"
                {...registerAttachments('medication_list')}
                onChange={(e) => handleAttachmentChange('medication_list', e.target.checked)}
                disabled={readOnly}
                className="cf-check"
              />
              <label htmlFor="medication_list" className="cf-check-label">
                <Pill className="w-4 h-4 mr-2 text-blue-600" />
                Medication List
              </label>
            </div>

            <div className="cf-check-row">
              <input
                type="checkbox"
                id="poa_documentation"
                {...registerAttachments('poa_documentation')}
                onChange={(e) => handleAttachmentChange('poa_documentation', e.target.checked)}
                disabled={readOnly}
                className="cf-check"
              />
              <label htmlFor="poa_documentation" className="cf-check-label">
                <FileCheck className="w-4 h-4 mr-2 text-blue-600" />
                PoA Documentation
              </label>
            </div>

            <div className="cf-check-row">
              <input
                type="checkbox"
                id="peep_evacuation_plan"
                {...registerAttachments('peep_evacuation_plan')}
                onChange={(e) => handleAttachmentChange('peep_evacuation_plan', e.target.checked)}
                disabled={readOnly}
                className="cf-check"
              />
              <label htmlFor="peep_evacuation_plan" className="cf-check-label">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                PEEP (Evacuation Plan)
              </label>
            </div>

            <div className="cf-check-row">
              <input
                type="checkbox"
                id="communication_passport"
                {...registerAttachments('communication_passport')}
                onChange={(e) => handleAttachmentChange('communication_passport', e.target.checked)}
                disabled={readOnly}
                className="cf-check"
              />
              <label htmlFor="communication_passport" className="cf-check-label">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                Communication Passport
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Complete Assessment Button */}
      {!readOnly && onCompleteAssessment && (
        <div className="cf-callout">
          <h3 className="cf-group-title mb-2">
            <CheckCircle className="w-5 h-5 mr-2 text-teal-600" />
            Complete Assessment
          </h3>
          <p className="mb-5 max-w-prose text-base leading-6 text-teal-900/80">
            Once you have completed all sections and reviewed the information, click the button below to finalize the assessment and generate the AI care plan.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={onCompleteAssessment}
              className="cf-btn cf-btn-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Assessment & Generate Care Plan
            </button>
            <button
              onClick={() =>
                navigate(
                  assessmentId
                    ? `/critical-information?userId=${encodeURIComponent(assessmentId)}`
                    : '/critical-information',
                )
              }
              className="cf-btn cf-btn-lg cf-btn-secondary"
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
