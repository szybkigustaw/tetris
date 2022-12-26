/*
    Tetrominos - skrypt pomocniczny, zawierający informacje o wszystkich dostępnych Tetrominach.
    Zawiera również funkcję odpowiedzialną za losowanie Tetromina. 
 */

export const TETROMINOS = {
    '0': {
        shape: ["0"],
        color: "0, 0, 0"
    },
    'I': {
        shape: [
                ["0","I","0","0"],
                ["0","I","0","0"],
                ["0","I","0","0"],
                ["0","I","0","0"]
               ],
        color: "135, 206, 250"
    },
    'J': {
        shape: [
                ["0","J","0"],
                ["0","J","0"],
                ["J","J","0"]
               ],
        color: "0, 0, 139"
    },
    'L': {
        shape: [
                ["0","L","0"],
                ["0","L","0"],
                ["0","L","L"]
               ],
        color: "255, 165, 0"
    },
    'O': {
        shape: [
                ["O","O"],
                ["O","O"]
               ],
        color: "255, 255, 0"
    },
    'S': {
        shape: [
                ["0","S","S"],
                ["S","S","0"],
                ["0","0","0"]
               ],
        color: "124, 252, 0"
    },
    'Z': {
        shape: [
                ["Z","Z","0"],
                ["0","Z","Z"],
                ["0","0","0"]
               ],
        color: "220, 20, 60"
    },
    'T': {
        shape: [

                ["T","T","T"],
                ["0","T","0"],
                ["0","0","0"]
               ],
        color: "139, 0, 139"
    }
};

export const randomTetromino = () => {
    const tetromino = "IJLOSZT";
    const picked = tetromino[Math.floor(Math.random() * tetromino.length)];

    return TETROMINOS[picked];
};