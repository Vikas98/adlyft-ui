import React from 'react';
import { Check } from 'lucide-react';

export default function CampaignStepper({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                isCompleted ? 'bg-primary-600 border-primary-600 text-white' :
                isActive ? 'border-primary-600 text-primary-600 bg-white' :
                'border-gray-200 text-gray-400 bg-white'
              }`}>
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={`mt-1.5 text-xs font-medium hidden sm:block ${isActive ? 'text-primary-600' : isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
