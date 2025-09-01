import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { risksSafeguardingSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { Shield, AlertTriangle, Heart, Pill, UserCheck, FileText } from 'lucide-react';

interface Section5RisksSafeguardingProps {
  isReadOnly?: boolean;
}

export const Section5RisksSafeguarding: React.FC<Section5RisksSafeguardingProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('risksSafeguarding');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ [k: string]: any }>({
    resolver: zodResolver(risksSafeguardingSchema),
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
    console.log(`🔍 Section5RisksSafeguarding: Updating field ${field} with value:`, value);
    setValue(field as any, value);
  };

  const handleBlur = (field: string, value: any) => {
    console.log(`🔍 Section5RisksSafeguarding: Blur event for field ${field} with value:`, value);
    updateData({ [field]: value } as any);
  };

  const RiskArea: React.FC<{
    title: string;
    riskField: string;
    notesField: string;
    icon: React.ReactNode;
    notesPlaceholder: string;
  }> = ({ title, riskField, notesField, icon, notesPlaceholder }) => (
    <div className="border rounded-lg p-4">
      <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Risk Present</label>
                     <select
             {...register(riskField)}
             onChange={(e) => handleChange(riskField, e.target.value)}
             onBlur={(e) => handleBlur(riskField, e.target.value)}
             disabled={isReadOnly}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
           >
            <option value="">Select...</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div className="md:col-span-2">
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
        <RiskArea 
          title="Risk of Falls" 
          riskField="risk_of_falls" 
          notesField="risk_of_falls_notes" 
          icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
          notesPlaceholder="Yes – prevention plan in place"
        />
        <RiskArea 
          title="Choking Risk" 
          riskField="choking_risk" 
          notesField="choking_risk_notes" 
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          notesPlaceholder="Yes – SALT recommendations followed"
        />
        <RiskArea 
          title="Pressure Sores / Skin" 
          riskField="pressure_sores_skin" 
          notesField="pressure_sores_skin_notes" 
          icon={<Heart className="h-5 w-5 text-green-600" />}
          notesPlaceholder="No current issues, heels checked daily"
        />
        <RiskArea 
          title="Self-Neglect" 
          riskField="self_neglect" 
          notesField="self_neglect_notes" 
          icon={<UserCheck className="h-5 w-5 text-blue-600" />}
          notesPlaceholder="No – engages well with carers"
        />
        <RiskArea 
          title="Medication Risk Assessment" 
          riskField="medication_risk_assessment" 
          notesField="medication_risk_assessment" 
          icon={<Pill className="h-5 w-5 text-purple-600" />}
          notesPlaceholder="Needs full support with meds"
        />
        <RiskArea 
          title="Safeguarding Concerns" 
          riskField="safeguarding_concerns" 
          notesField="safeguarding_concerns_notes" 
          icon={<Shield className="h-5 w-5 text-indigo-600" />}
          notesPlaceholder="No concerns"
        />
        <div className="border rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="ml-2">Mental Capacity / DoLS</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Assessment Details</label>
              <textarea
                {...register('mental_capacity_dols')}
                onChange={(e) => handleChange('mental_capacity_dols', e.target.value)}
                onBlur={(e) => handleBlur('mental_capacity_dols', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                placeholder="e.g., No DoLS; has capacity"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
              />
            </div>
          </div>
        </div>
        <RiskArea 
          title="Personal Evacuation Plan [Fire Risk Assessment]" 
          riskField="personal_evacuation_plan" 
          notesField="personal_evacuation_plan_notes" 
          icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
          notesPlaceholder="Yes – PEEP completed; frame accessible near exits"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <RiskArea 
        title="Risk of Falls" 
        riskField="risk_of_falls" 
        notesField="risk_of_falls_notes" 
        icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
        notesPlaceholder="Yes – prevention plan in place"
      />

      <RiskArea 
        title="Choking Risk" 
        riskField="choking_risk" 
        notesField="choking_risk_notes" 
        icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
        notesPlaceholder="Yes – SALT recommendations followed"
      />

      <RiskArea 
        title="Pressure Sores / Skin" 
        riskField="pressure_sores_skin" 
        notesField="pressure_sores_skin_notes" 
        icon={<Heart className="h-5 w-5 text-green-600" />}
        notesPlaceholder="No current issues, heels checked daily"
      />

      <RiskArea 
        title="Self-Neglect" 
        riskField="self_neglect" 
        notesField="self_neglect_notes" 
        icon={<UserCheck className="h-5 w-5 text-blue-600" />}
        notesPlaceholder="No – engages well with carers"
      />

      <div className="border rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
          <Pill className="h-5 w-5 text-purple-600" />
          <span className="ml-2">Medication Risk Assessment</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Assessment Details</label>
                         <textarea
               {...register('medication_risk_assessment')}
               onChange={(e) => handleChange('medication_risk_assessment', e.target.value)}
               onBlur={(e) => handleBlur('medication_risk_assessment', e.target.value)}
               disabled={isReadOnly}
               rows={3}
               placeholder="e.g., Needs full support with meds"
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
             />
          </div>
        </div>
      </div>

      <RiskArea 
        title="Safeguarding Concerns" 
        riskField="safeguarding_concerns" 
        notesField="safeguarding_concerns_notes" 
        icon={<Shield className="h-5 w-5 text-indigo-600" />}
        notesPlaceholder="No concerns"
      />

      <div className="border rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
          <FileText className="h-5 w-5 text-gray-600" />
          <span className="ml-2">Mental Capacity / DoLS</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Assessment Details</label>
            <textarea
              {...register('mental_capacity_dols')}
              onChange={(e) => handleChange('mental_capacity_dols', e.target.value)}
              onBlur={(e) => handleBlur('mental_capacity_dols', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="e.g., No DoLS; has capacity"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            />
          </div>
        </div>
      </div>

      <RiskArea 
        title="Personal Evacuation Plan [Fire Risk Assessment]" 
        riskField="personal_evacuation_plan" 
        notesField="personal_evacuation_plan_notes" 
        icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
        notesPlaceholder="Yes – PEEP completed; frame accessible near exits"
      />

    </form>
  );
};
