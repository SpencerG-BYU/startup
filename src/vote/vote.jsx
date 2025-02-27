import React from 'react';
import './vote.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Vote() {
    const questions = [
        {question: "What Utensil Do You Use With Mac N Cheese?", options: ["Fork", "Spoon"], image: "macncheese.png"},
        {question: "Is Water Wet?", options: ["Wet", "Not Wet"], image: "water.png"},
        {question: "Is Cereal A Soup?", options: ["Soup", "Not Soup"], image: "cereal.png"},
        {question: "Does Pineapple Go on Pizza?", options: ["Heck Yes", "Absolutely Not"], image: "pineapplepizza.png"},
        {question: "Is Gif pronounced 'Gif' or 'Jif' ?", options: ["Gif", "Jif"], image: "https://data.textstudio.com/output/sample/animated/3/9/4/7/gif-5-17493.gif"},
        {question: "Are Panckaes or Waffles Better?", options: ["Pancakes", "Waffles"], image: "breakfast.png"}
    ];

    const [votes, setVotes] = React.useState({});

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
            Navigate('/results');
        }
    };

  return (
    <main>
        <h2>Select Your Choice</h2>
        {questions.map((question, index) => (
            <ul className="radio">
                <label className="q" for="text">{question.question}</label>
                <div> <img src={question.image} alt={question.question} width="500" /></div>
                {question.options.map((option, index) => (
                    <React.Fragment key={index}>
                        <input 
                            type="radio" 
                            name={question.question} 
                            value={option}
                            checked={votes[question.question] == option}
                            onChange={() => handleVoteChange(question.question, option)}
                            required
                        />
                        <label for={option}>{option}</label>
                    </React.Fragment>
                ))}
            </ul>
        ))}
        <form method="get" action="/results" onSubmit={handleSubmit}>
            <button type="submit">Submit Votes</button>
        </form>
    </main>
  );
}