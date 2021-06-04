'use strict';
class Game {
    constructor(field) {
        this.field = field;
        this.dir = 'Down';
        this.alreadyChanged = false;
        this.possibleDir = [
            'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft',
            'Numpad8', 'Numpad6', 'Numpad2', 'Numpad4',
            'KeyW', 'KeyD', 'KeyS', 'KeyA'];
        this.possibleKeys = ['NumpadEnter', 'Enter', 'Space',]
        this.makeSnake();
        this.genSnake();
        this.setListener();
        console.dir(this);
    }
    keysHandler(code) { }
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
        console.dir(e);
        let code = e.code;
        if (!this.possibleKeys.includes(code) && !this.possibleDir.includes(code)) {
            return; // если нажаты не горячие клавиши - сброс
        }
        e.preventDefault();
        // необходимые функции (смена направления || пауза/плэй/перезагрузка игры)
        this.possibleDir.includes(code) ? this.setDir(code) : this.keysHandler(code);
        console.dir(this.dir);
    }
    /**
     * устанавливает обработчик события keydown, назначая keydownHandler
     */
    setListenerKeys() {
        // чтобы сохранить this и при этом не вызывать сразу обработчик
        window.addEventListener('keydown', this.keydownHandler.bind(this));
    }
    setListener() {
        // this.setListenerBtns();
        this.setListenerKeys();
    }
    getNewItem() { }
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