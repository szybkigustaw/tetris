/**
    Leaderboard - komponent reprezentujący stronę zawierającą tablicę wyników. Wyniki pobiera z kontenera Redux 
    i wyświetla je w formie tabelarycznej. Pierwsze 3 wyniki są specjalnie kolorowane. Z poziomu tej strony można
    rozpocząć nową grę bądź wrócić do menu głównego.
 */

import React from 'react';
import { useStore } from 'react-redux';
import { Link } from 'react-router-dom';
import "./styles/Leaderboard.css";

//Funkcja sortuje dane w kolejności od największej do najmniejszej
const sortData = function(inputData){

    //Stwórz zmienne reprezentujące wejście i wyjście danych
    let input_data = Array.from(inputData);
    let output_data = [];

    //Dopóki wyjściowa tablica nie osiągnie długści wejściowej tablicy
    while(output_data.length !== inputData.length){

        //Wyłuskaj najwyższą wartość punktową w tablicy wejściowej
        let max_value = input_data[0].points;
        input_data.map(data_row => (
            max_value = data_row.points > max_value ? data_row.points : max_value  
        ));

        //Znajdź indeks obiektu, w którym punkty są najwyższe
        const max_value_at = input_data.findIndex(data_row => data_row.points === max_value);

        //Wprowadź ten obiekt do tablicy wyjściowej
        output_data.push(input_data[max_value_at]);

        //Przefiltruj tablicę wejściową - pozbądź się najwyższej wartości
        input_data = input_data.filter((_, index) => index !== max_value_at);

        //Jeśli długość tablicy wyjściowej jest równa lub większa od 8 - przerwij pętlę
        if(output_data.length >= 8) break;
    }

    //Zwróć posortowaną tablicę
    return output_data;
}

const Leaderboard = (props) => {
    const store = useStore();
    const data = sortData(store.getState());

    console.log(data);
    console.log(data.length);

        return(
            <div className="leaderboard-main">
            <header className="leaderboard-header">
                <h1>
                    Tablica wyników
                </h1>
            </header>
                <table className="leaderboard">
                    <thead>
                        <tr>
                            <th>Lp.</th>
                            <th>Gracz</th>
                            <th>Wiersze</th>
                            <th>Poziom</th>
                            <th>Czas</th>
                            <th colSpan={2}>Wynik</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        data.map((data_row, index) => (
                            <tr
                                key={data_row.id}
                            >
                                <td>{index + 1}</td>
                                <td>{data_row.player_name}</td>
                                <td>{data_row.rows_cleared}</td>
                                <td>{data_row.level}</td>
                                <td>{data_row.time}</td>
                                <td colSpan={2}>{data_row.points}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
                <span className="leaderboard-button-bar">
                <Link
                    role="button"
                    className="leaderboard-game-link"
                    to="/game"
                >
                    Zagraj jeszcze raz!
                </Link>
                <Link
                    role="button"
                    className='leaderboard-game-link'
                    to="/"
                >
                    Do Menu Głównego
                </Link>
                </span>
            </div>
        );
    };

export default Leaderboard;