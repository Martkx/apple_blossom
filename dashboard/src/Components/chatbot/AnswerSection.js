import React from "react";

import { faCopy } from "@fortawesome/free-solid-svg-icons";

const AnswerSection = ({ storedValues }) => {
    const copyText = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <hr className="hr-line" />
            <div className="answer-container">
                {storedValues.map((value, index) => {
                    return (
                        <div className="answer-section" key={index}>
                            <p className="question">{value.question}</p>
                            <p className="answer">{value.answer}</p>
                            <div
                                className="copy-icon"
                                onClick={() => copyText(value.answer)}
                            >
                                <i>{faCopy}</i>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default AnswerSection;