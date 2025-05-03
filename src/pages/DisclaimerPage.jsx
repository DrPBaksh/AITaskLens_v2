import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Shield, Globe, Database, Copyright } from 'lucide-react';

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
              Important legal and data processing information
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
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">Official Disclaimer</h3>
            <p className="text-gray-600 mb-4">
              Please review the following important information before using AITaskLens:
            </p>
          </div>
        </div>

        <div className="space-y-6 text-gray-700">


          <div className="p-5 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-amber-600 mr-2" />
              <p className="font-semibold text-amber-800">Limitation of Liability</p>
            </div>
            <p className="text-sm">
              The analysis provided by AITaskLens is for informational purposes only and should not be considered as professional guidance or advice. <span className="font-medium text-amber-700">Peter Baksh does not claim any responsibility</span> for decisions or actions taken based on the information provided by this application. Use at your own risk.
            </p>
          </div>

          <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center mb-3">
              <Globe className="h-5 w-5 text-blue-600 mr-2" />
              <p className="font-semibold text-blue-800">Data Processing</p>
            </div>
            <p className="text-sm">
              This application is <span className="font-medium text-blue-700">hosted within the United Kingdom</span>. However, please be aware that information you send to this application is <span className="font-medium text-blue-700">processed in the United States</span> via the OpenAI API. By using this application, you consent to the cross-border transfer of your data.
              <a href="https://openai.com/policies/trust-center" target="_blank" rel="noopener noreferrer" className="text-indigo-900 hover:underline ml-1 block mt-2">
                OpenAI Trust Portal →
              </a>
            </p>
          </div>

          <div className="p-5 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center mb-3">
              <Database className="h-5 w-5 text-green-600 mr-2" />
              <p className="font-semibold text-green-800">Data Retention & Usage</p>
            </div>
            <p className="text-sm">
              AITaskLens <span className="font-medium text-green-700">does not permanently store</span> the information you submit. Your data is <span className="font-medium text-green-700">not used to retrain any OpenAI model</span> and is only processed for the purpose of providing you with task analysis results. This application adheres to data minimization principles.
            
            </p>
          </div>
        


        <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <Copyright className="h-5 w-5 text-indigo-700 mr-2" />
              <p className="font-semibold text-indigo-900">Intellectual Property</p>
            </div>
            <p className="text-sm">
              <span className="font-medium">AITaskLens</span> and all related intellectual property rights are owned exclusively by <span className="font-medium text-indigo-700">Peter Baksh</span>. All content, design, and functionality of this application are protected by copyright laws. Unauthorized use, reproduction, or distribution is strictly prohibited.
            </p>
          </div>
          </div>


      </motion.div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          By continuing to use AITaskLens, you acknowledge and agree to these terms.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <a href="/" className="text-indigo-900 hover:underline">Return to task analysis</a>
        </p>
      </div>
    </>
  );
};

export default DisclaimerPage;