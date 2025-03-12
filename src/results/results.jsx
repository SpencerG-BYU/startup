import React from 'react';
import {useNavigate} from 'react-router-dom';
import './results.css';


export function Results({setUser}) {
    const [results, setResults] = React.useState({});
    const navigate = useNavigate();
    const [msg, setMsg] = React.useState('...listening');
    const [quote, setQuote] = React.useState('Loading...');
    const [author, setAuthor] = React.useState('');
    const questions = [
        {question: "What Utensil Do You Eat Mac N Cheese With?", options: ["Fork", "Spoon"], image: "macncheese.png"},
        {question: "Is Water Wet?", options: ["Wet", "Not Wet"], image: "water1.png"},
        {question: "Is Cereal A Soup?", options: ["Soup", "Not Soup"], image: "cereal.png"},
        {question: "Does Pineapple Go on Pizza?", options: ["Heck Yes", "Absolutely Not"], image: "pineapplepizza.png"},
        {question: "Is Gif pronounced 'Gif' or 'Jif'?", options: ["Gif", "Jif"], image: "https://data.textstudio.com/output/sample/animated/3/9/4/7/gif-5-17493.gif"},
        {question: "Are Panckaes or Waffles Better?", options: ["Pancakes", "Waffles"], image: "breakfast.png"}
    ];

    const countVotes = (questionIndex, option) => {
        return results[questionIndex] && results[questionIndex][option] !== undefined ? results[questionIndex][option] : 0;
    };

    React.useEffect(() => {
        async function fetchResults() {
            const response = await fetch('/api/vote_total');
            const data = await response.json();
            setResults(data);
        }
        fetchResults();
    }, []);


    //Placeholder for WebSocket
    React.useEffect(() => {
        const intervalId = setInterval(() => {
            const randomQuestionIndex = Math.floor(Math.random() * questions.length);
            const randomQuestion = questions[randomQuestionIndex];
            const randomOptionIndex = Math.floor(Math.random() * randomQuestion.options.length);
            const randomOption = randomQuestion.options[randomOptionIndex];
            const otherOption = randomQuestion.options[(randomOptionIndex + 1) % randomQuestion.options.length];

            const randomOptionVotes = countVotes(randomQuestion.question, randomOption);
            const otherOptionVotes = countVotes(randomQuestion.question, otherOption);

            if (randomOptionVotes > otherOptionVotes) {
                setMsg(`"${randomOption}" overtook "${otherOption}" from "${randomQuestion.question}"`);
            } 
            else if (randomOptionVotes == otherOptionVotes) {
                setMsg(`"${randomOption}" and "${otherOption}" are tied from "${randomQuestion.question}"`);
            } else {
                setMsg(`"${otherOption}" is still leading from "${randomQuestion.question}"`);
            }
        }, 7000);

        return () => clearInterval(intervalId);
    }, [results]);

    React.useEffect(() => {
        fetch('https://quote.cs260.click')
        .then((response) => response.json())
        .then((data) => {
          setQuote(data.quote);
          setAuthor(data.author || 'Unknown');
        })
        .catch();
    }, []);

    function handleLogout(){
        fetch('api/auth/logout', {
            method: 'DELETE',
        });
        localStorage.removeItem('username');
        setUser(null); 
        navigate('/');
      }     

    return (
        <main>
            <h2>Results</h2>
            <div className="updates">{msg}</div>
            {questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                    <h3>{question.question}</h3>
                    <ul>
                        {question.options.map((option, optionIndex) => (
                            <li key={optionIndex}>
                                {option}: {countVotes(questionIndex, option)} votes
                            </li>
                        ))}
                    </ul>
            </div>
            ))}
            <p className='quote'>"{quote}"</p>
            <p className='author'>{author}</p>
            <button onClick={() => navigate('/vote')}>Vote Again</button>
            <button onClick={handleLogout}>Logout</button>
        </main>
    );
}