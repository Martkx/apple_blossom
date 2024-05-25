
import { OpenAI } from 'openai';

import FormSection from './FormSection.js';
import AnswerSection from './AnswerSection.js';



import React, { useState } from 'react';

const Chatbot = () => {
    const apiKey = 'sk-proj-EWlyWxcNfAiVFtiavkWdT3BlbkFJVn7h3RcRb2hjPRNIkJDs'
    const openai = new OpenAI ({
        apiKey, dangerouslyAllowBrowser: true 
    });

    const [storedValues, setStoredValues] = useState([]);

    const generateResponse = async (newQuestion, setNewQuestion) => {
        try {const response = await openai.completions.create({
            model: 'gpt-3.5-turbo',
            temperature: 0,
            max_tokens: 10,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ['/'],
        });

        if (response.choices) {
            setStoredValues([
              {
                question: newQuestion,
                answer: response.choices[0].text,
              },
              ...storedValues,
            ]);
            setNewQuestion('');
          }
        } catch (error) {
          console.error('Error generating response:', error);}
    };

    return (
        <div>
            <div className="header-section">
                <h3>Chatbot</h3>
                {storedValues.length < 1 && (
					<p>
					
					</p>
				)}
            </div>
            <FormSection generateResponse={generateResponse} />

            <AnswerSection storedValues={storedValues} />
        </div>
    );
};

export default Chatbot;