import React from 'react';
import {useNavigate} from 'react-router-dom';
import './vote.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Vote() {
    const questions = [
        {question: "What Utensil Do You Eat Mac N Cheese With?", options: ["Fork", "Spoon"], image: "macncheese.png"},
        {question: "Is Water Wet?", options: ["Wet", "Not Wet"], image: "water1.png"},
        {question: "Is Cereal A Soup?", options: ["Soup", "Not Soup"], image: "cereal.png"},
        {question: "Does Pineapple Go on Pizza?", options: ["Heck Yes", "Absolutely Not"], image: "pineapplepizza.png"},
        {question: "Is Gif pronounced 'Gif' or 'Jif'?", options: ["Gif", "Jif"], image: "https://data.textstudio.com/output/sample/animated/3/9/4/7/gif-5-17493.gif"},
        {question: "Are Panckaes or Waffles Better?", options: ["Pancakes", "Waffles"], image: "breakfast.png"}
    ];

    const [votes, setVotes] = React.useState({});
    const navigate = useNavigate();

    React.useEffect(() => {
        const savedVotes = JSON.parse(localStorage.getItem('votes'));
        if (savedVotes) {
            setVotes(savedVotes);
        }
    }, []);

    const handleVoteChange = (question, option) => {
        setVotes(prevVotes => {
            const newVotes = {...prevVotes, [question]: option};
            localStorage.setItem('votes', JSON.stringify(newVotes));
            return newVotes;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const allAnswered = questions.every(question => votes[question.question]);
        if (!allAnswered) {
            alert('Please answer all questions before submitting');
            return;
        } else {
            localStorage.setItem('results', JSON.stringify(votes));
            saveVotes();
        }
    };

    async function saveVotes(){
        const formattedVotes = questions.map(question => {
            const option = votes[question.question];
            return {option};
        });
        
        const response = await fetch('/api/votes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formattedVotes),
        });
        if (response.ok) {
            navigate('/results');
        } else {
            alert('Vote failed');
        }
    }

  return (
    <main>
        <h2>Select Your Choice</h2>
        <h3>You Must Choose One Answer For Every Question Before Submitting</h3>
        <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
            <ul className="radio" key={index}>
                <label className="question" for="text">{question.question}</label>
                <div> <img src={question.image} alt={question.question} width="500" /></div>
                <li>
                  {question.options.map((option, index) => (
                    <div key={index}>
                        <input 
                            type="radio" 
                            name={question.question} 
                            value={option}
                            onChange={() => handleVoteChange(question.question, option)}
                            required
                        />
                        <label className="option" for={option}>{option}</label>
                    </div>
                ))}
                </li>
            </ul>
        ))}
        <button type="submit">Submit Votes</button>
        </form>
    </main>
  );
}