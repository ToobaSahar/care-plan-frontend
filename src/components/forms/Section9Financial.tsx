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
    formState: { errors, isDirty },
    watch,
  } = useForm({
    resolver: zodResolver(optionalAreasSchema),
    defaultValues: data || {},
  });

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

  const handleInputChange = (field: keyof typeof data, value: any) => {
    setValue(field, value);
    if (isDirty) {
      updateData({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Financial Management Needs */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Financial Management Needs
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register('financial_management_needs')}
              onChange={(e) => handleInputChange('financial_management_needs', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any financial management needs or support required"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            {errors.financial_management_needs && (
              <p className="mt-1 text-sm text-red-600">{errors.financial_management_needs.message}</p>
            )}
          </div>
        </div>

        {/* Equality, Diversity, Inclusion (EDI) Considerations */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Equality, Diversity, Inclusion (EDI) Considerations
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register('equality_diversity_inclusion_edi_considerations')}
              onChange={(e) => handleInputChange('equality_diversity_inclusion_edi_considerations', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any EDI considerations or needs"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            {errors.equality_diversity_inclusion_edi_considerations && (
              <p className="mt-1 text-sm text-red-600">{errors.equality_diversity_inclusion_edi_considerations.message}</p>
            )}
          </div>
        </div>

        {/* Assistive Technology / Equipment */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-blue-600" />
            Assistive Technology / Equipment
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register('assistive_technology_equipment')}
              onChange={(e) => handleInputChange('assistive_technology_equipment', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any assistive technology or equipment needs"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            {errors.assistive_technology_equipment && (
              <p className="mt-1 text-sm text-red-600">{errors.assistive_technology_equipment.message}</p>
            )}
          </div>
        </div>

        {/* Legal Orders or Restrictions */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Legal Orders or Restrictions
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register('legal_orders_or_restrictions')}
              onChange={(e) => handleInputChange('legal_orders_or_restrictions', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any legal restrictions or court orders"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            {errors.legal_orders_or_restrictions && (
              <p className="mt-1 text-sm text-red-600">{errors.legal_orders_or_restrictions.message}</p>
            )}
          </div>
        </div>

        {/* Sexuality and Relationships */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-blue-600" />
            Sexuality and Relationships
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register('sexuality_and_relationships')}
              onChange={(e) => handleInputChange('sexuality_and_relationships', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any sexuality or relationship support needs"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            {errors.sexuality_and_relationships && (
              <p className="mt-1 text-sm text-red-600">{errors.sexuality_and_relationships.message}</p>
            )}
          </div>
        </div>

        {/* Access to Advocacy Services */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
            Access to Advocacy Services
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register('access_to_advocacy_services')}
              onChange={(e) => handleInputChange('access_to_advocacy_services', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="Describe any advocacy needs or services required"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            {errors.access_to_advocacy_services && (
              <p className="mt-1 text-sm text-red-600">{errors.access_to_advocacy_services.message}</p>
            )}
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex justify-end space-x-3 pt-6 border-t">
          </div>
        )}
      </form>
    </div>
  );
};
