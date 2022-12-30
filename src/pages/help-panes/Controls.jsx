/*
    Controls - komponent reprezentujący "szybę" wbudowywaną w stronę Help. Zawiera informacje o sterowaniu w grze,
*/

import React from "react";
import "./styles/Pane.css";
import "./styles/Controls.css";

const Controls = (props) => {

    return(
        <div className="pane-main">
            <ul>
                <li><b>Strzałka w lewo/prawo</b> - przesuwanie Tetromina na boki.</li>
                <li><b>Strzałka w górę</b> - obrót Tetromina o 90&#176;, ruch zgodnie z ruchem wskazówek zegara.</li>
                <li><b>Lewy Shift</b> - obrót Tetromina o 90&#176;, ruch odwrotny do ruchu wskazówek zegara.</li>
                <li><b>Strzałka w dół</b> - "soft drop" - opuszczenie Tetromina o jedną komórkę w dół.</li>
                <li><b>Spacja</b> - "hard drop" - opuszczenie Tetromina maksymalnie w dół.</li>
                <li><b>Lewy Control</b> - "hold" - przechowanie Tetromina, zamiana obecnego Tetromina z Tetrominem w schowku.</li>
                <li><b>Escape</b> - pauza, wstrzymanie gry.</li>
            </ul>
        </div>
    );
}

export default Controls;