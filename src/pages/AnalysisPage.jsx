import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Wrench, 
  AlertTriangle, 
  Lightbulb, 
  BrainCircuit, 
  AlertCircle, 
  Download,
  FileText,
  Share2,
  Printer
} from 'lucide-react';
import { mockExamples, mockAnalysisResponse } from '../utils/mockData';

const AnalysisPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

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
        "0": "This is a sample task description that was analysed.",
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

  const getClassificationHexColor = (classification) => {
    switch (classification) {
      case 'Fully Automated (Rules-Based)':
        return '#DBEAFE'; // blue-100
      case 'Fully Automated (AI-Based)':
        return '#E9D5FF'; // purple-100
      case 'AI Agent with Human Oversight (Human-in-the-Loop)':
        return '#CCFBF1'; // teal-100
      case 'Human-Driven with AI Assistance':
        return '#FEF3C7'; // amber-100
      case 'Generative AI Task (Human-Directed Prompting)':
        return '#FFEDD5'; // orange-100
      case 'Human-Only':
        return '#FEE2E2'; // red-100
      default:
        return '#F3F4F6'; // gray-100
    }
  };

  const getClassificationDarkColor = (classification) => {
    switch (classification) {
      case 'Fully Automated (Rules-Based)':
        return '#1E40AF'; // blue-800
      case 'Fully Automated (AI-Based)':
        return '#6B21A8'; // purple-800
      case 'AI Agent with Human Oversight (Human-in-the-Loop)':
        return '#115E59'; // teal-800
      case 'Human-Driven with AI Assistance':
        return '#92400E'; // amber-800
      case 'Generative AI Task (Human-Directed Prompting)':
        return '#9A3412'; // orange-800
      case 'Human-Only':
        return '#991B1B'; // red-800
      default:
        return '#1F2937'; // gray-800
    }
  };

  // Generate the HTML content for the report
  const generateReportHTML = () => {
    if (!analysis) return '';
    
    const classColor = getClassificationHexColor(analysis.Classification);
    const textColor = getClassificationDarkColor(analysis.Classification);
    
    const date = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Task Lens Analysis Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            color: #1F2937;
            background-color: #F9FAFB;
            padding: 2rem;
          }
          
          .report-container {
            max-width: 210mm;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .report-header {
            background-color: #312E81;
            color: white;
            padding: 2.5rem 3rem;
            position: relative;
            overflow: hidden;
          }
          
          .report-header::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIG9wYWNpdHk9IjAuMiI+CjxwYXRoIGQ9Ik02MDAgMEwwIDYwME02MDAgMTUwTDE1MCA2MDBNNjAwIDMwMEwzMDAgNjAwTTYwMCA0NTBMNDUwIDYwME02MDAgNjAwTDAgME0xNTAgMEwwIDE1ME0zMDAgMEwwIDMwME00NTAgMEwwIDQ1MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwvZz4KPC9zdmc+Cg==');
            background-size: cover;
            opacity: 0.1;
          }
          
          .logo {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
          }
          
          .logo img {
            height: 40px;
            margin-right: 1rem;
          }
          
          .report-header h1 {
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .report-header p {
            font-size: 1.125rem;
            opacity: 0.8;
          }
          
          .report-date {
            font-size: 0.875rem;
            opacity: 0.7;
            margin-top: 1rem;
          }
          
          .report-content {
            padding: 3rem;
          }
          
          .classification-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
            background-color: ${classColor};
            color: ${textColor};
          }
          
          .section {
            margin-bottom: 2.5rem;
          }
          
          .section:last-child {
            margin-bottom: 0;
          }
          
          .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #312E81;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #E5E7EB;
          }
          
          .section-content {
            font-size: 1rem;
            color: #4B5563;
            line-height: 1.6;
          }
          
          .subsection {
            margin-bottom: 1.5rem;
          }
          
          .subsection-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1F2937;
          }
          
          .list-item {
            display: flex;
            margin-bottom: 0.75rem;
          }
          
          .list-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            background-color: #EFF6FF;
            color: #1E40AF;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 0.75rem;
            flex-shrink: 0;
          }
          
          .warning-item .list-number {
            background-color: #FFFBEB;
            color: #92400E;
          }
          
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
          }
          
          .table th {
            text-align: left;
            padding: 0.75rem;
            background-color: #F3F4F6;
            font-weight: 600;
          }
          
          .table td {
            padding: 0.75rem;
            border-bottom: 1px solid #E5E7EB;
          }
          
          .table tr:last-child td {
            border-bottom: none;
          }
          
          .footer {
            margin-top: 2rem;
            text-align: center;
            font-size: 0.875rem;
            color: #6B7280;
          }
          
          @media print {
            body {
              background-color: white;
              padding: 0;
            }
            
            .report-container {
              box-shadow: none;
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <div class="logo">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDEySDI4VjI4SDEyVjEyWiIgc3Ryb2tlPSIjNTU1QkZGIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjAgMTZWMjRNMTYgMjBIMjQiIHN0cm9rZT0iIzU1NUJGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==" alt="AI Task Lens Logo">
              <span style="font-size: 1.25rem; font-weight: 600;">AI Task Lens</span>
            </div>
            <h1>Task Analysis Report</h1>
            <p>Detailed assessment and automation recommendations</p>
            <div class="report-date">Generated on ${date}</div>
          </div>
          
          <div class="report-content">
            <div class="section">
              <div class="classification-badge">
                ${analysis.Classification}
              </div>
              
              <div class="section-content">
                <p>${answers["0"]}</p>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Analysis & Recommendation</h2>
              <div class="section-content">
                <p>${analysis.Reasoning}</p>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Implementation Guide</h2>
              
              <div class="subsection">
                <h3 class="subsection-title">Recommended Tools & Technologies</h3>
                ${analysis.Tools.map((tool, index) => `
                  <div class="list-item">
                    <div class="list-number">${index + 1}</div>
                    <div>${tool}</div>
                  </div>
                `).join('')}
              </div>
              
              <div class="subsection">
                <h3 class="subsection-title">Important Considerations</h3>
                ${analysis.PotentialConsiderations.map((consideration, index) => `
                  <div class="list-item warning-item">
                    <div class="list-number">${index + 1}</div>
                    <div>${consideration}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Classification Framework</h2>
              <table class="table">
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                </tr>
                <tr>
                  <td><strong>Fully Automated (Rules-Based)</strong></td>
                  <td>Tasks with clear rules, structured data, and minimal variation.</td>
                </tr>
                <tr>
                  <td><strong>Fully Automated (AI-Based)</strong></td>
                  <td>Tasks requiring pattern recognition or learning from data.</td>
                </tr>
                <tr>
                  <td><strong>AI Agent with Human Oversight</strong></td>
                  <td>Complex tasks where AI can handle most cases but humans verify or handle exceptions.</td>
                </tr>
                <tr>
                  <td><strong>Human-Driven with AI Assistance</strong></td>
                  <td>Tasks where human judgement is primary but AI tools enhance productivity.</td>
                </tr>
                <tr>
                  <td><strong>Generative AI Task</strong></td>
                  <td>Creative or analytical tasks where humans direct AI to generate content or insights.</td>
                </tr>
                <tr>
                  <td><strong>Human-Only</strong></td>
                  <td>Tasks requiring complex judgement, empathy, or accountability that can't be automated.</td>
                </tr>
              </table>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} AI Task Lens | Generated with AI Task Lens Application</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Function to download the report
  const downloadReport = () => {
    if (!analysis) return;
    
    setDownloading(true);
    
    try {
      const htmlContent = generateReportHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Task_Lens_Report_${id || 'analysis'}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloading(false);
      }, 100);
      
    } catch (err) {
      console.error('Error generating report:', err);
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-900 border-t-transparent rounded-full"></div>
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
          className="mb-4 flex items-center text-gray-600 hover:text-indigo-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="border-b border-indigo-900/10 pb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <BrainCircuit size={32} className="text-indigo-900" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-indigo-900">
                    Analysis Results
                  </h1>
                  <div className={`text-xs font-medium px-3 py-1 rounded-full ${getClassificationColor(analysis.Classification)}`}>
                    {analysis.Classification}
                  </div>
                </div>
                <h2 className="text-lg text-indigo-700">
                  Based on your task description, here's our recommended approach
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadReport}
                disabled={downloading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition-colors ${
                  downloading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {downloading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download Report</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (window.print) {
                    window.print();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 text-indigo-900 hover:bg-indigo-50 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'AI Task Lens Analysis',
                      text: `Check out this task analysis: ${analysis.Classification}`,
                      url: window.location.href,
                    });
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 text-indigo-900 hover:bg-indigo-50 transition-colors ${
                  !navigator.share ? 'hidden' : ''
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </motion.button>
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
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-900" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-900">Recommendation Analysis</h3>
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
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <Wrench className="h-5 w-5 text-indigo-900" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-900">Recommended Tools</h3>
              </div>
              
              <ul className="space-y-2">
                {analysis.Tools && analysis.Tools.map((tool, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
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
                <h3 className="text-lg font-semibold text-indigo-900">Considerations</h3>
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
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Lightbulb className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">Task Summary</h3>
            </div>
            
            <div className="text-gray-600 mb-4 max-h-48 overflow-y-auto">
              <p className="mb-2">{answers["0"]}</p>
            </div>
            
            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center px-4 py-2 border border-indigo-900 text-indigo-900 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Analyse Another Task
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-indigo-50 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">About the Classification</h3>
            
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
                <strong>Human-Driven with AI Assistance:</strong> Tasks where human judgement is primary but AI tools enhance productivity.
              </p>
              <p className="mb-2">
                <strong>Generative AI Task:</strong> Creative or analytical tasks where humans direct AI to generate content or insights.
              </p>
              <p>
                <strong>Human-Only:</strong> Tasks requiring complex judgement, empathy, or accountability that can't be automated.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Hidden HTML template for report - this is invisible but used for generating the report */}
      <div ref={reportRef} style={{ display: 'none' }}>
        {/* The report content will be generated dynamically */}
      </div>
    </>
  );
};

export default AnalysisPage;