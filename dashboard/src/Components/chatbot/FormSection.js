import React, { useState } from 'react';

const FormSection = ({ generateResponse }) => {
    const [newQuestion, setNewQuestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) return;  // Verhindert Mehrfachaufrufe

        setIsSubmitting(true);
        await generateResponse(newQuestion, setNewQuestion);
        setIsSubmitting(false);
    };

    return (
        <div>
            <div className="form-section">
                <img style={{ width: 100, height: 100, display: 'inline' }} src="path-to-your-logo.png" alt='Bot' />
                <textarea
                    rows="5"
                    className="form-control"
                    placeholder="Ask me anything..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                ></textarea>
            </div>
            <button className="btn" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Generating...' : 'Generate Response'}
            </button>
        </div>
    );
};

export default FormSection;
