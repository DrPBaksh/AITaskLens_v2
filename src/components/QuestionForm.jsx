import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, FileText, AlertCircle, Info, CheckCircle, BrainCircuit } from 'lucide-react';
import { QUESTIONS } from '../utils/mockData';

const QuestionForm = ({ onSubmit, initialAnswers = {}, loading = false }) => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState(null);

  // Update answers when initialAnswers change (for example pre-filling)
  useEffect(() => {
    if (Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);

  const handleTextChange = (e, index) => {
    setAnswers(prev => ({
      ...prev,
      [index]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that all questions have been answered
    const unansweredQuestions = QUESTIONS.map((_, index) => index)
      .filter(index => !answers[index] || answers[index].trim() === '');
    
    if (unansweredQuestions.length > 0) {
      setError(`Please answer ${unansweredQuestions.length > 1 ? 'all questions' : 'question ' + (unansweredQuestions[0] + 1)}`);
      // Focus on the first unanswered question
      setCurrentQuestion(unansweredQuestions[0]);
      return;
    }
    
    setError(null);
    onSubmit(answers);
  };

  const moveToQuestion = (index) => {
    if (index >= 0 && index < QUESTIONS.length) {
      setCurrentQuestion(index);
    }
  };

  const isQuestionAnswered = (index) => {
    return answers[index] && answers[index].trim() !== '';
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="question-form space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold text-indigo-900 flex items-center">
          <BrainCircuit className="mr-2" size={20} />
          Task Analysis Form
        </h2>
        
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </div>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"
        >
          <AlertCircle className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
      
      {/* Question navigation */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 w-full">
        {QUESTIONS.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => moveToQuestion(index)}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              currentQuestion === index 
                ? 'bg-indigo-900 text-white'
                : isQuestionAnswered(index)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      {/* Current question */}
      <div className="bg-gray-50 p-5 rounded-lg">
        <div className="mb-3 flex items-start">
          <span className="w-7 h-7 bg-indigo-900 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            {currentQuestion + 1}
          </span>
          <h3 className="font-medium text-gray-800">
            {QUESTIONS[currentQuestion]}
          </h3>
        </div>
        
        <textarea
          value={answers[currentQuestion] || ''}
          onChange={(e) => handleTextChange(e, currentQuestion)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corndel-purple focus:border-transparent outline-none transition mt-2"
          placeholder="Enter your answer here..."
          rows={6}
        />
        
        <div className="flex justify-between mt-4 space-x-2">
          <button
            type="button"
            onClick={() => moveToQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded-lg border transition ${
              currentQuestion === 0
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          
          <button
            type="button"
            onClick={() => moveToQuestion(currentQuestion + 1)}
            disabled={currentQuestion === QUESTIONS.length - 1}
            className={`px-4 py-2 rounded-lg transition ${
              currentQuestion === QUESTIONS.length - 1
                ? 'border border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-900 text-white hover:bg-indigo-800'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Tips section */}
      <div className="bg-corndel-beige/30 p-4 rounded-lg flex items-start">
        <Info className="w-5 h-5 text-indigo-900 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-indigo-900 mb-1">Tips for answering</h4>
          <p className="text-sm text-gray-700">
            Provide detailed information for the most accurate analysis. Focus on the specific aspects mentioned in the question, and include examples where relevant.
          </p>
        </div>
      </div>
      
      {/* Progress and submit */}
      <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0 w-full sm:w-auto">
          <div className="flex items-center">
            <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-indigo-900 h-2.5 rounded-full" 
                style={{ width: `${Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length / QUESTIONS.length * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500">
              {Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length}/{QUESTIONS.length}
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit"
          className={`w-full sm:w-auto font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-900 hover:bg-indigo-800 text-white'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Analysing...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Analyse Task</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default QuestionForm;