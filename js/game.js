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
        this.score = 0;
        this.makeSnake();
        this.genSnake();
        this.setApple()
        this.printCell(this.getCell(this.apple), 'apple');
        this.setListener();
        console.dir(this);
    }
    /**
     * меняет текст кнопки #startGoStopId
     */
    toggleTextBtn() {
        let btn = document.getElementById(this.field.startGoStopId);
        this.isPlaying ? btn.textContent = 'Stop' : btn.textContent = 'Go';
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
        this.stop();
        this.field.toggle(this.field.startGoStopId);
        this.crashed = true;
        this.score = 0;
    }
    /**
     * проверяет, входит ли ячейка в массив тела змейки
     * @param {Array} coords координаты проверяемой ячейки
     * @returns 
     */
    bodyIncludes(coords) {
        for (let i = 0; i < this.body.length; i++) {
            if (JSON.stringify(this.body[i]) == JSON.stringify(coords)) {
                return true;
            }
        }
        return false;
    }
    /**
     * устанавливает случайную позицию для яблока
     */
    setApple() {
        let checker = true;
        let coords;
        while (checker) {
            coords = [];
            coords.push(Math.round(Math.random() * (this.field.fieldSize.cols - 1)));
            coords.push(Math.round(Math.random() * (this.field.fieldSize.rows - 1)));
            if (!this.bodyIncludes(coords) && JSON.stringify(this.apple) != JSON.stringify(coords)) {
                checker = false;
            }
        }
        this.apple = coords;
    }
    /**
     * определяет координаты следующей ячейки
     * @returns координаты следующей ячейки
     */
    getNextItem() {
        let newItem = [...this.body[this.body.length - 1]];
        switch (this.dir) {
            case 'Up':
                newItem[1]--;
                break;
            case 'Down':
                newItem[1]++;
                break;
            case 'Right':
                newItem[0]++;
                break;
            case 'Left':
                newItem[0]--;
                break;
        }
        return newItem;
    }
    /**
     * проверяет, является ли ячейка доступной для хода в нее
     * (не выходит за пределы поля && не врезается змейка сама в себя)
     * @param {Array} item координаты ячейки
     * @returns 
     */
    isCellCorrect(item) {
        return item[0] >= 0 && item[1] >= 0 && item[0] < this.field.fieldSize.cols &&
            item[1] < this.field.fieldSize.rows && !this.bodyIncludes(item);
    }
    /**
     * обновляет счётчик на странице
     */
    updateScore() {
        document.getElementById(this.field.fieldCounterId).textContent = `Score: ${this.score}`;
    }
    /**
     * усанавливает сет-интервал - шаг игры
     */
    setCycle() {
        this.gameKey = setInterval(() => {
            // игра сломана || остановлена? - стоп, return
            if (this.crashed || !this.isPlaying) {
                this.removeCycle();
                return;
            }
            // получить координаты следующей клетки
            let newCoords = this.getNextItem();
            // координаты неверны (врезались в хвост || в бортик) - сломать игру, return
            if (!this.isCellCorrect(newCoords)) {
                this.crash();
                return;
            }
            this.alreadyChanged = false
            this.body.push(newCoords);
            // получить объект ячейки
            let cellEl = this.getCell(newCoords);
            // закрасить новую ячейку
            this.printCell(cellEl);
            // в новой ячейке было яблоко (сделать this.wasApple - или типа того) - return
            console.log(this.apple, newCoords);
            // чтобы сравнить массивы можно преобразовать их в JSON строки
            if (JSON.stringify(this.apple) == JSON.stringify(newCoords)) {
                this.score++;
                this.speed *= 0.9;
                console.log(this.speed);
                this.updateScore();
                this.setApple();
                let appleCell = this.getCell(newCoords);
                let newAppleCell = this.getCell(this.apple);
                this.clearCell(appleCell, 'apple');
                this.printCell(newAppleCell, 'apple');
                this.stop();
                this.go();
                return;
            }
            // стереть последнюю ячейку хвоста
            let lastCell = this.getCell(this.body[0]);
            this.clearCell(lastCell);
            // удалить первый элемент массива body (последняя клетка хвоста)
            this.body.shift();
            console.log(this.isPlaying);
        }, 500 * this.speed);
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
    clickHandler() {
        this.goStop();
    }
    setListenerBtns() {
        // сделать слушатель для перезагрузки
        document.getElementById(this.field.startGoStopId).addEventListener('click', this.clickHandler.bind(this));
    }
    /**
     * устанавливает слушатели событий
     */
    setListener() {
        this.setListenerBtns();
        this.setListenerKeys();
    }
    getNewItem() { }
    /**
     * добавляет класс для ячейки
     * @param {*} cell элемент ячейки
     * @param {String} className имя класса (по умолчанию snake)
     */
    printCell(cell, className = 'snake') {
        cell.classList.add(className);
    }
    /**
     * удаляет класс ячейки
     * @param {*} cell элемент ячейки
     * @param {String} className имя класса (по умолчанию snake)
     */
    clearCell(cell, className = 'snake') {
        cell.classList.remove(className);
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