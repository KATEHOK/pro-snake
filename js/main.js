'use strict';
// const API_SETTINGS = "http://pro-snake/json/settings.json";
// const API_SETTINGS = "https://github.com/KATEHOK/pro-snake/blob/main/json/settings.json";
// settings = fetch(API_SETTINGS, "no-cors")
//     .then(result => result.json())
//     .catch(() => console.error('Lost settings! Set demo settings!'))
let settings = {
    snakeLen: 3,
    cellSize: "_extralarge",
    slowLoading: true,
    fieldSize: {
        rows: 20,
        cols: 20
    }
};
const fieldGenBtn = document.querySelector('#field_gen_btn');
fieldGenBtn.addEventListener('click', () => {
    const field = new Field(settings, 'game_box');
});