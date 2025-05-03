import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Tool, AlertTriangle, Lightbulb, BrainCircuit, AlertCircle } from 'lucide-react';
import { mockExamples, mockAnalysisResponse } from '../utils/mockData';

const AnalysisPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If analysis is passed in location state, use it
    if (location.state?.analysis && location.state?.answers) {
      setAnalysis(location.state.analysis);
      setAnswers(location.state.answers);
      return;
    }
    
    // Otherwise, fetch it based on ID
    setLoading(true);
    setError(null);
    
    // In a real implementation, we would fetch from API
    // For now, look for a matching example or use mock data
    const example = mockExamples.find(ex => ex.id === id);
    
    if (example) {
      setAnalysis(example.result);
      setAnswers(example.answers);
    } else {
      // Use mock data as fallback
      setAnalysis(mockAnalysisResponse);
      setAnswers({
        0: "This is a sample task description that was analyzed.",
        // Other answers would be included here
      });
    }
    
    setLoading(false);
  }, [id, location]);

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Fully Automated (Rules-Based)':
        return 'bg-blue-100 text-blue-800';
      case 'Fully Automated (AI-Based)':
        return 'bg-purple-100 text-purple-800';
      case 'AI Agent with Human Oversight (Human-in-the-Loop)':
        return 'bg-teal-100 text-teal-800';
      case 'Human-Driven with AI Assistance':
        return 'bg-amber-100 text-amber-800';
      case 'Generative AI Task (Human-Directed Prompting)':
        return 'bg-orange-100 text-orange-800';
      case 'Human-Only':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-corndel-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <div className="flex items-center mb-3">
          <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
          <h3 className="text-lg font-medium">Error Loading Analysis</h3>
        </div>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 flex items-center text-red-700 hover:text-red-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to home
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
        <div className="flex items-center mb-3">
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-medium">Analysis Not Found</h3>
        </div>
        <p>The analysis you're looking for could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 flex items-center text-yellow-700 hover:text-yellow-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to home
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-600 hover:text-corndel-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="border-b border-corndel-blue/10 pb-6">
          <div className="flex items-start gap-4">
            <div className="bg-corndel-blue/10 p-3 rounded-lg">
              <BrainCircuit size={32} className="text-corndel-blue" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-corndel-blue">
                  Analysis Results
                </h1>
                <div className={`text-xs font-medium px-3 py-1 rounded-full ${getClassificationColor(analysis.Classification)}`}>
                  {analysis.Classification}
                </div>
              </div>
              <h2 className="text-lg text-corndel-blue/70">
                Based on your task description, here's our recommended approach
              </h2>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-corndel-blue/10 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle2 className="h-5 w-5 text-corndel-blue" />
              </div>
              <h3 className="text-xl font-semibold text-corndel-blue">Recommendation Analysis</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="text-base font-medium text-gray-700 mb-2">Classification</h4>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getClassificationColor(analysis.Classification)}`}>
                {analysis.Classification}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-base font-medium text-gray-700 mb-2">Analysis</h4>
              <p className="text-gray-600">
                {analysis.Reasoning}
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-corndel-blue/10 rounded-lg flex items-center justify-center mr-3">
                  <Tool className="h-5 w-5 text-corndel-blue" />
                </div>
                <h3 className="text-lg font-semibold text-corndel-blue">Recommended Tools</h3>
              </div>
              
              <ul className="space-y-2">
                {analysis.Tools && analysis.Tools.map((tool, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-corndel-blue/10 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{tool}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-corndel-blue">Considerations</h3>
              </div>
              
              <ul className="space-y-2">
                {analysis.PotentialConsiderations && analysis.PotentialConsiderations.map((consideration, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{consideration}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-corndel-beige rounded-lg flex items-center justify-center mr-3">
                <Lightbulb className="h-5 w-5 text-corndel-orange" />
              </div>
              <h3 className="text-lg font-semibold text-corndel-blue">Task Summary</h3>
            </div>
            
            <div className="text-gray-600 mb-4 max-h-48 overflow-y-auto">
              <p className="mb-2">{answers[0]}</p>
            </div>
            
            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center px-4 py-2 border border-corndel-blue text-corndel-blue rounded-lg hover:bg-corndel-blue/5 transition-colors"
              >
                Analyze Another Task
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-corndel-blue/5 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-corndel-blue mb-3">About the Classification</h3>
            
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Fully Automated (Rules-Based):</strong> Tasks with clear rules, structured data, and minimal variation.
              </p>
              <p className="mb-2">
                <strong>Fully Automated (AI-Based):</strong> Tasks requiring pattern recognition or learning from data.
              </p>
              <p className="mb-2">
                <strong>AI Agent with Human Oversight:</strong> Complex tasks where AI can handle most cases but humans verify or handle exceptions.
              </p>
              <p className="mb-2">
                <strong>Human-Driven with AI Assistance:</strong> Tasks where human judgment is primary but AI tools enhance productivity.
              </p>
              <p className="mb-2">
                <strong>Generative AI Task:</strong> Creative or analytical tasks where humans direct AI to generate content or insights.
              </p>
              <p>
                <strong>Human-Only:</strong> Tasks requiring complex judgment, empathy, or accountability that can't be automated.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AnalysisPage;