import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const AnswerSection = ({ storedValues }) => {
    const copyText = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <hr className="hr-line" />
            <div className="answer-container">
                {storedValues.length > 0 ? storedValues.map((value, index) => (
                    <div className="answer-section" key={index}>
                        <p className="question">{value.question}</p>
                        <p className="answer">{value.answer}</p>
                        <div
                            className="copy-icon"
                            onClick={() => copyText(value.answer)}
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </div>
                    </div>
                )) : <p>No answers available.</p>}
                
            </div>
        </>
    );
}

export default AnswerSection;
