"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const InterviewPage = () => {
  const [question, setQuestion] = useState<string>("Hi");
  const [answer, setAnswer] = useState<string>("");
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [isInterviewStarted, setIsInterviewStarted] = useState<boolean>(false);
  const [isInterviewCompleted, setIsInterviewCompleted] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    setHydrated(true);
    loadVoices();
  }, []);

  useEffect(() => {
    if (isInterviewStarted && !isInterviewCompleted) {
      speakQuestion(question);
    }
  }, [question]);

  const loadVoices = () => {
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
    if (voices.length !== 0) {
      setVoices(voices);
    } else {
      synth.onvoiceschanged = () => {
        voices = synth.getVoices();
        setVoices(voices);
      };
    }
  };

  const startInterview = async () => {
    try {
      setIsInterviewStarted(true);
      toast.success("Interview started!");
      speakQuestion(question);
    } catch (error) {
      console.error("Error starting the interview:", error);
      toast.error("Failed to start the interview.");
    }
  };

  const stopInterview = async () => {
    setIsInterviewCompleted(true);
    await getFeedback();
    toast.success("Interview stopped.");
  };

  const handleAnswerSubmit = async () => {
    if (!answer) {
      toast.error("Please provide an answer.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/ask_question", {
        user_answer: answer,
        question_index: questionIndex,
      });

      setUserAnswers([...userAnswers, answer]);
      setAnswer("");

      if (response.data.next_question) {
        setQuestion(response.data.next_question);
        setQuestionIndex(response.data.question_index);
      } else {
        setIsInterviewCompleted(true);
        getFeedback();
      }
    } catch (error) {
      console.error("Error submitting the answer:", error);
      toast.error("Failed to submit the answer.");
    }
  };

  const getFeedback = async () => {
    try {
      const response = await axios.post("http://localhost:5000/get_feedback", {
        user_answers: userAnswers,
      });
      setFeedback(response.data.feedback);
      toast.success("Feedback received!");
    } catch (error) {
      console.error("Error getting feedback:", error);
      toast.error("Failed to get feedback.");
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
      toast.success(`You said: ${transcript}`);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      toast.error("Error occurred in recognition: " + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const speakQuestion = (text: string) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      toast.error("Your browser does not support speech synthesis.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    const voice = voices.find((voice) => voice.name.includes("Google US English")) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }

    synth.speak(utterance);
  };

  if (!hydrated) {
    return null; // Avoid rendering until hydration is complete
  }

  if (isInterviewCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500">
        <div className="bg-white p-8 rounded shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Interview Completed</h1>
          <p className="text-black mb-4">{feedback}</p>
          <Link href="/" className="text-blue-500 underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full text-center">
        {!isInterviewStarted ? (
          <>
            <h1 className="text-black text-2xl font-bold mb-4">Welcome to the Software Dev Interview</h1>
            <p className="mb-4 text-gray-700">Click the button below to start the interview. Answer each question to the best of your ability.</p>
            <button onClick={startInterview} className="bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full">Start Interview</button>
          </>
        ) : (
          <div>
            <p className="text-black text-right mb-4">{question}</p>
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
              className="text-black w-full p-2 border rounded mb-4"
            />
            <button 
              onClick={handleAnswerSubmit} 
              className={`bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full ${!answer ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!answer}
            >
              Submit Answer
            </button>
            <button onClick={stopInterview} className="bg-red-500 text-white py-2 px-4 rounded w-full">Stop Interview</button>
            <button 
              onClick={handleVoiceInput} 
              className={`bg-green-500 text-white py-2 px-4 rounded w-full ${isListening ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isListening}
            >
              {isListening ? "Listening..." : "Use Voice Input"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
