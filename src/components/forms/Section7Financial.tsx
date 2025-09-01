import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { environmentLifestyleSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { Home, Heart, AlertTriangle, Users, Car, Box } from 'lucide-react';

interface Section7EnvironmentLifestyleProps {
  isReadOnly?: boolean;
}

export const Section7EnvironmentLifestyle: React.FC<Section7EnvironmentLifestyleProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('environmentLifestyle');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ [k: string]: any }>({
    resolver: zodResolver(environmentLifestyleSchema),
    defaultValues: data || {},
  });

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as any, value as any);
      });
    }
  }, [data, setValue]);

  const onSubmit = (formData: any) => {
    updateData(formData);
  };

  const handleChange = (field: string, value: any) => {
    setValue(field as any, value);
  };

  const handleBlur = (field: string, value: any) => {
    updateData({ [field]: value } as any);
  };

  const EnvironmentArea: React.FC<{
    title: string;
    notesField: string;
    icon: React.ReactNode;
    notesPlaceholder: string;
  }> = ({ title, notesField, icon, notesPlaceholder }) => (
    <div className="border rounded-lg p-4">
      <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register(notesField)}
          onChange={(e) => handleChange(notesField, e.target.value)}
          onBlur={(e) => handleBlur(notesField, e.target.value)}
          disabled={isReadOnly}
          rows={3}
          placeholder={notesPlaceholder}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
        />
      </div>
    </div>
  );

  if (isReadOnly) {
    return (
      <div className="space-y-6">
        <EnvironmentArea 
          title="Living Arrangements" 
          notesField="living_arrangements_notes" 
          icon={<Home className="h-5 w-5 text-blue-600" />}
          notesPlaceholder="Describe current living situation and any support needs"
        />
        <EnvironmentArea 
          title="Pets" 
          notesField="pets_notes" 
          icon={<Heart className="h-5 w-5 text-green-600" />}
          notesPlaceholder="Describe any pets, care needs, or desire for pets"
        />
        <EnvironmentArea 
          title="Smoking / Alcohol" 
          notesField="smoking_alcohol_notes" 
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          notesPlaceholder="Describe smoking and alcohol habits, any concerns"
        />
        <EnvironmentArea 
          title="Community Access" 
          notesField="community_access_notes" 
          icon={<Users className="h-5 w-5 text-purple-600" />}
          notesPlaceholder="Describe community involvement and access needs"
        />
        <EnvironmentArea 
          title="Transport Needs" 
          notesField="transport_needs_notes" 
          icon={<Car className="h-5 w-5 text-indigo-600" />}
          notesPlaceholder="Describe transport requirements and preferences"
        />
        <EnvironmentArea 
          title="Hoarding/Clutter" 
          notesField="hoarding_clutter_notes" 
          icon={<Box className="h-5 w-5 text-orange-600" />}
          notesPlaceholder="Describe any hoarding tendencies or clutter issues"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <EnvironmentArea 
        title="Living Arrangements" 
        notesField="living_arrangements_notes" 
        icon={<Home className="h-5 w-5 text-blue-600" />}
        notesPlaceholder="Describe current living situation and any support needs"
      />

      <EnvironmentArea 
        title="Pets" 
        notesField="pets_notes" 
        icon={<Heart className="h-5 w-5 text-green-600" />}
        notesPlaceholder="Describe any pets, care needs, or desire for pets"
      />

      <EnvironmentArea 
        title="Smoking / Alcohol" 
        notesField="smoking_alcohol_notes" 
        icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
        notesPlaceholder="Describe smoking and alcohol habits, any concerns"
      />

      <EnvironmentArea 
        title="Community Access" 
        notesField="community_access_notes" 
        icon={<Users className="h-5 w-5 text-purple-600" />}
        notesPlaceholder="Describe community involvement and access needs"
      />

      <EnvironmentArea 
        title="Transport Needs" 
        notesField="transport_needs_notes" 
        icon={<Car className="h-5 w-5 text-indigo-600" />}
        notesPlaceholder="Describe transport requirements and preferences"
      />

      <EnvironmentArea 
        title="Hoarding/Clutter" 
        notesField="hoarding_clutter_notes" 
        icon={<Box className="h-5 w-5 text-orange-600" />}
        notesPlaceholder="Describe any hoarding tendencies or clutter issues"
      />

    </form>
  );
};
