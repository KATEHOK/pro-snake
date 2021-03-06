'use strict';
// const API_SETTINGS = "http://pro-snake/json/settings.json";
// const API_SETTINGS = "https://github.com/KATEHOK/pro-snake/blob/main/json/settings.json";
// settings = fetch(API_SETTINGS, "no-cors")
//     .then(result => result.json())
//     .catch(() => console.error('Lost settings! Set demo settings!'))
window.addEventListener('keydown', e => console.dir(e.code));
let settings = {
    snakeLen: 3,
    snakeSpeed: 1,
    cellSize: "_large",
    slowLoading: true,
    fieldSize: {
        rows: 25,
        cols: 25
    }
};
const fieldGenBtn = document.querySelector('#field_gen_btn');
fieldGenBtn.addEventListener('click', () => {
    const field = new Field(settings, 'game_box');
});