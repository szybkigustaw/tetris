import React from 'react';
import { useStore } from 'react-redux';
import { Link } from 'react-router-dom';
import "./styles/Leaderboard.css";

const sortData = function(inputData){
    let input_data = Array.from(inputData);
    let output_data = [];
    while(output_data.length !== inputData.length){
        let max_value = input_data[0].points;
        input_data.map(data_row => (
            max_value = data_row.points > max_value ? data_row.points : max_value  
        ));

        const max_value_at = input_data.findIndex(data_row => data_row.points === max_value);
        output_data.push(input_data[max_value_at]);
        input_data = input_data.filter((_, index) => index !== max_value_at);
        if(output_data.length >= 8) break;
    }

    return output_data;
}

const Leaderboard = (props) => {
    const store = useStore();
    const data = sortData(store.getState());

    console.log(data);
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
                        {data.map((data_row, index) => (
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
                        ))}
                    </tbody>
                </table>
                <Link
                    role="button"
                    className="leaderborad-game-link"
                    to="/game"
                >
                    Zagraj jeszcze raz!
                </Link>
            </div>
        );
    };

export default Leaderboard;