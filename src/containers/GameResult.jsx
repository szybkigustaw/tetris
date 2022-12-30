/*
    GameResult - komponent reprezentujący stronę z podsumowaniem gry. 
    Informacje o pochodzeniu (jeśli nie odwiedzamy tej strony z poziomu 
    strony gry, cofa nas do strony głównej) oraz o wynikach pozyskuje ze stanu
    przekazywanego do React Routera. Wyniki uzupełnione o pseudonim gracza zapisywane
    są potem do kontenera Redux - dla łatwego dostępu na stronie Tablicy Wyników.
*/

import { React, useState } from "react";
import Display from "../components/Display";
import { useLocation, Navigate } from "react-router";
import { useStore } from "react-redux";
import './styles/GameResult.css';

//Funkcja zapisuje dane o wynikach w kontenerze Redux.
const saveScore = (score, store, player_name) => {

    //Wyślij akcję do zarządzacza kontenerem Reduxa
    store.dispatch({
        type: 'scoreAdded',
        payload: {
            id: store.getState().length,
            player_name: player_name,
            rows_cleared: score.rows_cleared,
            level: score.level,
            time: score.time,
            points: score.points
        }
    });
}

const GameResult = props => {
    const store = useStore();
    const location = useLocation();
    const [redirect_to_home, setRTH] = useState(() => undefined);
    const [player_name, setName] = useState(() => undefined);

    //Jeśli odwiedzamy stronę "z zewnątrz" - odeślij nas do strony głónej
    if(!(props.fromGame || location.state.fromGame)){
        setRTH(true);
    }

    

    return(
        <div className="game-result-main">
        <header className="game-result-header">
            <h1>Koniec gry!</h1>
        </header>
        <div className="results">
            <Display text={`Wiersze wyczyszczone: ${location.state.score.rows_cleared}`}/>
            <Display text={`Poziom: ${location.state.score.level}`}/>
            <Display text={`Czas: ${location.state.score.time}`}/>
            <Display text={`Wynik: ${location.state.score.points}`}/>
        </div>

        <div className="enter-nick">
        <label htmlFor="nick">
            Twój nick:
            <input type="text" name="nick" id="nick" placeholder="Wprowadź swój nick"
                onChange={(e) => setName(e.target.value)}
            />
        </label>
        </div>

        <div className="save-menu">
            <h2>Zapisać w tabeli?</h2>
            <span>
            <button onClick={() => {
                saveScore(location.state.score, store, player_name);
                setRTH(false);
            }}>Tak</button>
            <button onClick={() => setRTH(true)}>Nie</button>
            </span>
        </div>
        {redirect_to_home === true ? <Navigate to="/" />: (
            redirect_to_home === false ? <Navigate to="/leaderboard" /> : null
        )}
        </div>
    );

};


export default GameResult;