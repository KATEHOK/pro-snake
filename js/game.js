'use strict';
class Game {
    constructor(field) {
        this.field = field;
        this.speed = field.snakeSpeed;
        this.dir = 'Down';
        this.alreadyChanged = false;
        this.possibleDir = [
            'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft',
            'Numpad8', 'Numpad6', 'Numpad2', 'Numpad4',
            'KeyW', 'KeyD', 'KeyS', 'KeyA'];
        this.possibleKeys = ['NumpadEnter', 'Enter', 'Space'];
        this.isPlaying = false;
        this.crashed = false;
        this.makeSnake();
        this.genSnake();
        this.setListener();
        console.dir(this);
    }
    /**
     * меняет текст кнопки #startGoStopId
     */
    toggleTextBtn() {
        let btn = document.getElementById(this.field.startGoStopId);
        this.isPlaying ? btn.textContent = 'Go' : btn.textContent = 'Stop';
    }
    /**
     * ставит игру на паузу || запускает игру
     */
    goStop() {
        if (this.crashed) {
            return;
        }
        this.isPlaying ? this.stop() : this.go();
    }
    restart() {
        // сломать игру (если не сломана),
        // удалить отображение змейки,
        // запустить restart у объекта поля
    }
    crash() {
        // остановить без возможности возобновления
        this.crashed = true;
    }
    setCycle() {
        this.gameKey = setInterval(() => {
            // игра сломана || остановлена? - стоп, return
            // получить координаты следующей клетки
            // координаты неверны (врезались в хвост || в бортик) - удалить сет-интервал, сломать игру, return
            // this.alreadyChanged = false
            // получить объект ячейки
            // закрасить новую ячейку
            // в новой ячейке было яблоко (сделать this.wasApple - или типа того) - return
            // стереть последнюю ячейку хвоста
            // удалить первый элемент массива body (последняя клетка хвоста)
        }, 1000 / this.speed);
    }
    /**
     * удаляет сет-интервал игры
     */
    removeCycle() {
        clearInterval(this.gameKey);
    }
    /**
     * меняет текст кнопки, удаляет цикл игры
     */
    stop() {
        this.isPlaying = false;
        this.toggleTextBtn();
        this.removeCycle();
    }
    /**
     * меняет текст кнопки, запускает цикл игры
     */
    go() {
        this.isPlaying = true;
        this.toggleTextBtn();
        this.setCycle();
    }
    /**
     * проверяет, является  новое направление инвертированным старым
     * @param {String} code новое направление
     * @returns 
     */
    isInvertDir(code) {
        return (code == 'Up' && this.dir == 'Down') || (code == 'Down' && this.dir == 'Up') ||
            (code == 'Left' && this.dir == 'Right') || (code == 'Right' && this.dir == 'Left');
    }
    /**
     * проверяет корректность и устанавливает направление
     * @param {String} code код клавиши
     * @returns 
     */
    setDir(code) {
        if (!this.isPlaying || this.crashed) {
            return;
        }
        code.includes('Arrow') ? code = code.slice(5) : null;// если управление стрелки, отрезаем Arrow
        if (code.includes('Key')) {// если управление WASD, миеняем на удобоваримый
            code = code.slice(3);
            switch (code) {
                case 'W':
                    code = 'Up';
                    break;
                case 'D':
                    code = 'Right';
                    break;
                case 'S':
                    code = 'Down';
                    break;
                case 'A':
                    code = 'Left';
                    break;
            }
        } else if (code.includes('Numpad')) {// если управление Numpad..., миеняем на удобоваримый
            code = code.slice(6);
            switch (code) {
                case '8':
                    code = 'Up';
                    break;
                case '6':
                    code = 'Right';
                    break;
                case '2':
                    code = 'Down';
                    break;
                case '4':
                    code = 'Left';
                    break;
            }
        }
        if (this.alreadyChanged || this.dir == code || this.isInvertDir(code)) {
            // если новое направление некорректно (за этот ход уже было изменено || выбрано текущее || выбрано инвертированное),
            // то сбрасываем выполнение
            return;
        }
        this.dir = code;
        this.alreadyChanged = true; // маячок, что за ход изменено направление
        console.log('Changed...');
    }
    /**
     * вызывает фунции обработки горячих клавиш игры (направление || стоп/плэй/перезагрузка)
     * @param {Object} e объект события kewdown
     * @returns 
     */
    keydownHandler(e) {
        console.log('kewdownHandler in progress...');
        // console.dir(e);
        let code = e.code;
        if (!this.possibleKeys.includes(code) && !this.possibleDir.includes(code)) {
            return; // если нажаты не горячие клавиши - сброс
        }
        e.preventDefault();
        // необходимые функции (смена направления || пауза/плэй игры)
        this.possibleDir.includes(code) ? this.setDir(code) : this.goStop();
        // console.dir(this.dir);
    }
    /**
     * устанавливает обработчик события keydown, назначая keydownHandler
     */
    setListenerKeys() {
        // чтобы сохранить this и при этом не вызывать сразу обработчик
        window.addEventListener('keydown', this.keydownHandler.bind(this));
    }
    /**
     * устанавливает слушатели событий
     */
    setListener() {
        // this.setListenerBtns();
        this.setListenerKeys();
    }
    getNewItem() { }
    /**
     * добавляет класс змейки для ячейки
     * @param {*} cell элемент ячейки
     */
    printCell(cell) {
        cell.classList.add('snake');
    }
    /**
     * получает ячейк таблицы
     * @param {Array} item координаты ячейки
     * @returns ячейка таблицы
     */
    getCell(item) {
        return document.querySelector(`[data-x='${item[0]}'][data-y='${item[1]}']`);
    }
    /**
     * вызывает отрисовку каждого элемента тела змейки
     */
    genSnake() {
        this.body.forEach(item => {
            let cell = this.getCell(item);
            this.printCell(cell);
        });
    }
    /**
     * создаёт объект тела змейки
     */
    makeSnake() {
        this.body = [];
        for (let i = 0; i < this.field.snakeLen; i++) {
            this.body.push([0, i]);
            // .shift() - удалить первый элемент массива
        }
        console.dir(this.body);
    }
}