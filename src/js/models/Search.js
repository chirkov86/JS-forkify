import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        const key = '6f54c1f9c036bf2972510ce04331f5d8';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}

