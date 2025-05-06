import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, ArrowRight, BarChart2, Shield, Layers, Users, Brain, Bot, Cpu } from 'lucide-react';
import QuestionForm from '../components/QuestionForm';
import { api } from '../services/api';

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
      // Call the API to analyze the task
      const response = await api.analyzeTask({ answers });
      
      if (response.success && response.result) {
        const result = response.result;
        setAnalysisId(result.id);
        setSuccess(true);
        
        // Navigate to the analysis page after a short delay
        setTimeout(() => {
          navigate(`/analysis/${result.id}`, { 
            state: { 
              analysis: result,
              answers
            } 
          });
        }, 1500);
      } else {
        throw new Error(response.message || 'Analysis failed with no result');
      }
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  // Task classification categories
  const classifications = [
    {
      title: "Fully Automated (Rules-Based)",
      description: "Tasks with clear rules, structured data, and minimal variation.",
      icon: <Bot className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Fully Automated (AI-Based)",
      description: "Tasks requiring pattern recognition or learning from data.",
      icon: <Cpu className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "AI Agent with Human Oversight",
      description: "Complex tasks where AI can handle most cases but humans verify or handle exceptions.",
      icon: <Shield className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Human-Driven with AI Assistance",
      description: "Tasks where human judgment is primary but AI tools enhance productivity.",
      icon: <Users className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Generative AI Task",
      description: "Creative or analytical tasks where humans direct AI to generate complex insights.",
      icon: <Brain className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Human-Only",
      description: "Tasks requiring complex judgment, empathy, or accountability that can't be automated.",
      icon: <Users className="h-8 w-8 text-indigo-600" />
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <motion.div 
        className="relative border-b border-indigo-100 pb-8 mb-10 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-3 tracking-tight">
              AI Task Lens
            </h1>
            <h2 className="text-xl md:text-2xl text-indigo-700 leading-relaxed">
              Smart classification of business tasks for optimal AI automation strategies
            </h2>
            <p className="mt-4 text-gray-600 max-w-3xl">
              Answer 7 targeted questions about your business process, and our AI will suggest the ideal 
              automation approach — from fully automated to human-only — with actionable implementation strategies.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={() => document.getElementById('question-form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all shadow-md hover:shadow-lg"
              >
                Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a 
                href="/examples" 
                className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 px-6 py-3 rounded-lg font-medium flex items-center transition-all"
              >
                View Examples <FileText className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 max-w-md">
              <BarChart2 className="h-10 w-10 text-indigo-500 mb-3" />
              <h3 className="font-semibold text-indigo-800 text-lg mb-2">Instant Classification</h3>
              <p className="text-gray-600 text-sm">
                Get an immediate assessment of where your task fits in the automation spectrum, backed by 
                detailed reasoning and implementation suggestions.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">How AI Task Lens Works</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our structured approach helps you determine the optimal balance between human expertise and AI capabilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-indigo-700 font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold text-lg text-indigo-900 mb-2">Answer 7 Questions</h3>
            <p className="text-gray-600">
              Provide specific details about your business process through our targeted questionnaire
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-indigo-700 font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold text-lg text-indigo-900 mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Our AI evaluates your task across multiple dimensions to determine suitability for automation
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-indigo-700 font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold text-lg text-indigo-900 mb-2">Get Classification & Roadmap</h3>
            <p className="text-gray-600">
              Receive an automation classification with implementation strategies and next steps
            </p>
          </div>
        </div>
      </motion.div>

      {/* Classification Categories */}
      <motion.div
        className="mb-12 bg-gradient-to-b from-indigo-50 to-white rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">Task Classification Framework</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Based on your responses, we'll classify your task into one of these categories to guide your automation strategy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classifications.map((category, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-center gap-4 mb-3">
                {category.icon}
                <h3 className="font-semibold text-indigo-900">{category.title}</h3>
              </div>
              <p className="text-gray-600 text-sm flex-1">{category.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Why Task Analysis Matters */}
      <motion.div
        className="bg-indigo-50 p-8 rounded-xl mb-12 border border-indigo-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="text-2xl font-bold text-indigo-900 mb-4">Why Task Analysis Matters</h3>
        <p className="text-gray-700 mb-6">
          As AI capabilities rapidly evolve, understanding which tasks are suitable for automation and which still require human expertise becomes increasingly critical. AI Task Lens helps you systematically evaluate each business task across multiple dimensions to determine the optimal balance between technology and human involvement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col">
            <h4 className="font-medium text-indigo-900 mb-3">Evolving AI Landscape</h4>
            <p className="text-gray-600">
              The capabilities of AI are changing rapidly. What required human judgement yesterday might be effectively automated today. Regular reassessment is essential.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col">
            <h4 className="font-medium text-indigo-900 mb-3">Structured Evaluation</h4>
            <p className="text-gray-600">
              Our seven-question framework helps break down tasks into their core components, revealing which aspects are suitable for automation and which require human oversight.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col">
            <h4 className="font-medium text-indigo-900 mb-3">Human-AI Partnership</h4>
            <p className="text-gray-600">
              The goal isn't to replace humans but to identify the optimal partnership between human expertise and AI capabilities, creating more effective and efficient processes.
            </p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start mb-8"
        >
          <AlertCircle className="mr-3 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-8 text-center my-12 shadow-sm"
        >
          <div className="flex justify-center mb-5">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle size={40} className="text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-3">Analysis Complete!</h3>
          <p className="text-green-700 text-lg">
            Redirecting you to your detailed results...
          </p>
        </motion.div>
      ) : (
        <motion.div
          id="question-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-indigo-100 p-8 shadow-md"
        >
          <h3 className="text-2xl font-bold text-indigo-900 mb-2">Task Analysis Questionnaire</h3>
          <p className="text-gray-600 mb-6">
            Answer these 7 questions about your business process to receive a detailed automation strategy recommendation
          </p>
          <QuestionForm onSubmit={handleSubmit} loading={loading} initialAnswers={initialAnswers} />
        </motion.div>
      )}
      
      <div className="mt-10 text-center">
        <p className="text-gray-500">
          Need inspiration? Check out our <a href="/examples" className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium">examples</a> to see how other processes were classified.
        </p>
      </div>
    </div>
  );
};

export default HomePage;