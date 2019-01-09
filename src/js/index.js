// Food2fork API key 6f54c1f9c036bf2972510ce04331f5d8 
// https://www.food2fork.com/api/search

import axios from 'axios';

async function getResults(query) {
    const key = '6f54c1f9c036bf2972510ce04331f5d8';
    try {
        const result = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = result.data.recipes;
        console.log(recipes);
    } catch (error) {
        alert(error);
    }
}

getResults('pizza');