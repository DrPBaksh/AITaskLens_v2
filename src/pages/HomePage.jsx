import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import QuestionForm from '../components/QuestionForm';
import { mockAnalysisResponse } from '../utils/mockData';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [analysisId, setAnalysisId] = useState(null);
  const [initialAnswers, setInitialAnswers] = useState({});
  const [activeTab, setActiveTab] = useState('form');

  // Check for example answers in location state
  useEffect(() => {
    if (location.state?.exampleAnswers) {
      setInitialAnswers(location.state.exampleAnswers);
      // Clear the location state to avoid reloading on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (answers) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the API
      // const response = await api.analyzeTask(answers);
      
      // For now, we'll use mock data and simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const response = {
        id: 'analysis-' + Date.now(),
        ...mockAnalysisResponse
      };
      
      setAnalysisId(response.id);
      setSuccess(true);
      
      // Navigate to the analysis page after a short delay
      setTimeout(() => {
        navigate(`/analysis/${response.id}`, { 
          state: { 
            analysis: response,
            answers
          } 
        });
      }, 1500);
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div 
        className="relative border-b border-corndel-purple/10 pb-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              AITaskLens
            </h1>
            <h2 className="text-xl text-indigo-700">
              Analyse and classify business tasks for optimal automation strategies
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'form' 
            ? 'border-b-2 border-indigo-900 text-indigo-900' 
            : 'text-gray-500 hover:text-indigo-900'}`}
          onClick={() => setActiveTab('form')}
        >
          Task Analysis
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

      {/* Task Analysis Form Tab */}
      {activeTab === 'form' && (
        <>
          {/* Enhanced Description */}
          <motion.div
            className="bg-indigo-50 p-6 rounded-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Why Task Analysis Matters</h3>
            <p className="text-gray-700 mb-4">
              As AI capabilities rapidly evolve, understanding which tasks are suitable for automation and which still require human expertise becomes increasingly critical. AITaskLens helps you systematically evaluate each business task across multiple dimensions to determine the optimal balance between technology and human involvement.
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start mb-6"
            >
              <AlertCircle className="mr-2 h-5 w-5 text-red-500 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6 text-center my-8"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Analysis Complete!</h3>
              <p className="text-green-700">
                Redirecting you to the detailed results...
              </p>
            </motion.div>
          ) : (
            <QuestionForm onSubmit={handleSubmit} loading={loading} initialAnswers={initialAnswers} />
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need inspiration? Check out our <a href="/examples" className="text-corndel-purple hover:underline">examples</a>.
            </p>
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
      )}
    </>
  );
};

export default HomePage;