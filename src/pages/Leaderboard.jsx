import React from 'react';
import { useLocation } from 'react-router';

class Leaderboard extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div>
                <h1>Tablica wyników</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Gracz</th>
                            <th>Wiersze</th>
                            <th>Poziom</th>
                            <th>Czas</th>
                            <th colSpan={2}>Wynik</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={6}>{leaderboardLength}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };
}

export default Leaderboard;