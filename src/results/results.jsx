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
        {question: "Are Pancakes or Waffles Better?", options: ["Pancakes", "Waffles"], image: "breakfast.png"}
    ];

    const countVotes = (question, option) => {
        return results[question] && results[question][option] !== undefined ? results[question][option] : 0;
    };

    React.useEffect(() => {
        async function fetchResults() {
            const response = await fetch('/api/vote_total');
            const data = await response.json();
            setResults(data);
        }
        fetchResults();
    }, []);


    //WebSocket
    React.useEffect(() => {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const ws = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'userVote') {
                // Display the message when a user votes
                setMsg(data.message);            
            }
        };

        ws.onclose = () => {
            setMsg('WebSocket connection closed.');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setMsg('WebSocket error occurred.');
        };

        return () => {
            ws.close();
        };
    }, []);
    

    React.useEffect(() => {
        fetch('https://quote.cs260.click')
        .then((response) => response.json())
        .then((data) => {
          setQuote(data.quote);
          setAuthor(data.author || 'Unknown');
        })
        .catch((error) => {
          console.error('Error fetching quote:', error);
          setQuote('Error fetching quote');
        });
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
                                {option}: {countVotes(question.question, option)} votes
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