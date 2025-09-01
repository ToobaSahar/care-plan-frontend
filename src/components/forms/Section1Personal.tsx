import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Calendar, Hash, MapPin, Phone, Heart, AlertTriangle } from 'lucide-react';
import { personalDetailsSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import type { PersonalDetails } from '../../schema/assessment';

interface Section1PersonalProps {
  isReadOnly?: boolean;
}

export const Section1Personal: React.FC<Section1PersonalProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData<'personalDetails'>('personalDetails');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch
  } = useForm<PersonalDetails>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: data || {
      full_name: '',
      date_of_birth: '',
      nhs_number: '',
      local_authority_number: '',
      preferred_name: '',
      address_line: '',
      postcode: '',
      phone_number: '',
      gp_name: '',
      gp_contact: '',
      emergency_contact_name: '',
      emergency_contact_number: '',
      relationship_to_service_user: ''
    },
    mode: 'onChange'
  });

  // Sync form data with global state
  useEffect(() => {
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key in personalDetailsSchema.shape) {
          setValue(key as keyof PersonalDetails, value as any);
        }
      });
    }
  }, [data, setValue]);

  // Update global state when form changes
  const handleInputChange = (field: keyof PersonalDetails, value: any) => {
    setValue(field, value);
    updateData({ [field]: value });
  };

  const onSubmit = (formData: any) => {
    updateData(formData as PersonalDetails);
  };

  // NHS Number formatting
  const handleNhsNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    // Add spaces for readability
    if (value.length > 6) {
      value = value.slice(0, 6) + ' ' + value.slice(6);
    }
    if (value.length > 3) {
      value = value.slice(0, 3) + ' ' + value.slice(3);
    }
    
    setValue('nhs_number', value);
    updateData({ nhs_number: value });
  };

  // Postcode formatting
  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setValue('postcode', value);
    updateData({ postcode: value });
  };

  if (isReadOnly) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{data?.full_name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <p className="mt-1 text-sm text-gray-900">{data?.date_of_birth || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">NHS Number</label>
              <p className="mt-1 text-sm text-gray-900">{data?.nhs_number || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{data?.address_line || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              <User className="inline w-4 h-4 mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              {...register('full_name', {
                onChange: (e) => updateData({ full_name: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter full name"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
              <Calendar className="inline w-4 h-4 mr-2" />
              Date of Birth *
            </label>
            <input
              type="date"
              id="date_of_birth"
              {...register('date_of_birth', {
                onChange: (e) => updateData({ date_of_birth: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            />
            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-red-600">{errors.date_of_birth.message}</p>
            )}
          </div>

          {/* NHS Number */}
          <div>
            <label htmlFor="nhs_number" className="block text-sm font-medium text-gray-700">
              <Hash className="inline w-4 h-4 mr-2" />
              NHS Number *
            </label>
            <input
              type="text"
              id="nhs_number"
              {...register('nhs_number', {
                onChange: handleNhsNumberChange
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="123 456 7890"
              maxLength={12}
            />
            {errors.nhs_number && (
              <p className="mt-1 text-sm text-red-600">{errors.nhs_number.message}</p>
            )}
          </div>

          {/* Local Authority Number */}
          <div>
            <label htmlFor="local_authority_number" className="block text-sm font-medium text-gray-700">
              Local Authority Number
            </label>
            <input
              type="text"
              id="local_authority_number"
              {...register('local_authority_number', {
                onChange: (e) => updateData({ local_authority_number: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter LA number"
            />
          </div>

          {/* Preferred Name */}
          <div>
            <label htmlFor="preferred_name" className="block text-sm font-medium text-gray-700">
              Preferred Name
            </label>
            <input
              type="text"
              id="preferred_name"
              {...register('preferred_name', {
                onChange: (e) => updateData({ preferred_name: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter preferred name"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address_line" className="block text-sm font-medium text-gray-700">
              <MapPin className="inline w-4 h-4 mr-2" />
              Address *
            </label>
            <textarea
              id="address_line"
              {...register('address_line', {
                onChange: (e) => updateData({ address_line: e.target.value })
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter full address"
            />
            {errors.address_line && (
              <p className="mt-1 text-sm text-red-600">{errors.address_line.message}</p>
            )}
          </div>

          {/* Postcode */}
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
              Postcode
            </label>
            <input
              type="text"
              id="postcode"
              {...register('postcode', {
                onChange: handlePostcodeChange
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="e.g., SW1A 1AA"
            />
            {errors.postcode && (
              <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              <Phone className="inline w-4 h-4 mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone_number"
              {...register('phone_number', {
                onChange: (e) => updateData({ phone_number: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter phone number"
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
            )}
          </div>

          {/* GP Name */}
          <div>
            <label htmlFor="gp_name" className="block text-sm font-medium text-gray-700">
              <Heart className="inline w-4 h-4 mr-2" />
              GP Name
            </label>
            <input
              type="text"
              id="gp_name"
              {...register('gp_name', {
                onChange: (e) => updateData({ gp_name: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter GP name"
            />
          </div>

          {/* GP Contact */}
          <div>
            <label htmlFor="gp_contact" className="block text-sm font-medium text-gray-700">
              GP Contact
            </label>
            <input
              type="text"
              id="gp_contact"
              {...register('gp_contact', {
                onChange: (e) => updateData({ gp_contact: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter GP contact details"
            />
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700">
              <AlertTriangle className="inline w-4 h-4 mr-2" />
              Emergency Contact Name *
            </label>
            <input
              type="text"
              id="emergency_contact_name"
              {...register('emergency_contact_name', {
                onChange: (e) => updateData({ emergency_contact_name: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter emergency contact name"
            />
            {errors.emergency_contact_name && (
              <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_name.message}</p>
            )}
          </div>

          {/* Emergency Contact Phone */}
          <div>
            <label htmlFor="emergency_contact_number" className="block text-sm font-medium text-gray-700">
              Emergency Contact Phone *
            </label>
            <input
              type="tel"
              id="emergency_contact_number"
              {...register('emergency_contact_number', {
                onChange: (e) => updateData({ emergency_contact_number: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="Enter emergency contact phone"
            />
            {errors.emergency_contact_number && (
              <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_number.message}</p>
            )}
          </div>

          {/* Relationship */}
          <div className="md:col-span-2">
            <label htmlFor="relationship_to_service_user" className="block text-sm font-medium text-gray-700">
              Relationship to Individual *
            </label>
            <input
              type="text"
              id="relationship_to_service_user"
              {...register('relationship_to_service_user', {
                onChange: (e) => updateData({ relationship_to_service_user: e.target.value })
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              placeholder="e.g., Son, Daughter, Spouse, etc."
            />
            {errors.relationship_to_service_user && (
              <p className="mt-1 text-sm text-red-600">{errors.relationship_to_service_user.message}</p>
            )}
          </div>
        </div>
      </div>

    </form>
  );
};
