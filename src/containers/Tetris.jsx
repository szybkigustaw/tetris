/*
    Tetris - komponent stanowiący kontener dla pozostałych komponentów gry oraz zawierający całą jej logikę.
    Kontroluje przebieg rozgrywki, aktualizuje stan macierzy oraz przechowuje informacje o stanie gry.

    W nim rysowane są również komponenty informacyjne (Display, DisplayHold), wyświetlające informacje ze stanu gry
    (zdobyte punkty, wyczyszczone wiersze, przechowywane Tetromino itp.).

    Zawiera również element Navigate, przekierowujący przy użyciu "client-side routingu" na ekran podsumowania gry
    (GameResult).
*/

//Import wszystkich potrzebnych komponentów
import React from "react";
import Stage from "./Stage";
import Display from "../components/Display";
import DisplayHold from "../components/DisplayHold";
import { TETROMINOS } from "../utils/tetrominos";
import { StyledTetris, StyledTetrisWrapper } from "./styles/StyledTetris";
import { Navigate } from "react-router";
class Tetris extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            //"Worek" z Tetrominami - zapewnia jednolitość upuszczanych klocków 
            //(nie mogą wystąpić dwa tego samego rodzaju bez uprzedniego opróżnienia worka)
            random_bag: [
                TETROMINOS['I'], TETROMINOS['J'], TETROMINOS['L'], TETROMINOS['O'], TETROMINOS['S'], 
                TETROMINOS['Z'], TETROMINOS['T']
            ],

            //Aktualny stan gracza 
            //(pozycja w macierzy, sterowane Tetromino, czy koliduje ze sceną / wypełnionymi komórkami)
            player: {
                pos: {x: 0, y: 0},
                tetromino: TETROMINOS[0],
                collided: false
            },

            //Aktualny stan sceny
            stage: this.createStage(),

            //Aktualnie przechowywane Tetromino
            held_tetromino: null,

            //Zmienna kontrolna - gwarantuje możliwość tylko jednokrotnej 
            //podmiany Tetromina przed jego opuszczeniem
            can_be_switched: true,

            //Interwał samoczynnego opadu Tetromina
            drop_time: 1000,

            //Czas gry (w sekundach)
            playtime: 0,

            //Zmienna kontrolna - gdy true: gra jest przerywana
            gameOver: false,

            //Zmienna kontrolna - gdy true: wewnętrzne zegary są zatrzymywane, 
            //stan gry zapisywany a jej przebieg wstrzymywany
            pause: false,

            //Aktualna ilość wierszy wyczyszczonych
            rows_cleared: 0,

            //Aktualna ilość zdobytych punktów
            points: 0,

            //Poziom gry
            level: 1,

            //Ilość wierszy wymagana do osiągnięcia kolejnego poziomu
            required_to_level: 5
        };

        //Metoda odpowiedzialna za przygotowanie macierzy na scenie
        this.createStage = this.createStage.bind(this);

        //Metoda odpowiedzialna za losowanie Tetrominów z "worka"
        //oraz jego stopniowe opróżnianie, a także uzupełnianie w przypadku
        //całkowitego opróżnienia
        this.drawFromBag = this.drawFromBag.bind(this);

        //Metoda rejestrująca naciśnięcia klawiszy i interpretująca je na
        //zdarzenia w grze
        this.registerKeyPresses = this.registerKeyPresses.bind(this);

        //Metoda sprawdzająca kolizję aktualnego Tetromina ze sceną / 
        //wypełnionymi komórkami
        this.checkCollision = this.checkCollision.bind(this);

        //Metoda odpowiedzialna za przesuwanie Tetromina w osi X
        this.move = this.move.bind(this);

        //Metoda odpowiedzialna za przesuwanie Tetromina w osi Y
        this.drop = this.drop.bind(this);

        //Metoda odpowiedzialna za maksymalne możliwe przesunięcie
        //Tetromina w osi Y
        this.hardDrop = this.hardDrop.bind(this);

        //Metoda odpowiedzialna za obrót Tetromina
        this.rotate = this.rotate.bind(this);

        //Metoda odpowiedzialna za wykonanie obrotu Tetromina
        //oraz sprawdzenie fizycznej możliwości takiego manewru
        this.rotatePlayer = this.rotatePlayer.bind(this);

        //Metoda odpowiedzialna za resetowanie stanu gry
        this.resetGame = this.resetGame.bind(this);

        //Metoda odpowiedzialna za resetowanie stanu gracza
        this.resetPlayer = this.resetPlayer.bind(this);

        //Metoda odpowiedzialna za czyszczenie wypełnionych
        //wierszy oraz przyznawanie za nie punktów
        this.clearRows = this.clearRows.bind(this);

        //Metoda odpowiedzialna za kontrolowanie poziomu gry
        //oraz reagowania na osiąganie pułapów zmian poziomu
        this.checkLevel = this.checkLevel.bind(this);

        //Metoda odpowiedzialna za podmienianie Tetromina
        //aktualnego z przechowywanym
        this.switchHold = this.switchHold.bind(this);

        //Metoda odpowiedzialna za wstrzymywanie i 
        //wznawianie gry
        this.switchPause = this.switchPause.bind(this);

        //Stałe wartości określające wysokość i szerokość sceny
        this.STAGE_HEIGHT = 20
        this.STAGE_WIDTH = 10

        //ZEGARY WEWNĘTRZNE

        //Zegar odpowiedzialny za kontrolowanie samoczynnego
        //opadu Tetromina
        this.gameInterval = null;

        //Zegar odpowiedzialny za naliczanie czasu gry
        this.timer = null;
    };


    //Metoda odpowiedzialna za przygotowanie macierzy na scenie
    createStage(){

        /* Tworzymy zmienną przechowującą dwuwymiarową tablicę - naszą macierz */
        const stage = Array.from(Array(this.STAGE_HEIGHT), () => (

            //Wypełniamy ją komórkami pustymi (brak złączenia z macierzą, brak elementu na nich)
            new Array(this.STAGE_WIDTH).fill(['0', 'clear']) 
        ));

        //Zwrócenie gotowej macierzy
        return stage;
    }

    //Metoda cyklu życia komponentu - wywoływana w momencie "zamontowania" komponentu w drzewie DOM Reacta
    componentDidMount(){
        this.resetGame(); //Zresetuj stan gry
        document.querySelector("div.game-wrapper").focus(); //Złap "fokusa" na Wrapperze obszaru gry
    }

    //Metoda cyklu życia komponentu - wywoływana w momencie aktualizacji stanu komponentu
    componentDidUpdate(prevProps, prevState){

        //Jeśli gra jest skończona lub spauzowana - zatrzymaj zegary gry
        if(this.state.gameOver){
            clearInterval(this.gameInterval);
            clearInterval(this.timer);
        };

        //Jeśli gracz koliduje - zresetuj jego pozycję (dotarł na spód sceny)
        if(this.state.player.collided){ this.resetPlayer(); }
        
        //Jeśli stan gracza uległ zmianie:
        if(prevState.player.pos !== this.state.player.pos){
        

        //Dokonaj zcalenia komórek, które zcalone być powinny z macierzą i dokonaj jej ponownego 
        //wyrenderowania (bez uwzględnienia gracza)
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

                        //Sprawdzanie, czy element powinien przy następnym renderze zostać scalony z macierzą
                        `${this.state.player.collided ? 'merged' : 'clear'}` 
                    ];
                }
            })
        ))

        //Jeśli gracz koliduje (osiągnął spód sceny)
        if(this.state.player.collided){

            //Zresetuj stan gracza
            this.resetPlayer();

            //Sprawdź, czy nie ma wypełnionych wierszy na scenie i wyczyść je
            const clearRowsRes = this.clearRows(newStage);

            //Sprawdź czy nie doszło do zmiany poziomu gry
            const checkLevelRes = this.checkLevel(this.state.level, 
                                                  this.state.rows_cleared + clearRowsRes[1], 
                                                  this.state.required_to_level, 
                                                  this.state.drop_time);

            //Zaktualizuj stan gracza
            this.setState(prevState => ({
                random_bag: this.state.random_bag,
                player: this.state.player,
                stage: clearRowsRes[0], //Przypisz zredukowaną scenę
                held_tetromino: prevState.held_tetromino,
                can_be_switched: true, //Przełącz zmienną - już można podmienić Tetromino
                drop_time: checkLevelRes[2], //Przypisz nowy interwał
                playtime: prevState.playtime,
                gameOver: false,
                pause: prevState.pause,
                rows_cleared: prevState.rows_cleared + clearRowsRes[1], //Zaktualizuj ilość wyczyszczonych wierszy
                points: prevState.points + clearRowsRes[2], //Zaktualizuj ilość punktów
                level: checkLevelRes[0], //Zaktualizuj poziom
                required_to_level: checkLevelRes[1] //Zaktualizuj wymagany pułap
            }));

            //Zakończ metodę
            return;
        }

        //Zaktualizuj stan gry
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
    }

    //Metoda sprawdzająca kolizję aktualnego Tetromina ze sceną / 
    //wypełnionymi komórkami
    checkCollision(player, stage, {x: moveX, y: moveY}){

        //Jeśli gra nie jest skończona:
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

    //Metoda odpowiedzialna za czyszczenie wypełnionych
    //wierszy oraz przyznawanie za nie punktów
    clearRows(stage){

        //Utwórz zmienną przechowującą dane o wyczyszczonych wierszach
        let rows_cleared = 0;

        //"Zredukuj" scenę - usuń wiersze, w których nie ma ani jednej pustej komórki;
        const filteredStage = stage.reduce((accumulator, row) => {
            if(row.findIndex(cell => cell[0] === "0") === -1){

                //Zwiększ wartość zmiennej zliczającej
                rows_cleared++;

                //Wprowadź do zmiennej kumulującej wiersz pustych komórek
                accumulator.unshift(new Array(stage[0].length).fill(['0','clear']));

                //Zwróć zmienną kumulującą
                return accumulator;
            } else {

                //Jeśli wiersz nie jest pełny, zwróć go do zmiennej
                accumulator.push(row);

                //Zwróć zmienną kumulującą
                return accumulator;
            }
        }, []);

        //Stwórz zmienną przechowującą dane o przyznanych punktach
        let score;

        //Przyznaj ilość punktów w oparciu o ilość wyczyszczonych wierszy
        // * aktualny poziom.
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

        //Zwróć zredukowaną scenę, ilość wyczyszczonych wierszy oraz przyznane punkty
        return [filteredStage, rows_cleared, score];
    }

    //Metoda odpowiedzialna za kontrolowanie poziomu gry
    //oraz reagowania na osiąganie pułapów zmian poziomu
    checkLevel(current_level, rows_cleared, required_to_level, current_drop_time){
        let level = current_level; //aktualny poziom
        let req = required_to_level; //akutalna wymagana ilość wyczyszczonych wierszy
        let drop_time = current_drop_time; //aktualny interwał opadu

        //Jeśli wiersze wyczyszczone przekraczają pułap
        if(rows_cleared >= required_to_level){
            level++; //Zwiększ poziom
            req = required_to_level + (5 * level); //Zwiększ pułap o (nowy poziom * 5)
            drop_time = level <= 8 ? (drop_time * 0.65) : (drop_time * 0.55) //Zmniejsz interwał zgodnie z poziomem
            /*
                1-8 poziom: 65% obecnego interwału
                9^ poziom: 55% obecnego interwału
             */
        }

        //Zwróć poziom, wymaganą ilość wyczyszczonych wierszy oraz interwał opadu
        return [level, req, drop_time];
    }

    //Metoda odpowiedzialna za podmienianie Tetromina
    //aktualnego z przechowywanym
    switchHold(player){

        //Jeśli gra nie jest skończona
        if(!this.state.gameOver){

            //Jeśli obecnie nie przechowujemy żadnego Tetromina
            if(this.state.held_tetromino === null){

                //Zaktualizuj stan gry
                this.setState(prevState => ({
                    random_bag: prevState.random_bag,
                    player: this.resetPlayer(), //Zresetuj pozycję gracza
                    stage: prevState.stage,
                    held_tetromino: prevState.player.tetromino, //Przypisz kontrolowane Tetromino
                    can_be_switched: prevState.can_be_switched, //Poprzedni stan = false
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    pause: prevState.pause,
                    gameOver: false,
                    rows_cleared: prevState.rows_cleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }))

                //Jeśli już przechowujemy Tetromino, ale możemy je podmienić
            } else if(this.state.can_be_switched){

                //Przechowaj w zmiennej obecnie przechowywane Tetromino
                const cur_held_tetromino = this.state.held_tetromino;

                //Przechowaj w zmiennej obecnie kontrolowane tetromino
                const cur_tetromino = player.tetromino;

                //Zaktualizuj stan gry
                this.setState(prevState => ({
                    random_bag: prevState.random_bag,

                    //Gracz ma zostać zresetowany, lecz jego Tetrominem 
                    //ma być obecnie przechowane Tetromino
                    player: {
                        pos: {x: this.STAGE_WIDTH / 2 - 2 , y: 0},
                        tetromino: cur_held_tetromino,
                        collided: false
                    },
                    stage: prevState.stage,
                    held_tetromino: cur_tetromino, //Przypisz poprzednio kontrolowane tetromino
                    can_be_switched: false, //Przełącz zmienną - nie można już dokonać podmiany
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    gameOver: false,
                    pause: prevState.pause,
                    rows_cleared: prevState.rows_cleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }))

                //Jeśli nie spełniono żadnego warunku
            } else {

                //Zakończ metodę
               return; 
            }
        }
    }

    //Metoda odpowiedzialna za obrót Tetromina
    rotate(tetromino, dir){
        
        //Dokonaj przestawienia komórek - wiersze 
        //przerzucone na kolumny i vice versa
        const rotated_tetromino = tetromino.map((_, index) => (
            tetromino.map(col => col[index])
        ))

        //Jeśli wartość obrotu jest dodatnia - wykonaj obrót zgodnie z ruchem wskazówek zegara
        if(dir > 0) rotated_tetromino.map(row => row.reverse());

        //Jeśli ujemna - odwrotny do ruchu wskazówek zegara
        else rotated_tetromino.reverse();

        //Zwróć obrócone Tetromino
        return rotated_tetromino;
    }

    //Metoda odpowiedzialna za wykonanie obrotu Tetromina
    //oraz sprawdzenie fizycznej możliwości takiego manewru
    rotatePlayer(dir){


        //Stwórz "głęboką" kopię gracza - brak referencji do obecnego stanu gracza
        const player_copy = JSON.parse(JSON.stringify(this.state.player));

        //Odwróć Tetromino w kopii gracza
        player_copy.tetromino = this.rotate(player_copy.tetromino, dir);

        //Pobierz obecną wartość pozycji X
        const cur_pos_x = player_copy.pos.x;

        //Stwórz zmienną odchyłu
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
            player: player_copy, //Zaktualizuj stan gracza
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

    //Metoda odpowiedzialna za przesuwanie Tetromina w osi X
    move(dir){

        //Jeśli gra nie jest skończona:
        if(!this.state.gameOver){

            //Jeśli nie występuje kolizja 
            if(!this.checkCollision(this.state.player, this.state.stage, {x: dir, y: 0})) {

                //Zaktualizuj stan gry
                this.setState(prevState => ({
                    random_bag: prevState.random_bag,
                    stage: prevState.stage,
                    held_tetromino: prevState.held_tetromino,
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    gameOver: prevState.gameOver,
                    pause: prevState.pause,
                    player: {

                        //Zwiększ pozycję w osi X o podaną wartość
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

    //Metoda odpowiedzialna za przesuwanie Tetromina w osi Y
    drop(){

        //Jeśli gra nie jest skończona:
       if(!this.state.gameOver){

        //Jeśli nie dochodzi do kolizi:
        if(!this.checkCollision(this.state.player, this.state.stage, {x: 0, y: 1})){

            //Zaktualizuj stan gry
            this.setState(prevState => ({
                    random_bag: prevState.random_bag,
                    stage: prevState.stage,
                    held_tetromino: prevState.held_tetromino,
                    drop_time: prevState.drop_time,
                    playtime: prevState.playtime,
                    gameOver: prevState.gameOver,
                    pause: prevState.pause,
                    player: {

                        //Zaktualizuj pozycję gracza w osi Y o 1
                        pos: {x: prevState.player.pos.x, y: prevState.player.pos.y + 1},
                        tetromino: prevState.player.tetromino,
                        collided: false
                    },
                    rows_cleared: prevState.rows_cleared,
                    points: prevState.points,
                    level: prevState.level,
                    required_to_level: prevState.required_to_level
                }));

                //Jeśli dochodzi do kolizji:
            } else {

                //Jeśli gracz znajduje się na szczycie macierzy:
                if(this.state.player.pos.y < 1){

                    //Zaktualizuj stan gry
                    this.setState(prevState => ({
                        random_bag: prevState.random_bag,
                        player: prevState.player,
                        stage: prevState.stage,
                        held_tetromino: prevState.held_tetromino,
                        drop_time: prevState.drop_time,
                        playtime: prevState.playtime,
                        gameOver: true, //Przełącz zmienną - gra się kończy
                        pause: prevState.pause,
                        rows_cleared: prevState.rows_cleared,
                        points: prevState.points,
                        level: prevState.level,
                        required_to_level: prevState.required_to_level
                    })); 

                    //Jeśli nie:
                } else {

                    //Zakualizuj stan gry
                    this.setState(prevState => ({
                        random_bag: prevState.random_bag,
                        stage: prevState.stage,
                        held_tetromino: prevState.held_tetromino,
                        can_be_switched: prevState.can_be_switched,
                        drop_time: prevState.drop_time,
                        playtime: prevState.playtime,
                        gameOver: prevState.gameOver,
                        pause: prevState.pause,
                        player: {
                            pos: {x: prevState.player.pos.x, y: prevState.player.pos.y},
                            tetromino: prevState.player.tetromino,
                            collided: true //Przełącz zmienną - gracz koliduje (osiągnął spód macierzy)
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

    //Metoda odpowiedzialna za maksymalne możliwe przesunięcie
    //Tetromina w osi Y
    hardDrop(player, stage){

        //Stwórz zmienną przechowującą ilość kroków do wykonania w osi Y
        let add_pos_y = 0;

        //Dopóki nie koliduje gracz (nie osiągnie spodu sceny)
        while(!this.checkCollision(player, stage, {x: 0, y: add_pos_y})){
            add_pos_y++; //Zwiększaj wartość zmiennej.
        }

        //Zaktualizuj stan gracza
        this.setState(prevState => ({
            random_bag: prevState.random_bag,
            player: {

                //Zwiększ pozycję w osi Y o wartość zmiennej - 1 
                pos: {x: prevState.player.pos.x, y: prevState.player.pos.y + add_pos_y - 1},
                tetromino: prevState.player.tetromino,

                //Osiągnęliśmy możliwy spód sceny - Tetromino koliduje
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

    //Metoda odpowiedzialna za losowanie Tetrominów z "worka"
    //oraz jego stopniowe opróżnianie, a także uzupełnianie w przypadku
    //całkowitego opróżnienia
    drawFromBag(Bag){

        //Stwórz zmienną - ciąg znaków reprezentujący znane Tetromina
        const tetrominos = "IJLOSZT";

        //Stwórz zmienną - reprezentację "worka"
        let bag = Bag;

        //Jeśli worek jest pusty:
        if(bag.length === 0){
            
            //Stwórz nowy worek
            bag = new Array(7);

            //Uzupełnij go Tetrominami
            for(let i = 0; i < bag.length; i++){
                bag[i] = TETROMINOS[tetrominos[i]];
            }
        }

        //Wylosuj Tetromino
        const drawn_tetromino = bag[Math.floor(Math.random() * bag.length)];

        //Po wylosowaniu przefiltruj worek tak, aby wylosowany element się w nim nie znajdował
        bag = bag.length > 0 ? bag.filter(tetromino => tetromino.shape !== drawn_tetromino.shape) : new Array(0);

        //Zwróc wylosowane Tetromino oraz worek
        return [drawn_tetromino, bag];
    }

    //Metoda odpowiedzialna za resetowanie stanu gry
    resetGame(){

        //Poierz Tetromino z worka
        const drawResult = this.drawFromBag(this.state.random_bag);

        //Przypisz nowy stan gry
        this.setState(prevState => ({
            random_bag: drawResult[1], //Nowy stan worka

            //Nowy san gracza
            player: { 
                pos: {x: this.STAGE_WIDTH / 2 - 2, y: 0},
                tetromino: drawResult[0].shape,
                collided: false
            },

            //I wartości startowe pozostałych pól stanowych
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

        //Ustaw zegar odmierzający interwały opadu Tetromina
        this.gameInterval = setInterval(() => { if(!(this.state.gameOver || this.state.pause)) this.drop() }, this.state.drop_time);

        //Ustaw interwał zwiększający czas gry o 1 co sekundę
        this.timer = setInterval(() => {
            if(!(this.state.pause)){
            this.setState(prevState => ({
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
        }))}}, 1000);
    }

    //Metoda odpowiedzialna za resetowanie stanu gry
    resetPlayer(){

        //Poierz Tetromino z worka
        const drawResult = this.drawFromBag(this.state.random_bag);

        //Przypisz nowy stan gry
        this.setState(prevState => ({
            random_bag: drawResult[1], //Nowy worek

            //Nowy stab gracza
            player: {
                pos: {x: this.STAGE_WIDTH / 2 - 2, y: 0},
                tetromino: drawResult[0].shape,
                collided: false
            },

            //Reszta pozostaje bez zmian
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

    //Metoda odpowiedzialna za wstrzymywanie i 
    //wznawianie gry
    switchPause(){

        //Zaktualizuj stan gry
        this.setState(prevState => ({
            player: prevState.player,
            stage: prevState.stage,
            random_bag: prevState.random_bag,
            held_tetromino: prevState.held_tetromino,
            drop_time: prevState.drop_time,
            playtime: prevState.playtime,
            gameOver: prevState.gameOver,
            pause: prevState.pause === false ? true : false, //Przestaw zmienną na przeciwną wartość
            rows_cleared: prevState.rows_cleared,
            points: prevState.points,
            level: prevState.level,
            required_to_level: prevState.required_to_level
        }));

        console.log(this.state.pause);

        
    }

    //Metoda rejestrująca naciśnięcia klawiszy i interpretująca je na
    //zdarzenia w grze
    registerKeyPresses(e){

        //Dopóki gra nie jest skończone
        if(!this.state.gameOver){

        //Interpretuj naciśnięcia klawiszy na odpowiednie metody 
        //(więcej na stronie Pomocy w zakładce Sterowanie)
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

    //Wyrenderuj komponent
    render(){
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
                <h1
                    style={{textAlign: 'center'}}   
                >
                    Pauza
                </h1>
                <button 
                    onClick={this.switchPause}
                    style={{
                        backgroundColor: 'rgba(135, 206, 250, 0.4)',
                        padding: '1vh 1vw',
                        border: '1px solid rgb(135,206,250)',
                        borderRadius: "5px",
                        margin: "auto 45vw",
                        color: "rgb(0, 0, 139)"
                    }}
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
