/*
    Tetris - komponent stanowiący kontener dla pozostałych komponentów gry oraz zawierający całą jej logikę.
    Kontroluje przebieg rozgrywki, aktualizuje stan macierzy oraz przechowuje informacje o stanie gry.
*/

import React from "react";
import Stage from "./Stage";
import Display from "../components/Display";
import DisplayHold from "../components/DisplayHold";
import StartButton from "../components/StartButton";
import { randomTetromino, TETROMINOS } from "../utils/tetrominos";
import { StyledTetris, StyledTetrisWrapper } from "./styles/StyledTetris";

class Tetris extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            player: {
                pos: {x: 0, y: 0},
                tetromino: TETROMINOS[0],
                collided: false
            },
            stage: this.createStage(),
            held_tetromino: null,
            can_be_switched: true,
            dropTime: null,
            gameOver: false,
            rowsCleared: 0,
            points: 0,
            level: 1,
            required_to_level: 5
        };
        this.createStage = this.createStage.bind(this);
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
        this.STAGE_HEIGHT = 20
        this.STAGE_WIDTH = 10
        this.gameInterval = null;
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

    componentDidUpdate(prevProps, prevState){

        //console.log("Rows Cleared:" + this.state.rowsCleared);
        //console.log("Required to level: " + this.state.required_to_level);
        //console.log(`Level increase: ${this.state.rowsCleared === this.state.required_to_level}`);

        //Jeśli stan gracza się zmienił:
        if(this.state.gameOver) clearInterval(this.gameInterval);
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
            const checkLevelRes = this.checkLevel(this.state.rowsCleared + clearRowsRes[1], this.state.required_to_level);
            this.setState(prevState => ({
                player: this.state.player,
                stage: clearRowsRes[0],
                held_tetromino: prevState.held_tetromino,
                can_be_switched: true,
                dropTime: prevState.dropTime,
                gameOver: false,
                rowsCleared: prevState.rowsCleared + clearRowsRes[1],
                points: prevState.points + clearRowsRes[2],
                level: prevState.level + checkLevelRes[0],
                required_to_level: checkLevelRes[1]
            }));
            return;
        }

        //Ustawienie nowego stanu gry
            this.setState(prevState => ({
                    player: this.state.player,
                    stage: newStage,
                    held_tetromino: prevState.held_tetromino,
                    can_be_switched: prevState.can_be_switched,
                    dropTime: prevState.dropTime,
                    gameOver: false,
                    rowsCleared: prevState.rowsCleared,
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
        let rowsCleared = 0;
        const filteredStage = stage.reduce((accumulator, row) => {
            if(row.findIndex(cell => cell[0] === "0") === -1){
                console.log(`Row cleared at: ${row}`);
                rowsCleared++;
                accumulator.unshift(new Array(stage[0].length).fill(['0','clear']));
                return accumulator;
            } else {
                accumulator.push(row);
                return accumulator;
            }
        }, []);
        let score;
        switch(rowsCleared){
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

        return [filteredStage, rowsCleared, score];
    }

    checkLevel(rowsCleared, required_to_level){
        let level = 0;
        let req = required_to_level;
        if(rowsCleared === required_to_level){
            level++;
            req*= 3;
        }

        return [level, req];
    }

    switchHold(player, stage){
        if(!this.state.gameOver){
            if(this.state.held_tetromino === null){
                this.setState(prevState => ({
                    player: this.resetPlayer(),
                    stage: prevState.stage,
                    held_tetromino: prevState.player.tetromino,
                    can_be_switched: prevState.can_be_switched,
                    dropTime: prevState.dropTime,
                    gameOver: false,
                    rowsCleared: prevState.rowsCleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }))
            } else if(this.state.can_be_switched){
                for(let y = 0; y < this.state.held_tetromino.length; y++){
                    for(let x = 0; x < this.state.held_tetromino[y].length; x++){
                        if(this.state.held_tetromino[y][x] !== '0'){
                            if(
                                !stage[y + player.pos.y] ||
                                !stage[y + player.pos.y][x + player.pos.x] ||
                                stage[y + player.pos.y][x + player.pos.x][1] !== "clear"
                            ){
                                return;
                            } else {
                                const cur_held_tetromino = this.state.held_tetromino;
                                const cur_tetromino = player.tetromino;
                                this.setState(prevState => ({
                                    player: {
                                        pos: prevState.player.pos,
                                        tetromino: cur_held_tetromino,
                                        collided: prevState.player.collided
                                    },
                                    stage: prevState.stage,
                                    held_tetromino: cur_tetromino,
                                    can_be_switched: false,
                                    dropTime: prevState.dropTime,
                                    gameOver: false,
                                    rowsCleared: prevState.rowsCleared,
                                    points: prevState.points,
                                    level: prevState.level,
                                    required_to_level: prevState.required_to_level
                                }))
                            }
                        }
                    }
                }
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
        let offset = 1;

        //Dopóki gra wykrywa kolizję obróconego tetromina
        while(this.checkCollision(player_copy, this.state.stage, {x: 0, y: 0})){
            player_copy.pos.x += offset; //Zwiększaj pozycję kopii gracza w osi X o wartość odchyłu
            offset = -(offset + offset > 0 ? 1 : -1); //Zwiększ / zmniejsz odchył o 1

            //Jeśli odchył jest większy od długości elementu
            if(offset > player_copy.tetromino[0].length){ 
                this.rotate(player_copy.tetromino, -dir); //Odwróć z powrotem tetromino
                player_copy.pos.x = cur_pos_x; //Przywróć kopii gracza poprzednią wartość pozycji X
                return;
            }
        }

        //Ustaw nową wartość dla gracza
        this.setState(prevState => ({
            player: player_copy,
            stage: prevState.stage,
            held_tetromino: prevState.held_tetromino,
            dropTime: prevState.dropTime,
            gameOver: prevState.gameOver,
            rowsCleared: prevState.rowsCleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        }))
    }

    move(dir){
        if(!this.state.gameOver){
            if(!this.checkCollision(this.state.player, this.state.stage, {x: dir, y: 0})) {
                this.setState(prevState => ({
                    stage: prevState.stage,
                    held_tetromino: prevState.held_tetromino,
                    dropTime: prevState.dropTime,
                    gameOver: prevState.gameOver,
                    player: {
                        pos: {x: prevState.player.pos.x + dir, y: prevState.player.pos.y},
                        tetromino: prevState.player.tetromino,
                        collided: false
                    },
                    rowsCleared: prevState.rowsCleared,
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
                    stage: prevState.stage,
                    held_tetromino: prevState.held_tetromino,
                    dropTime: prevState.dropTime,
                    gameOver: prevState.gameOver,
                    player: {
                        pos: {x: prevState.player.pos.x, y: prevState.player.pos.y + 1},
                        tetromino: prevState.player.tetromino,
                        collided: false
                    },
                    rowsCleared: prevState.rowsCleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }));
            } else {
                if(this.state.player.pos.y < 1){
                    console.log("bruh");
                    this.setState(prevState => ({
                        player: prevState.player,
                        stage: prevState.stage,
                        held_tetromino: prevState.held_tetromino,
                        dropTime: prevState.dropTime,
                        gameOver: true,
                        rowsCleared: prevState.rowsCleared,
                        points: prevState.points,
                        level: prevState.level,
                        required_to_level: prevState.required_to_level
                    }));
                } else {
                    this.setState(prevState => ({
                        stage: prevState.stage,
                        held_tetromino: prevState.held_tetromino,
                        dropTime: prevState.dropTime,
                        gameOver: prevState.gameOver,
                        player: {
                            pos: {x: prevState.player.pos.x, y: prevState.player.pos.y},
                            tetromino: prevState.player.tetromino,
                            collided: true
                        },
                        rowsCleared: prevState.rowsCleared,
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
            player: {
                pos: {x: prevState.player.pos.x, y: prevState.player.pos.y + add_pos_y - 1},
                tetromino: prevState.player.tetromino,
                collided: true
            },
            stage: prevState.stage,
            held_tetromino: prevState.held_tetromino,
            can_be_switched: prevState.can_be_switched,
            dropTime: prevState.can_be_switched,
            gameOver: false,
            rowsCleared: prevState.rowsCleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        }))
    }

    resetGame(){
        this.setState(prevState => ({
            player: {
                pos: {x: this.STAGE_WIDTH / 2 - 2, y: 0},
                tetromino: randomTetromino().shape,
                collided: false
            },
            stage: this.createStage(),
            held_tetromino: null,
            dropTime: null,
            gameOver: false,
            rowsCleared: 0,
            points: 0,
            level: 1,
            required_to_level: 5
        }));
        this.gameInterval = setInterval(() => { if(!this.state.gameOver) this.drop() }, 500);
    }

    resetPlayer(){
        this.setState(prevState => ({
            player: {
                pos: {x: this.STAGE_WIDTH / 2 - 2, y: 0},
                tetromino: randomTetromino().shape,
                collided: false
            },
            stage: prevState.stage,
            held_tetromino: prevState.held_tetromino,
            dropTime: prevState.dropTime,
            gameOver: false,
            rowsCleared: prevState.rowsCleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        }))
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
        }
    }
    }

    render(){

        //console.log("siema eniu");
        //this.rerender_count++;
        //console.log(this.rerender_count);
        //console.log("This player: "); console.log(this.state.player);
        console.log(`Current hold: ${this.state.held_tetromino}`);

        return(
            <StyledTetrisWrapper
                role="button"
                tabIndex={0}
                onKeyDown={(e) => this.registerKeyPresses(e)}
            >
            {!this.state.gameOver ? 
            <StyledTetris>
                <Stage stage={this.state.stage} />
                <aside>
                    <div>
                        <Display text={`Wynik: ${this.state.points}`} />
                        <Display text={`Wiersze: ${this.state.rowsCleared}`} />
                        <Display text={`Poziom: ${this.state.level}`} /> 
                        <DisplayHold held_tetromino={this.state.held_tetromino} />
                    </div>
                    <StartButton 
                        handleGameStart={this.resetGame}
                    />
                </aside>
            </StyledTetris>
            :
            <StyledTetris>
                <aside>
                    <div>
                        <Display text="Koniec gry!" />
                        <Display text={`Wynik: ${this.state.points}`} />
                        <Display text={`Wiersze: ${this.state.rowsCleared}`} />
                        <Display text={`Poziom: ${this.state.level}`} /> 
                    </div>
                    <StartButton 
                        handleGameStart={this.resetGame}
                    />
                </aside>
            </StyledTetris>
            }
            </StyledTetrisWrapper>
        );
    };
};

export default Tetris;