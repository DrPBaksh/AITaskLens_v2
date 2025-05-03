import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const DisclaimerPage = () => {
  return (
    <>
      <motion.div 
        className="relative border-b border-indigo-900/10 pb-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              Disclaimer
            </h1>
            <h2 className="text-xl text-indigo-700">
              Important information about AITaskLens
            </h2>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">The Boring Bits / Disclaimer</h3>
            <p className="text-gray-600 mb-4">
              Please read the following important information about AITaskLens:
            </p>
          </div>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-1">This app is not guidance</p>
            <p className="text-sm">The analysis provided by AITaskLens is for informational purposes only and should not be considered as professional guidance or advice.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-1">Limitation of Liability</p>
            <p className="text-sm">Peter Baksh copyright does not claim any responsibility for your actions based on the information provided by this application.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-1">Data Processing</p>
            <p className="text-sm">
              This app is hosted within the UK. Information you send to this app is not stored, however it is processed in the USA via the OpenAI API. 
              <a href="https://openai.com/policies/trust-center" target="_blank" rel="noopener noreferrer" className="text-indigo-900 hover:underline ml-1">
                Link to OpenAI Trust Portal
              </a>.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-1">Data Usage</p>
            <p className="text-sm">Your data is not used to retrain any OpenAI model.</p>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Ready to analyse a task? <a href="/" className="text-indigo-900 hover:underline">Go to the form</a>.
        </p>
      </div>
    </>
  );
};

export default DisclaimerPage;