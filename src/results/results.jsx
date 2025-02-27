import React from 'react';
import './results.css';

export function Results() {
    const [results, setResults] = React.useState([]);
    

    React.useEffect(() => {
        const storedResults = localStorage.getItem('results');
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

  return (
    <main>
        <h2>Results</h2>
        {Object.keys(results).map((question, index) => (
            <div key={index}>
                <h3>{question}</h3>
                <ul>
                    <li>{results[question]}</li>
                </ul>
            </div>
        ))}
        <form method="get" action="/vote">
            <button type="submit">Re-Vote</button>
        </form>
    </main>
  );
}