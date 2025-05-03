import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import QuestionForm from '../components/QuestionForm';
import { mockAnalysisResponse } from '../utils/mockData';
// import { api } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [analysisId, setAnalysisId] = useState(null);
  const [initialAnswers, setInitialAnswers] = useState({});

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
              AI Task Lens
            </h1>
            <h2 className="text-xl text-indigo-700">
              Analyse and classify business tasks for optimal automation strategies
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Why Task Analysis Matters */}
      <motion.div
        className="bg-indigo-50 p-6 rounded-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">Why Task Analysis Matters</h3>
        <p className="text-gray-700 mb-4">
          As AI capabilities rapidly evolve, understanding which tasks are suitable for automation and which still require human expertise becomes increasingly critical. AI Task Lens helps you systematically evaluate each business task across multiple dimensions to determine the optimal balance between technology and human involvement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-100 flex flex-col">
            <h4 className="font-medium text-indigo-900 mb-2">Evolving AI Landscape</h4>
            <p className="text-sm text-gray-600">
              The capabilities of AI are changing rapidly. What required human judgement yesterday might be effectively automated today. Regular reassessment is essential.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-indigo-100 flex flex-col">
            <h4 className="font-medium text-indigo-900 mb-2">Structured Evaluation</h4>
            <p className="text-sm text-gray-600">
              Our seven-question framework helps break down tasks into their core components, revealing which aspects are suitable for automation and which require human oversight.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-indigo-100 flex flex-col">
            <h4 className="font-medium text-indigo-900 mb-2">Human-AI Partnership</h4>
            <p className="text-sm text-gray-600">
              The goal isn't to replace humans but to identify the optimal partnership between human expertise and AI capabilities, creating more effective and efficient processes.
            </p>
          </div>
        </div>
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
  );
};

export default HomePage;