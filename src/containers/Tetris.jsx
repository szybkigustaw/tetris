/*
    Tetris - komponent stanowiący kontener dla pozostałych komponentów gry oraz zawierający całą jej logikę.
    Kontroluje przebieg rozgrywki, aktualizuje stan macierzy oraz przechowuje informacje o stanie gry.
*/

import React from "react";
import Stage from "./Stage";
import Display from "../components/Display";
import DisplayHold from "../components/DisplayHold";
import { TETROMINOS } from "../utils/tetrominos";
import { StyledTetris, StyledTetrisWrapper } from "./styles/StyledTetris";
import { Navigate } from "react-router";
import { ThemeConsumer } from "styled-components";
class Tetris extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            random_bag: [
                TETROMINOS['I'], TETROMINOS['J'], TETROMINOS['L'], TETROMINOS['O'], TETROMINOS['S'], 
                TETROMINOS['Z'], TETROMINOS['T']
            ],
            player: {
                pos: {x: 0, y: 0},
                tetromino: TETROMINOS[0],
                collided: false
            },
            stage: this.createStage(),
            held_tetromino: null,
            can_be_switched: true,
            drop_time: 1000,
            playtime: 0,
            gameOver: false,
            pause: false,
            rows_cleared: 0,
            points: 0,
            level: 1,
            required_to_level: 5
        };
        this.createStage = this.createStage.bind(this);
        this.drawFromBag = this.drawFromBag.bind(this);
        this.registerKeyPresses = this.registerKeyPresses.bind(this);
        this.checkCollision = this.checkCollision.bind(this);
        this.move = this.move.bind(this);
        this.drop = this.drop.bind(this);
        this.hardDrop = this.hardDrop.bind(this);
        this.rotate = this.rotate.bind(this);
        this.rotatePlayer = this.rotatePlayer.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.resetPlayer = this.resetPlayer.bind(this);
        this.clearRows = this.clearRows.bind(this);
        this.checkLevel = this.checkLevel.bind(this);
        this.switchHold = this.switchHold.bind(this);
        this.switchPause = this.switchPause.bind(this);
        this.STAGE_HEIGHT = 20
        this.STAGE_WIDTH = 10
        this.gameInterval = null;
        this.timer = null;
    };


    createStage(){
        this.STAGE_HEIGHT = 20;
        this.STAGE_WIDTH = 10;
        
        /* Tworzymy zmienną przechowującą dwuwymiarową tablicę - naszą macierz */
        const stage = Array.from(Array(this.STAGE_HEIGHT), () => (
            new Array(this.STAGE_WIDTH).fill(['0', 'clear']) //Wypełniamy ją komórkami pustymi (brak złączenia z macierzą, brak elementu na nich)
        ));

        return stage;
    }

    componentDidMount(){
        this.resetGame();
        document.querySelector("div.game-wrapper").focus();
    }

    componentDidUpdate(prevProps, prevState){

        //console.log("Rows Cleared:" + this.state.rows_cleared);
        //console.log("Required to level: " + this.state.required_to_level);
        //console.log(`Level increase: ${this.state.rows_cleared === this.state.required_to_level}`);

        //Jeśli stan gracza się zmienił:
        if(this.state.gameOver){
            clearInterval(this.gameInterval);
            clearInterval(this.timer);
        };
        if(this.state.player.collided){ this.resetPlayer(); }
        if(prevState.player.pos !== this.state.player.pos){
        

        //Dokonaj zcalenia komórek, które zcalone być powinny z macierzą i dokonaj jej ponownego wyrenderowania (bez uwzględnienia gracza)
        const newStage = this.state.stage.map((row) => 
            row.map((cell) => (
             cell[1] === 'clear' ? ['0', 'clear'] : cell   
            ))
        );

        //Narysuj na macierzy element obecnie kontrolowany przez gracza
        this.state.player.tetromino.forEach((row, y) => (
            row.forEach((value, x) => {
                if(value !== '0'){
                    newStage[y + this.state.player.pos.y][x + this.state.player.pos.x] = [
                        value,
                        `${this.state.player.collided ? 'merged' : 'clear'}` //Sprawdzanie, czy element powinien przy następnym renderze zostać scalony z macierzą
                    ];
                }
            })
        ))

        //Sprawdzamy, czy gracz właśnie nie koliduje z inną komórką, krańcem macierzy
        if(this.state.player.collided){
            this.resetPlayer();
            const clearRowsRes = this.clearRows(newStage);
            //Sprawdzenie czy nie doszło do zmiany poziomu gry
            //console.log(this.state.rows_cleared + clearRowsRes[1]);
            const checkLevelRes = this.checkLevel(this.state.level, this.state.rows_cleared + clearRowsRes[1], this.state.required_to_level, this.state.drop_time);
            this.setState(prevState => ({
                random_bag: this.state.random_bag,
                player: this.state.player,
                stage: clearRowsRes[0],
                held_tetromino: prevState.held_tetromino,
                can_be_switched: true,
                drop_time: checkLevelRes[2],
                playtime: prevState.playtime,
                gameOver: false,
                pause: prevState.pause,
                rows_cleared: prevState.rows_cleared + clearRowsRes[1],
                points: prevState.points + clearRowsRes[2],
                level: checkLevelRes[0],
                required_to_level: checkLevelRes[1]
            }));
            console.log(`Current drop time: ${Number(this.state.drop_time)}`);
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(() => {if(!this.state.gameOver) this.drop()}, this.state.drop_time);
            return;
        }

        //Ustawienie nowego stanu gry
            this.setState(prevState => ({
                    random_bag: this.state.random_bag,
                    player: this.state.player,
                    stage: newStage,
                    held_tetromino: prevState.held_tetromino,
                    can_be_switched: prevState.can_be_switched,
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    gameOver: false,
                    pause: prevState.pause,
                    rows_cleared: prevState.rows_cleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                })); 
    }
        //console.log(prevState.player === this.state.player); 
    }

    checkCollision(player, stage, {x: moveX, y: moveY}){
        if(!this.state.gameOver){
            //Pętla warunkowa
            for(let y = 0; y < player.tetromino.length; y++){
                for(let x = 0; x < player.tetromino[y].length; x++){

                    //Sprawdzamy, czy znajdujemy się na komórce zajętej przez kontrolowane tetromino
                    if(player.tetromino[y][x] !== '0'){
                        if(
                            //Sprawdzamy, czy nie wykraczamy poza macierz w osi Y
                            !stage[y + player.pos.y + moveY] ||

                            //Sprawdzamy, czy nie wykraczamy poza macierz w osi X
                            !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] || 

                            //Sprawdzamy, czy komórka, którą chcemy przesunąć nie jest złączona
                            stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
                        ){
                            return true;
                        } 
                    }

                }
            }
        }
    }

    clearRows(stage){
        let rows_cleared = 0;
        const filteredStage = stage.reduce((accumulator, row) => {
            if(row.findIndex(cell => cell[0] === "0") === -1){
                console.log(`Row cleared at: ${row}`);
                rows_cleared++;
                accumulator.unshift(new Array(stage[0].length).fill(['0','clear']));
                return accumulator;
            } else {
                accumulator.push(row);
                return accumulator;
            }
        }, []);
        let score;
        switch(rows_cleared){
            case 0: score = 0;
            break;
            case 1: score = 200 * this.state.level;
            break;
            case 2: score = 400 * this.state.level;
            break;
            case 3: score = 800 * this.state.level;
            break;
            default: score = 2000 * this.state.level;
            break;
        }

        return [filteredStage, rows_cleared, score];
    }

    checkLevel(current_level, rows_cleared, required_to_level, current_drop_time){
        let level = current_level;
        let req = required_to_level;
        let drop_time = current_drop_time;
        if(rows_cleared >= required_to_level){
            level++;
            req = required_to_level + (5 * level);
            drop_time = drop_time - (drop_time * 0.15);
        }

        return [level, req, drop_time];
    }

    switchHold(player, stage){
        if(!this.state.gameOver){
            if(this.state.held_tetromino === null){
                this.setState(prevState => ({
                    random_bag: prevState.random_bag,
                    player: this.resetPlayer(),
                    stage: prevState.stage,
                    held_tetromino: prevState.player.tetromino,
                    can_be_switched: prevState.can_be_switched,
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    pause: prevState.pause,
                    gameOver: false,
                    rows_cleared: prevState.rows_cleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }))
            } else if(this.state.can_be_switched){
                const cur_held_tetromino = this.state.held_tetromino;
                const cur_tetromino = player.tetromino;
                this.setState(prevState => ({
                    random_bag: prevState.random_bag,
                    player: {
                        pos: {x: this.STAGE_WIDTH / 2 - 2 , y: 0},
                        tetromino: cur_held_tetromino,
                        collided: false
                    },
                    stage: prevState.stage,
                    held_tetromino: cur_tetromino,
                    can_be_switched: false,
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    gameOver: false,
                    pause: prevState.pause,
                    rows_cleared: prevState.rows_cleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }))
            } else {
               return; 
            }
        }
    }
    rotate(tetromino, dir){
        //
        const rotated_tetromino = tetromino.map((_, index) => (
            tetromino.map(col => col[index])
        ))

        if(dir > 1) rotated_tetromino.map(row => row.reverse());
        else rotated_tetromino.reverse();

        return rotated_tetromino;
    }

    rotatePlayer(dir){


        //Tworzymy głęboką kopię gracza
        const player_copy = JSON.parse(JSON.stringify(this.state.player));

        //Odwracamy tetromino w kopii gracza
        player_copy.tetromino = this.rotate(player_copy.tetromino, dir);

        //Pobieramy obecną wartość pozycji X
        const cur_pos_x = player_copy.pos.x;

        //Tworzymy zmienną odchyłu
        let offset = 0;

        //Dopóki gra wykrywa kolizję obróconego tetromina
        while(this.checkCollision(player_copy, this.state.stage, {x: 0, y: 0})){
            player_copy.pos.x += offset; //Zwiększaj pozycję kopii gracza w osi X o wartość odchyłu
            offset = -(offset + (offset > 0 ? 1 : -1)); //Zwiększ / zmniejsz odchył o 1

            //Jeśli odchył jest większy od długości elementu
            if(offset > player_copy.tetromino[0].length){ 
                this.rotate(player_copy.tetromino, -dir); //Odwróć z powrotem tetromino
                player_copy.pos.x = cur_pos_x; //Przywróć kopii gracza poprzednią wartość pozycji X
                return;
            }
        }

        //Ustaw nową wartość dla gracza
        if(player_copy !== this.state.player) this.setState(prevState => ({
            random_bag: prevState.random_bag,
            player: player_copy,
            stage: prevState.stage,
            held_tetromino: prevState.held_tetromino,
            drop_time: prevState.drop_time,
            playtime: prevState.playtime,
            gameOver: prevState.gameOver,
            pause: prevState.pause,
            rows_cleared: prevState.rows_cleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        }))

    }

    move(dir){
        if(!this.state.gameOver){
            if(!this.checkCollision(this.state.player, this.state.stage, {x: dir, y: 0})) {
                this.setState(prevState => ({
                    random_bag: prevState.random_bag,
                    stage: prevState.stage,
                    held_tetromino: prevState.held_tetromino,
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    gameOver: prevState.gameOver,
                    pause: prevState.pause,
                    player: {
                        pos: {x: prevState.player.pos.x + dir, y: prevState.player.pos.y},
                        tetromino: prevState.player.tetromino,
                        collided: false
                    },
                    rows_cleared: prevState.rows_cleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }));     
            }
        }
    }

    drop(){
       if(!this.state.gameOver){
        if(!this.checkCollision(this.state.player, this.state.stage, {x: 0, y: 1})){
            this.setState(prevState => ({
                    random_bag: prevState.random_bag,
                    stage: prevState.stage,
                    held_tetromino: prevState.held_tetromino,
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    gameOver: prevState.gameOver,
                    pause: prevState.pause,
                    player: {
                        pos: {x: prevState.player.pos.x, y: prevState.player.pos.y + 1},
                        tetromino: prevState.player.tetromino,
                        collided: false
                    },
                    rows_cleared: prevState.rows_cleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }));
            } else {
                if(this.state.player.pos.y < 1){
                    console.log("bruh");
                    this.setState(prevState => ({
                        random_bag: prevState.random_bag,
                        player: prevState.player,
                        stage: prevState.stage,
                        held_tetromino: prevState.held_tetromino,
                        drop_time: prevState.drop_time,
                        playtime: prevState.playtime,
                        gameOver: true,
                        pause: prevState.pause,
                        rows_cleared: prevState.rows_cleared,
                        points: prevState.points,
                        level: prevState.level,
                        required_to_level: prevState.required_to_level
                    })); 
                } else {
                    this.setState(prevState => ({
                        random_bag: prevState.random_bag,
                        stage: prevState.stage,
                        held_tetromino: prevState.held_tetromino,
                        drop_time: prevState.drop_time,
                        playtime: prevState.playtime,
                        gameOver: prevState.gameOver,
                        pause: prevState.pause,
                        player: {
                            pos: {x: prevState.player.pos.x, y: prevState.player.pos.y},
                            tetromino: prevState.player.tetromino,
                            collided: true
                        },
                        rows_cleared: prevState.rows_cleared,
                        points: prevState.points,
                        level: prevState.level,
                        required_to_level: prevState.required_to_level
                    })); 
                }  
            }
        } 
    }

    hardDrop(player, stage){

        let add_pos_y = 0;
        while(!this.checkCollision(player, stage, {x: 0, y: add_pos_y})){
            add_pos_y++;
        }

        this.setState(prevState => ({
            random_bag: prevState.random_bag,
            player: {
                pos: {x: prevState.player.pos.x, y: prevState.player.pos.y + add_pos_y - 1},
                tetromino: prevState.player.tetromino,
                collided: true
            },
            stage: prevState.stage,
            held_tetromino: prevState.held_tetromino,
            can_be_switched: prevState.can_be_switched,
            drop_time: prevState.drop_time,
            playtime: prevState.playtime,
            gameOver: false,
            pause: prevState.pause,
            rows_cleared: prevState.rows_cleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        }))
    }

    drawFromBag(Bag){
        const tetrominos = "IJLOSZT";
        let bag = Bag;
        if(bag.length === 0){
            bag = new Array(7);
            for(let i = 0; i < bag.length; i++){
                bag[i] = TETROMINOS[tetrominos[i]];
            }
        }
        const drawn_tetromino = bag[Math.floor(Math.random() * bag.length)];
        bag = bag.length > 0 ? bag.filter(tetromino => tetromino.shape !== drawn_tetromino.shape) : new Array(0);

        return [drawn_tetromino, bag];
    }

    resetGame(){
        const drawResult = this.drawFromBag(this.state.random_bag);
        this.setState(prevState => ({
            random_bag: drawResult[1],
            player: {
                pos: {x: this.STAGE_WIDTH / 2 - 2, y: 0},
                tetromino: drawResult[0].shape,
                collided: false
            },
            stage: this.createStage(),
            held_tetromino: null,
            drop_time: 1000,
            playtime: 0,
            gameOver: false,
            pause: prevState.pause,
            rows_cleared: 0,
            points: 0,
            level: 1,
            required_to_level: 5
        }));
        this.gameInterval = setInterval(() => { if(!this.state.gameOver) this.drop() }, this.state.drop_time);
        this.time = 0;
        this.timer = setInterval(() => this.setState(prevState => ({
            player: prevState.player,
            random_bag: prevState.random_bag,
            stage: prevState.stage,
            held_tetromino: prevState.held_tetromino,
            drop_time: prevState.drop_time,
            playtime: prevState.playtime + 1,
            gameOver: prevState.gameOver,
            pause: prevState.pause,
            rows_cleared: prevState.rows_cleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        })), 1000);
    }

    resetPlayer(){
        const drawResult = this.drawFromBag(this.state.random_bag);
        this.setState(prevState => ({
            random_bag: drawResult[1],
            player: {
                pos: {x: this.STAGE_WIDTH / 2 - 2, y: 0},
                tetromino: drawResult[0].shape,
                collided: false
            },
            stage: prevState.stage,
            held_tetromino: prevState.held_tetromino,
            drop_time: prevState.drop_time,
            playtime: prevState.playtime,
            gameOver: false,
            pause: prevState.pause,
            rows_cleared: prevState.rows_cleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        }))
    }

    switchPause(){
        this.setState(prevState => ({
            player: prevState.player,
            stage: prevState.stage,
            random_bag: prevState.random_bag,
            held_tetromino: prevState.held_tetromino,
            drop_time: prevState.drop_time,
            playtime: prevState.playtime,
            gameOver: prevState.gameOver,
            pause: !(prevState.pause),
            rows_cleared: prevState.rows_cleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        }));

        if(this.state.pause){
            clearInterval(this.timer);
            clearInterval(this.gameInterval);
        } else {
            this.gameInterval = setInterval(() => { if(!this.state.gameOver) this.drop() }, this.state.drop_time);
            this.timer = setInterval(() => this.setState(prevState => ({
            player: prevState.player,
            random_bag: prevState.random_bag,
            stage: prevState.stage,
            held_tetromino: prevState.held_tetromino,
            drop_time: prevState.drop_time,
            playtime: prevState.playtime + 1,
            gameOver: prevState.gameOver,
            pause: prevState.pause,
            rows_cleared: prevState.rows_cleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        })), 1000);
            document.querySelector("div.game-wrapper").focus();
        }
    }

    registerKeyPresses(e){
        if(!this.state.gameOver){
        switch(e.code){
            case "ControlLeft":{
                this.switchHold(this.state.player, this.state.stage);
            } break;
            case "ArrowLeft":{
                this.move(-1);
            } break;

            case "ArrowUp":{
                this.rotatePlayer(1);
            } break;
            
            case "ShiftLeft":{
                this.rotatePlayer(-1);
            }  break;

            case "ArrowRight":{
                this.move(1);
            } break;

            case "ArrowDown":{
                this.drop();
            } break;

            case "Space":{
                this.hardDrop(this.state.player, this.state.stage);
            } break;

            case "Escape":{
                this.switchPause();
            } break;
        }
    }
    }

    render(){

        //console.log("siema eniu");
        //this.rerender_count++;
        //console.log(this.rerender_count);
        //console.log("This player: "); console.log(this.state.player);
        //console.log(`Current hold: ${this.state.held_tetromino}`);

        return(
            <StyledTetrisWrapper
                role="button"
                className="game-wrapper"
                tabIndex={0}
                onKeyDown={(e) => this.registerKeyPresses(e)}
            >
            {!this.state.gameOver ? ( !this.state.pause ?
            <StyledTetris>
                <Stage stage={this.state.stage} />
                <aside>
                    <div>
                        <Display text={`Wynik: ${this.state.points}`} />
                        <Display text={`Wiersze: ${this.state.rows_cleared}`} />
                        <Display text={`Poziom: ${this.state.level}`} /> 
                        <Display text={`Do następnego ${this.state.required_to_level - this.state.rows_cleared}`} />
                        <Display text={`Czas: ${this.state.playtime}`} />
                        <DisplayHold held_tetromino={this.state.held_tetromino} />
                    </div>
                </aside>
            </StyledTetris>
            :
            <div>
                <h1>Pauza</h1>
                <button 
                    onClick={() => this.switchPause()}
                >
                    Wznów
                </button>
            </div>
            ) :
            <Navigate to="/game/result" 
            state={{
                fromGame: true, 
                score: {
                    rows_cleared: this.state.rows_cleared,
                    level: this.state.level,
                    time: this.state.playtime,
                    points: this.state.points
                }
            }} />
            }
            </StyledTetrisWrapper>
        );
    };
};

export default Tetris;