'use strict';
class Game {
    constructor(field) {
        this.field = field;
        this.makeSnake();
        this.genSnake();
        console.dir(this);
    }
    printCell(cell) {
        cell.classList.add('snake');
    }
    getCell(item) {
        return document.querySelector(`[data-x='${item[0]}'][data-y='${item[1]}']`);
    }
    genSnake() {
        this.body.forEach(item => {
            let cell = this.getCell(item);
            this.printCell(cell);
        });
    }
    makeSnake() {
        this.body = [];
        for (let i = 0; i < this.field.snakeLen; i++) {
            this.body.push([0, i]);
            // .shift() - удалить первый элемент массива
        }
        console.dir(this.body);
    }
}