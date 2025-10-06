import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ArrowRight } from 'lucide-react';

export const BenefitCard = ({ benefit, onSelect }) => {
  return (
    <Card hover className="bg-white dark:bg-gray-800 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {benefit.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-100 mb-4 leading-relaxed min-h-[4rem]">
        {benefit.description}
      </p>

      {(benefit.coverage || benefit.eligibility) && (
        <div className="mb-6 space-y-2 text-sm">
          {benefit.coverage && (
            <div className="flex items-center gap-2">
              <Badge color="teal">{benefit.coverage}</Badge>
            </div>
          )}
          {benefit.eligibility && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">Eligibility:</span>
              <span className="text-gray-600 dark:text-gray-200">{benefit.eligibility}</span>
            </div>
          )}
        </div>
      )}

      <Button onClick={onSelect} variant="primary" size="md" className="w-full" icon={ArrowRight}>
        View Action Plan
      </Button>
    </Card>
  );
};


