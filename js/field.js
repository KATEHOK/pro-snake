'use strict';
class Field {
    constructor(settings, wrapperSelector) {
        this.wrapperSelector = wrapperSelector;
        this.fieldSize = settings.fieldSize;
        this.snakeLen = settings.snakeLen;
        this.cellSize = settings.cellSize;
        this.slowLoading = settings.slowLoading;
        this.genField();
        this.showField();
        console.dir(this);
    }
    genField() {
        let template = '<table class="game_box-field">'
        for (let y = 0; y < this.fieldSize.rows; y++) {
            template += '<tr>';
            for (let x = 0; x < this.fieldSize.cols; x++) {
                template += `<td data-x="${x}" data-y="${y}" class="game_box-field-cell${this.cellSize}"></td>`;
            }
            template += '</tr>';
        }
        document.querySelector(this.wrapperSelector).innerHTML = template;
    }
    showField() {
        let cells = document.querySelectorAll(`.game_box-field-cell${this.cellSize}`);
        if (this.slowLoading) {
            let limit = this.fieldSize.cols * this.fieldSize.rows;
            let speed = 1;
            let counter = 0;
            console.dir(cells);
            this.intervalKey = setInterval(() => {
                cells[counter].classList.add('game_box-field-cell-loaded');
                cells[limit - counter - 1].classList.add('game_box-field-cell-loaded');
                counter++;
                if (limit <= 2 * counter) {
                    clearInterval(this.intervalKey);
                    document.querySelector('.game_box-field').classList.add('game_box-field-border');
                }
            }, speed);
        } else {
            cells.forEach(cell => cell.classList.add('game_box-field-cell-loaded'));
            document.querySelector('.game_box-field').classList.add('game_box-field-border');
        }
    }
}