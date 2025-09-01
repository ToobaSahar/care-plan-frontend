import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { socialEmotionalSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { Heart, Palette, Clock, Church, Brain } from 'lucide-react';

interface Section6SocialEmotionalWellbeingProps {
  isReadOnly?: boolean;
}

export const Section6SocialEmotionalWellbeing: React.FC<Section6SocialEmotionalWellbeingProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('socialEmotional');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ [k: string]: any }>({
    resolver: zodResolver(socialEmotionalSchema),
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

  const WellbeingArea: React.FC<{
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
      <div className="grid grid-cols-1 gap-4">
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
    </div>
  );

  if (isReadOnly) {
    return (
      <div className="space-y-6">
        <WellbeingArea 
          title="Family Involvement" 
          notesField="family_involvement_notes" 
          icon={<Heart className="h-5 w-5 text-red-600" />}
          notesPlaceholder="Daughter visits 4x/week, very involved"
        />
        <WellbeingArea 
          title="Hobbies / Interests" 
          notesField="hobbies_interests_notes" 
          icon={<Palette className="h-5 w-5 text-green-600" />}
          notesPlaceholder="Gardening, cricket on TV, word searches"
        />
        <WellbeingArea 
          title="Routine Preferences" 
          notesField="routine_preferences_notes" 
          icon={<Clock className="h-5 w-5 text-blue-600" />}
          notesPlaceholder="Tea at 7 AM, prefers evening bath"
        />
        <WellbeingArea 
          title="Spiritual or Religious Support" 
          notesField="spiritual_religious_support_notes" 
          icon={<Church className="h-5 w-5 text-purple-600" />}
          notesPlaceholder="Watches televised Sunday service"
        />
        <WellbeingArea 
          title="Emotional / Mental Health Support Needs" 
          notesField="emotional_mental_health_support_needs_notes" 
          icon={<Brain className="h-5 w-5 text-indigo-600" />}
          notesPlaceholder="Enjoys 1:1 conversation and music for mood regulation"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <WellbeingArea 
        title="Family Involvement" 
        notesField="family_involvement_notes" 
        icon={<Heart className="h-5 w-5 text-red-600" />}
        notesPlaceholder="Daughter visits 4x/week, very involved"
      />

      <WellbeingArea 
        title="Hobbies / Interests" 
        notesField="hobbies_interests_notes" 
        icon={<Palette className="h-5 w-5 text-green-600" />}
        notesPlaceholder="Gardening, cricket on TV, word searches"
      />

      <WellbeingArea 
        title="Routine Preferences" 
        notesField="routine_preferences_notes" 
        icon={<Clock className="h-5 w-5 text-blue-600" />}
        notesPlaceholder="Tea at 7 AM, prefers evening bath"
      />

      <WellbeingArea 
        title="Spiritual or Religious Support" 
        notesField="spiritual_religious_support_notes" 
        icon={<Church className="h-5 w-5 text-purple-600" />}
        notesPlaceholder="Watches televised Sunday service"
      />

      <WellbeingArea 
        title="Emotional / Mental Health Support Needs" 
        notesField="emotional_mental_health_support_needs_notes" 
        icon={<Brain className="h-5 w-5 text-indigo-600" />}
        notesPlaceholder="Enjoys 1:1 conversation and music for mood regulation"
      />

    </form>
  );
};
