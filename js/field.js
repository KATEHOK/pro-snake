'use strict';
class Field {
    constructor(settings, wrapperId, fieldCounterId = 'field_counter', genFieldId = 'field_gen_btn', startGoStopId = 'field_start_go_stop_btn', restartId = 'field_restart_btn') {
        // fieldSize.cols <= 25
        this.fieldCounterId = fieldCounterId;
        this.genFieldId = genFieldId;
        this.startGoStopId = startGoStopId;
        this.restartId = restartId;
        this.wrapperId = wrapperId;
        this.fieldSize = settings.fieldSize;
        this.snakeLen = settings.snakeLen;
        this.cellSize = settings.cellSize;
        this.slowLoading = settings.slowLoading;
        this.genField();
        this.toggleBtns();
        this.showField();
        this.setListener();
        console.dir(this);
    }
    toggleNameBtn(text) {
        document.getElementById(this.startGoStopId).textContent = text;
    };
    start() {
        this.game = new Game(this);
        this.toggleNameBtn('Go');
    }
    setListener() {
        let startGoStopBtn = document.querySelector(`#${this.startGoStopId}`);
        let restartBtn = document.querySelector(`#${this.restartId}`);
        // {once: true} чтобы вызывалось только при первом клике
        startGoStopBtn.addEventListener('click', () => this.start.call(this), { once: true });
        // restartBtn.addEventListener('click', this.restart);
    }
    toggleBtns() {
        document.querySelector(`#${this.genFieldId}`).classList.toggle('hide');
        document.querySelector(`#${this.startGoStopId}`).classList.toggle('hide');
        document.querySelector(`#${this.restartId}`).classList.toggle('hide');
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
        template += '</table>'
        template += `<span class='game_box-counter' id='${this.fieldCounterId}'>Score: 0</span>`;
        document.getElementById(this.wrapperId).insertAdjacentHTML('beforeend', template);
    }
    showField() {
        let cells = document.querySelectorAll(`.game_box-field-cell${this.cellSize}`);
        if (this.slowLoading) {
            let limit = this.fieldSize.cols * this.fieldSize.rows;
            let speed = 1;
            limit < 200 ? speed = 10 : null;
            limit < 100 ? speed = 50 : null;
            let counter = 0;
            console.dir(cells);
            let maxI = 1;
            if (maxI > 400) {
                limit % 10 == 0 ? maxI = 5 : null;
            } else if (maxI > 900) {
                limit % 10 == 0 ? maxI = 5 : null;
                limit % 20 == 0 ? maxI = 10 : null;
            }
            this.intervalKey = setInterval(() => {
                for (let i = 0; i < maxI; i++) {
                    cells[counter].classList.add('game_box-field-cell-loaded');
                    cells[limit - counter - 1].classList.add('game_box-field-cell-loaded');
                    counter++;
                }
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