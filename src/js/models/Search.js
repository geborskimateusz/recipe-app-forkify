import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '8dc74c1c239fabcadc45e773c4ffe146';
       
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        }catch(e){
            alert(e);
        }
    }
}