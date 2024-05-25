import { useState } from 'react';
import logo from '../../apfel.png'

const FormSection = ({ generateResponse }) => {
    const [newQuestion, setNewQuestion] = useState('');

    return (
        <div><div className="form-section">
            <img  style={{width: 100, height: 100, position: 'inline'}}src={logo} alt='Bot'/><textarea
                rows="5"
                className="form-control"
                placeholder="Ask me anything..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
            ></textarea>
           
        </div> <button className="btn" onClick={() => generateResponse(newQuestion, setNewQuestion)}>
                Generate Response
            </button></div>
    )
}

export default FormSection;