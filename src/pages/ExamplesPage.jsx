import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, CheckCircle2, Info, Clock, Users, Shield, Settings } from 'lucide-react';
import { mockExamples } from '../utils/mockData';

const ExamplesPage = () => {
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState(null);

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
        className="relative border-b border-corndel-blue/10 pb-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-4">
          <div className="bg-corndel-blue/10 p-3 rounded-lg">
            <FileText size={32} className="text-corndel-blue" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-corndel-blue mb-2">
              Example Tasks
            </h1>
            <h2 className="text-xl text-corndel-blue/70">
              Browse sample tasks and analyses to see how AITaskLens works
            </h2>
          </div>
        </div>
      </motion.div>

      <div className="bg-corndel-beige/30 p-4 rounded-lg flex items-start mb-8">
        <Info className="w-5 h-5 text-corndel-blue mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-corndel-blue mb-1">How to use examples</h4>
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
                <div className="w-10 h-10 bg-corndel-blue/10 rounded-lg flex items-center justify-center mr-3">
                  {example.id === 'example1' && <Users className="h-5 w-5 text-corndel-blue" />}
                  {example.id === 'example2' && <Settings className="h-5 w-5 text-corndel-blue" />}
                  {example.id === 'example3' && <Users className="h-5 w-5 text-corndel-blue" />}
                </div>
                <h3 className="text-lg font-semibold text-corndel-blue">{example.title}</h3>
              </div>
              <div className="bg-corndel-blue/5 text-xs font-medium text-corndel-blue px-2 py-1 rounded">
                Example {index + 1}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded flex items-center">
                <div className="w-8 h-8 bg-corndel-blue/10 rounded-full flex items-center justify-center mr-2">
                  <CheckCircle2 className="h-4 w-4 text-corndel-blue" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Classification</div>
                  <div className="text-sm font-medium">{example.result.Classification}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded flex items-center">
                <div className="w-8 h-8 bg-corndel-blue/10 rounded-full flex items-center justify-center mr-2">
                  <Clock className="h-4 w-4 text-corndel-blue" />
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
              {example.answers[0].substring(0, 150)}...
            </p>
            
            <div className="flex justify-between space-x-2 mt-4">
              <button 
                onClick={() => handleUseExample(example)}
                className="flex items-center justify-center px-4 py-2 text-sm border border-corndel-blue text-corndel-blue rounded-lg hover:bg-corndel-blue/5 transition-colors"
              >
                Use This Example
              </button>
              
              <button 
                onClick={() => handleViewResults(example)}
                className="flex items-center justify-center px-4 py-2 text-sm bg-corndel-blue text-white rounded-lg hover:bg-corndel-blue/90 transition-colors"
              >
                View Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Ready to analyze your own task? <a href="/" className="text-corndel-blue hover:underline">Go to the form</a>.
        </p>
      </div>
    </>
  );
};

export default ExamplesPage;