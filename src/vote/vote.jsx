import React from 'react';
import './vote.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

export function Vote() {
    const questions = [
        {question: "What Utensil Do You Use With Mac N Cheese?", options: ["Fork", "Spoon"], image: "macncheese.png"},
        {question: "Is Water Wet?", options: ["Wet", "Not Wet"], image: "water.png"},
        {question: "Is Cereal A Soup?", options: ["Soup", "Not Soup"], image: "cereal.png"},
        {question: "Does Pineapple Go on Pizza?", options: ["Heck Yes", "Absolutely Not"], image: "pineapplepizza.png"},
        {question: "Is Gif pronounced 'Gif' or 'Jif' ?", options: ["Gif", "Jif"], image: "https://data.textstudio.com/output/sample/animated/3/9/4/7/gif-5-17493.gif"},
        {question: "Are Panckaes or Waffles Better?", options: ["Pancakes", "Waffles"], image: "breakfast.png"}
    ];

  return (
    <main>
        <h2>Select Your Choice</h2>
        {questions.map((question, index) => (
            <ul className="radio">
                <label className="q" for="text">{question.question}</label>
                <div> <img src={question.image} alt={question.question} width="500" /></div>
                {question.options.map((option, index) => (
                    <><input type="radio" name={question.question} value={option} required /><label for={option}>{option}</label></>
                ))}
            </ul>
        ))}
        <form method="get" action="/results">
            <button type="submit">Submit Votes</button>
        </form>
    </main>
  );
}