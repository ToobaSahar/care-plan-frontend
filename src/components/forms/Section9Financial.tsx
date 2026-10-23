import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { optionalAreasSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { CreditCard, Users, Monitor, Shield, Heart, UserCheck } from 'lucide-react';

interface Section9OptionalAreasProps {
  isReadOnly?: boolean;
}

export const Section9OptionalAreas: React.FC<Section9OptionalAreasProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('optionalAreas');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(optionalAreasSchema),
    defaultValues: data || {},
  });

  // Keep the form in step with the record when it is loaded or changed
  // elsewhere. This only ever writes into react-hook-form; the store is
  // written from the field handlers below, so the two cannot loop.
  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof typeof data, value);
      });
    }
  }, [data, setValue]);

  const onSubmit = (formData: any) => {
    updateData(formData);
  };

  /**
   * Every keystroke reaches the store, through react-hook-form's own change
   * handler rather than an `onChange` prop that would replace it.
   *
   * Reaching the store is what makes an answer real: the store is what
   * `saveSection` writes and what the section gate validates. An earlier
   * version set the value on the form and forwarded it to the store only
   * while the form reported itself dirty — but `setValue` does not mark a
   * form dirty, so that never held and nothing typed here was recorded.
   *
   * The other sections register their handlers the same way; see Section 1
   * and Section 3.
   */
  const fieldProps = (field: keyof typeof data) =>
    register(field, {
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        updateData({ [field]: e.target.value }),
    });

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Financial Management Needs */}
        <div className="cf-group">
          <h4 className="cf-group-title">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Financial Management Needs
          </h4>
          <div>
            <label className="cf-label">
              Notes
            </label>
            <textarea
              {...fieldProps('financial_management_needs')}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any financial management needs or support required"
              className="cf-input"
            />
            {errors.financial_management_needs && (
              <p className="mt-1 text-sm text-red-600">{errors.financial_management_needs.message}</p>
            )}
          </div>
        </div>

        {/* Equality, Diversity, Inclusion (EDI) Considerations */}
        <div className="cf-group">
          <h4 className="cf-group-title">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Equality, Diversity, Inclusion (EDI) Considerations
          </h4>
          <div>
            <label className="cf-label">
              Notes
            </label>
            <textarea
              {...fieldProps('equality_diversity_inclusion_edi_considerations')}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any EDI considerations or needs"
              className="cf-input"
            />
            {errors.equality_diversity_inclusion_edi_considerations && (
              <p className="mt-1 text-sm text-red-600">{errors.equality_diversity_inclusion_edi_considerations.message}</p>
            )}
          </div>
        </div>

        {/* Assistive Technology / Equipment */}
        <div className="cf-group">
          <h4 className="cf-group-title">
            <Monitor className="h-5 w-5 mr-2 text-blue-600" />
            Assistive Technology / Equipment
          </h4>
          <div>
            <label className="cf-label">
              Notes
            </label>
            <textarea
              {...fieldProps('assistive_technology_equipment')}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any assistive technology or equipment needs"
              className="cf-input"
            />
            {errors.assistive_technology_equipment && (
              <p className="mt-1 text-sm text-red-600">{errors.assistive_technology_equipment.message}</p>
            )}
          </div>
        </div>

        {/* Legal Orders or Restrictions */}
        <div className="cf-group">
          <h4 className="cf-group-title">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Legal Orders or Restrictions
          </h4>
          <div>
            <label className="cf-label">
              Notes
            </label>
            <textarea
              {...fieldProps('legal_orders_or_restrictions')}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any legal restrictions or court orders"
              className="cf-input"
            />
            {errors.legal_orders_or_restrictions && (
              <p className="mt-1 text-sm text-red-600">{errors.legal_orders_or_restrictions.message}</p>
            )}
          </div>
        </div>

        {/* Sexuality and Relationships */}
        <div className="cf-group">
          <h4 className="cf-group-title">
            <Heart className="h-5 w-5 mr-2 text-blue-600" />
            Sexuality and Relationships
          </h4>
          <div>
            <label className="cf-label">
              Notes
            </label>
            <textarea
              {...fieldProps('sexuality_and_relationships')}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any sexuality or relationship support needs"
              className="cf-input"
            />
            {errors.sexuality_and_relationships && (
              <p className="mt-1 text-sm text-red-600">{errors.sexuality_and_relationships.message}</p>
            )}
          </div>
        </div>

        {/* Access to Advocacy Services */}
        <div className="cf-group">
          <h4 className="cf-group-title">
            <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
            Access to Advocacy Services
          </h4>
          <div>
            <label className="cf-label">
              Notes
            </label>
            <textarea
              {...fieldProps('access_to_advocacy_services')}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any advocacy needs or services required"
              className="cf-input"
            />
            {errors.access_to_advocacy_services && (
              <p className="mt-1 text-sm text-red-600">{errors.access_to_advocacy_services.message}</p>
            )}
          </div>
        </div>

      </form>
    </div>
  );
};
