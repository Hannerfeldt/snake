import "./styles/index.scss";

window.addEventListener('load', () => {
    const gameWindow = document.getElementsByClassName('game-window')[0];

    const windowWidth = 800,
    windowHeight = 800,
    sizeOfEntities = 10,
    appleSpawnRate = 25,
    updateFrequence = 100;

    gameWindow.style.height = windowHeight + 'px';
    gameWindow.style.width = windowWidth + 'px';

    let pixels = {};
    Array((windowWidth / sizeOfEntities) * (windowHeight / sizeOfEntities)).fill(0).forEach((e, i) => pixels[i] = i);

    const apples = [];
    const tails = [];

    const controls = {
        input: 's',
        pause: false,
        lastMove: 'w',
        'w': {
            step: -sizeOfEntities,
            direction: 'y',
            opposite: 's',
        },
        'a': {
            step: -sizeOfEntities,
            direction: 'x',
            opposite: 'd',
        },
        's': {
            step: sizeOfEntities,
            direction: 'y',
            opposite: 'w',
        },
        'd': {
            step: sizeOfEntities,
            direction: 'x',
            opposite: 'a',
        },
    }

    window.addEventListener("keydown", e => {
        if (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd') controls.input = e.key;

        if (e.key === ' ') controls.pause ?
            (gameLoop = setInterval(gameLogic, updateFrequence), controls.pause = false) :
            (clearInterval(gameLoop), controls.pause = true, gameLoop = null);
    })

    const draw = function() {
        this.element.style.top = this.y + 'px'
        this.element.style.left = this.x + 'px'
    }

    const move = () => {
        const input = controls[controls.input];

        if (tails.length === 0) pixels[snakeHead.flatCords()] = snakeHead.flatCords();

        if (controls.lastMove !== input.opposite) snakeHead[input.direction] += input.step, controls.lastMove = controls.input;
        else snakeHead[controls[controls.lastMove].direction] += controls[controls.lastMove].step;

        snakeHead.draw();

        if (tails.some(tail => tail.flatCords() === snakeHead.flatCords())) reset();

        pixels[snakeHead.flatCords()] = null;

        apples.forEach((apple, index) => {
            if (snakeHead.flatCords() === apple.flatCords()) {
                apple.element.remove();
                apples.splice(index, 1);
                addTail(snakeHead.x, snakeHead.y);
            }
        });
    }

    const flatCords = function() {
        return ((windowHeight / sizeOfEntities**2) * this.y) + this.x / sizeOfEntities;
    }

    const spawnApple = () => {

        const array = Object.values(pixels).filter(e => e !== null);

        if (array.length === 0) return;

        const randomIndex = Math.round(Math.random() * (array.length - 1));

        const y = Math.floor(array[randomIndex] / (windowWidth / sizeOfEntities)) * sizeOfEntities;
        const x = Math.round(((array[randomIndex] / (windowWidth / sizeOfEntities)) - y / sizeOfEntities) * windowWidth);

        const appleElement = document.createElement('div');
        gameWindow.append(appleElement);
        appleElement.classList.add('apple');
        appleElement.style = `--size: ${sizeOfEntities}px`;

        const apple = {
            x,
            y,
            flatCords,
            draw,
            element: appleElement,
        };

        apple.draw();
        apples.push(apple);

        pixels[apple.flatCords()] = null;
    }

    const addTail = (x, y) => {
        const tailElement = document.createElement('div');
        gameWindow.append(tailElement);
        tailElement.classList.add('snake');
        tailElement.style = `--size: ${sizeOfEntities}px`;
        const tail = {
            id: tails.length,
            x,
            y,
            flatCords,
            draw,
            element:tailElement,
        }
        pixels[tail.flatCords()] = null;


        tail.draw();
        tails.push(tail);
        addScore();
    }

    const addScore = () => {
        document.getElementById('points').innerHTML = tails.length;
    }

    const moveTail = () => {
        if (tails.length === 0) return;
        const tail = tails.pop();
        pixels[tail.flatCords()] = tail.flatCords();
        tail.x = snakeHead.x;
        tail.y = snakeHead.y;
        tail.draw();
        tails.unshift(tail);
        pixels[tail.flatCords()] = null;
    }

    let snakeHead = {
        x: windowWidth / 2,
        y: windowHeight / 2,
        flatCords,
        draw,
        element: document.getElementsByClassName('head')[0],
    }

    snakeHead.element.style = `--size: ${sizeOfEntities}px`;

    const reset = () => {
        for (let i = 0; i < tails.length; i++) {
            tails[i].element.remove();
        }
        tails.length = 0;

        snakeHead.y = windowHeight / 2;
        snakeHead.x = windowWidth / 2;
    }

    let time = 0;
    const gameLogic = () => {
        moveTail();
        move();
        if (snakeHead.x < 0 || snakeHead.x >= windowWidth || snakeHead.y < 0 || snakeHead.y >= windowHeight) reset();
        if (time % appleSpawnRate === 0) spawnApple();
        time++;
    }

    let gameLoop = setInterval(gameLogic , updateFrequence);
})
