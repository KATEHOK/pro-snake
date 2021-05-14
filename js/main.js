'use strict';
const API_SETTINGS = "http://pro-snake/json/settings.json";
let settings = {
    snakeLen: 3,
    cellSize: "_extralarge",
    fieldSize: {
        rows: 10,
        cols: 10
    }
};
settings = fetch(API_SETTINGS, "no-cors")
    .then(result => result.json())
    .catch(() => console.error('Lost settings! Set demo settings!'))

setTimeout(() => console.dir(settings), 1000);