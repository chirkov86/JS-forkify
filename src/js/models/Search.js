import axios from 'axios';
import { key } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        try {
            let res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            if (res.data.error) {
                // Happens when API limit is over
                console.warn('API limit is exceeded');
                res = require('../sampleResult.json');
                this.result = res;
            } else {
                this.result = res.data.recipes;
            }
        } catch (error) {
            alert(error);
        }
    }
}

