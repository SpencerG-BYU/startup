import React from 'react';
import './results.css';


export function Results() {
    const [results, setResults] = React.useState({});
    const navigate = React.useNavigate();
    const questions = [
        {question: "What Utensil Do You Use With Mac N Cheese?", options: ["Fork", "Spoon"], image: "macncheese.png"},
        {question: "Is Water Wet?", options: ["Wet", "Not Wet"], image: "water.png"},
        {question: "Is Cereal A Soup?", options: ["Soup", "Not Soup"], image: "cereal.png"},
        {question: "Does Pineapple Go on Pizza?", options: ["Heck Yes", "Absolutely Not"], image: "pineapplepizza.png"},
        {question: "Is Gif pronounced 'Gif' or 'Jif' ?", options: ["Gif", "Jif"], image: "https://data.textstudio.com/output/sample/animated/3/9/4/7/gif-5-17493.gif"},
        {question: "Are Panckaes or Waffles Better?", options: ["Pancakes", "Waffles"], image: "breakfast.png"}
    ];

    React.useEffect(() => {
        const savedResults = JSON.parse(localStorage.getItem('results'));
        if (savedResults) {
            setResults(savedResults);
        }
    }, []);

    const countVotes = (question, option) => {
        return Object.values(results).filter(vote => vote === option).length;
    };

    return (
        <main>
            <h2>Results</h2>
            {questions.map((question, index) => (
                <div key={index}>
                    <h3>{question.question}</h3>
                    <ul>
                        {question.options.map((option, index) => (
                            <li key={index}>
                                {option}: {countVotes(question.question, option)} votes
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <button onClick={() => navigate('/vote')}>Re-Vote</button>
        </main>
    );
}