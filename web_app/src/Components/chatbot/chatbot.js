import React, { useState } from 'react';
import { OpenAI } from 'openai';
import FormSection from './FormSection.js';
import AnswerSection from './AnswerSection.js';

const Chatbot = () => {
    const apiKey = process.env.REACT_APP_GPT;
    console.log(apiKey)
    const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true 
    });

    const [storedValues, setStoredValues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const generateResponse = async (newQuestion, setNewQuestion) => {
      if (isLoading) return;
  
      setIsLoading(true);
      try {
          const response = await openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: newQuestion }],
              temperature: 0.7,
              max_tokens: 150,
              top_p: 1,
              frequency_penalty: 0.0,
              presence_penalty: 0.0,
          });
  
          if (response.choices) {
              setStoredValues([
                  {
                      question: newQuestion,
                      answer: response.choices[0].message.content,
                  },
                  ...storedValues,
              ]);
              setNewQuestion('');
          }
      } catch (error) {
          console.error('Error generating response:', error);
      } finally {
          setIsLoading(false);
      }
  };

    return (
        <div>
            <div className="header-section">
                <h3>Chatbot</h3>
                {storedValues.length < 1 && (
                    <p></p>
                )}
            </div>
            <FormSection generateResponse={generateResponse} />
            <AnswerSection storedValues={storedValues} />
        </div>
    );
};

export default Chatbot;