import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, CheckCircle2, Info, Clock, Users, Shield, AlertTriangle } from 'lucide-react';
import { mockExamples } from '../utils/mockData';

const ExamplesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('examples');

  const handleUseExample = (example) => {
    navigate('/', { state: { exampleAnswers: example.answers } });
  };

  const handleViewResults = (example) => {
    navigate(`/analysis/${example.id}`, { 
      state: { 
        analysis: example.result,
        answers: example.answers
      } 
    });
  };

  return (
    <>
      <motion.div 
        className="relative border-b border-indigo-900/10 pb-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <FileText size={32} className="text-indigo-900" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              Example Tasks
            </h1>
            <h2 className="text-xl text-indigo-700">
              Browse sample tasks and analyses to see how AITaskLens works
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'examples' 
            ? 'border-b-2 border-indigo-900 text-indigo-900' 
            : 'text-gray-500 hover:text-indigo-900'}`}
          onClick={() => setActiveTab('examples')}
        >
          Examples
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'disclaimer' 
            ? 'border-b-2 border-indigo-900 text-indigo-900' 
            : 'text-gray-500 hover:text-indigo-900'}`}
          onClick={() => setActiveTab('disclaimer')}
        >
          Disclaimer
        </button>
      </div>

      {/* Examples Tab */}
      {activeTab === 'examples' && (
        <>
          <div className="bg-corndel-beige/30 p-4 rounded-lg flex items-start mb-8">
            <Info className="w-5 h-5 text-indigo-900 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-indigo-900 mb-1">How to use examples</h4>
              <p className="text-sm text-gray-700">
                Click "Use This Example" to pre-fill the form with sample answers for your own analysis, or "View Results" to see the analysis directly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {mockExamples.map((example, index) => (
              <motion.div 
                key={example.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.1) }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      {example.id === 'example1' && <Users className="h-5 w-5 text-indigo-900" />}
                      {example.id === 'example2' && <Clock className="h-5 w-5 text-indigo-900" />}
                      {example.id === 'example3' && <Shield className="h-5 w-5 text-indigo-900" />}
                    </div>
                    <h3 className="text-lg font-semibold text-indigo-900">{example.title}</h3>
                  </div>
                  <div className="bg-indigo-100 text-xs font-medium text-indigo-900 px-2 py-1 rounded">
                    Example {index + 1}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-900" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Classification</div>
                      <div className="text-sm font-medium">{example.result.Classification}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                      <Clock className="h-4 w-4 text-indigo-900" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Task Time</div>
                      <div className="text-sm font-medium">
                        {example.id === 'example1' && 'Daily Task'}
                        {example.id === 'example2' && 'Monthly Task'}
                        {example.id === 'example3' && 'Infrequent Task'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                  {example.answers["0"].substring(0, 150)}...
                </p>
                
                <div className="flex justify-between space-x-2 mt-4">
                  <button 
                    onClick={() => handleUseExample(example)}
                    className="flex items-center justify-center px-4 py-2 text-sm border border-indigo-900 text-indigo-900 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Use This Example
                  </button>
                  
                  <button 
                    onClick={() => handleViewResults(example)}
                    className="flex items-center justify-center px-4 py-2 text-sm bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors"
                  >
                    View Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Disclaimer Tab */}
      {activeTab === 'disclaimer' && (
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
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
      )}
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Ready to analyse your own task? <a href="/" className="text-indigo-900 hover:underline">Go to the form</a>.
        </p>
      </div>
    </>
  );
};

export default ExamplesPage;