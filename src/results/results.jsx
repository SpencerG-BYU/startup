import React from 'react';
import './results.css';

export function Results() {
    const [results, setResults] = React.useState([]);

    React.useEffect(() => {
        const storedResults = localStorage.getItem('results');
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }
    , []);

    React.useEffect(() => {
      localStorage.setItem('results', JSON.stringify(results));
    }, [results]);
    

  return (
    <main>
        <h2>Results</h2>
            <ul class="updates">
                <li>"Wet" from "Is Water Wet?" Is Winning!</li>
                <li>"Does Pineapple Go on Pizza?" Is Tied!</li>
                <li>"Gif" from "Is it Pronounced "Gif" or "Jif"?" Is Winning!</li>
            </ul>


        <h3>What Utensil Do You Eat Macaroni and Cheese With?</h3>
        <ul>
            <p>Fork: 8</p>
            <p>Spoon: 2</p>
        </ul>

        <h3>Is Water Wet?</h3>
        <ul>
            <p>Wet: 6</p>
            <p>Not Wet: 4</p>
        </ul>

        <h3>Is Cereal A Soup?</h3>
        <ul>
            <p>Soup: 3</p>
            <p>Not Soup: 7</p>
        </ul>

        <h3>Does Pineapple Go on Pizza?</h3>
        <ul>
            <p>Heck Yes: 5</p>
            <p>Absolutely Not: 5</p>
        </ul>

        <h3>Is Gif pronounced "Gif" or "Jif" ?</h3>
        <ul>
            <p>Gif: 6</p>
            <p>Jif: 4</p>
        </ul>

        <h3>Are Panckaes or Waffles Better?</h3>
        <ul>
            <p>Pancakes: 7</p>
            <p>Waffles: 3</p>
        </ul>
    </main>
  );
}