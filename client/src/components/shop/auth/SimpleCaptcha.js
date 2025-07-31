import React, { useState, useEffect } from 'react';

const SimpleCaptcha = ({ onCaptchaVerified, onCaptchaChange }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Generate a new math question
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let correctAnswer;
    switch (operator) {
      case '+':
        correctAnswer = num1 + num2;
        break;
      case '-':
        correctAnswer = num1 - num2;
        break;
      case '×':
        correctAnswer = num1 * num2;
        break;
      default:
        correctAnswer = num1 + num2;
    }
    
    setQuestion(`${num1} ${operator} ${num2} = ?`);
    setAnswer(correctAnswer.toString());
    setUserAnswer('');
    setIsCorrect(false);
  };

  // Generate initial question
  useEffect(() => {
    generateQuestion();
  }, []);

  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (userAnswer.trim() === answer) {
      setIsCorrect(true);
      onCaptchaVerified(true);
      onCaptchaChange && onCaptchaChange(true);
    } else {
      setIsCorrect(false);
      onCaptchaVerified(false);
      onCaptchaChange && onCaptchaChange(false);
      setAttempts(attempts + 1);
      
      // Generate new question after wrong answer
      setTimeout(() => {
        generateQuestion();
        setAttempts(0);
      }, 1000);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserAnswer(value);
    
    // Auto-submit when user types the correct answer
    if (value.trim() === answer) {
      setIsCorrect(true);
      onCaptchaVerified(true);
      onCaptchaChange && onCaptchaChange(true);
    } else {
      setIsCorrect(false);
      onCaptchaVerified(false);
      onCaptchaChange && onCaptchaChange(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit();
    }
  };

  return (
    <div className="captcha-container">
      <div className="bg-gray-50 p-3 rounded-md border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Security Check</span>
          <span className="text-xs text-gray-500">CAPTCHA</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="text-center mb-2">
              <span className="text-lg font-bold text-gray-800">{question}</span>
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Answer"
              className={`w-full px-3 py-2 border rounded-md text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : attempts > 0 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
              }`}
              disabled={isCorrect}
            />
          </div>
          
          {!isCorrect && (
            <button
              onClick={handleAnswerSubmit}
              className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
            >
              Verify
            </button>
          )}
        </div>
        
        {isCorrect && (
          <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-md">
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-700 font-medium">Verified!</span>
            </div>
          </div>
        )}
        
        {attempts > 0 && !isCorrect && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md">
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-700">Wrong answer</span>
            </div>
          </div>
        )}
        
        <div className="mt-2 text-center">
          <button
            onClick={generateQuestion}
            className="text-xs text-gray-500 hover:text-gray-700 underline focus:outline-none"
          >
            New question
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleCaptcha; 