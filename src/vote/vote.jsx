import React from 'react';
import './vote.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

export function Vote() {
  return (
    <main>
        <h2>Select Your Choice</h2>
            <ul class="radio">
                <label class="q" for="text">What Utensil Do You Use With Mac N Cheese?</label>
                <div> <img src="macncheese.png" alt="mac-n-cheese" width="500" /></div>
                <input type="radio" name="mac" value="fork" required />
                <label for="fork">Fork</label>
                <input type="radio" name="mac" value="spoon" required />
                <label for="spoon">Spoon</label>
            </ul>
            <ul class="radio">
                <label class="q" for="text">Is Water Wet?</label>
                <div> <img src="water.png" alt="water" width="500" height="300" /></div>
                <input type="radio" name="water" value="wet" required />
                <label for="wet">Wet</label>
                <input type="radio" name="water" value="notwet" required />
                <label for="notwet">Not Wet</label>
            </ul>
            <ul class="radio">
                <label class="q" for="text">Is Cereal A Soup?</label>
                <div> <img src="cereal.png" alt="cereal" width="500" height="300" /></div>
                <input type="radio" name="cereal" value="soup" required />
                <label for="soup">Soup</label>
                <input type="radio" name="cereal" value="notsoup" required />
                <label for="notsoup">Not Soup</label>
            </ul>
            <ul class="radio">
                <label class="q" for="text">Does Pineapple Go on Pizza?</label>
                <div> <img src="pineapplepizza.png" alt="Pineapple Pizza" width="500" height="300" /></div>
                <input type="radio" name="pineapple" value="yes" required />
                <label for="yes">Heck Yes</label>
                <input type="radio" name="pineapple" value="no" required />
                <label for="no">Absolutely Not</label>
            </ul>
            <ul class="radio">
                <label class="q" for="text">Is Gif pronounced "Gif" or "Jif" ?</label>
                <div> <img src="https://data.textstudio.com/output/sample/animated/3/9/4/7/gif-5-17493.gif" alt="Gif" width="500" height="300" /></div>
                <input type="radio" name="gif" value="gif" required />
                <label for="gif">Gif</label>
                <input type="radio" name="gif" value="jif" required />
                <label for="jif">Jif</label>
            </ul>
            <ul class="radio">
                <label class="q" for="text">Are Panckaes or Waffles Better?</label>
                <div> <img src="breakfast.png" alt="Pancakes and Waffles" width="500" height="300" /></div>
                <input type="radio" name="pancake" value="pancake" required />
                <label for="pancake">Pancakes</label>
                <input type="radio" name="pancake" value="waffle" required />
                <label for="waffle">Waffles</label>
            </ul>

            <form method="get" action="/results">
                <button type="submit">Submit Votes</button>
            </form>
    </main>
  );
}