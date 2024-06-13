"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { toast } from 'react-hot-toast';

const UploadCVPage = () => {
  const router = useRouter();
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/analyze', {
        cv_text: cvText,
        jd_text: jdText,
      });
      setFeedback(response.data.feedback);
      setAnalysisComplete(true);
      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error('Error uploading CV:', error);
      toast.error('Failed to analyze CV');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setAnalysisComplete(false);
    setFeedback('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-400">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl text-gray-700 font-bold mb-6 text-left">Upload CV for Analysis</h1>
        {analysisComplete ? (
          <div>
            <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Analysis Feedback</h2>
              <p>{feedback}</p>
            </div>
            <div className="text-center mt-6">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                onClick={handleBack}
              >
                Want to go make some changes?
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="cv" className="block text-gray-700 font-bold mb-2">CV Text</label>
              <textarea
                id="cv"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
                rows={6}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="jd" className="block text-gray-700 font-bold mb-2">Job Description Text</label>
              <textarea
                id="jd"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
                rows={6}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition duration-300`}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Upload and Analyze'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadCVPage;
