/*
    Credits - komponent reprezentujący "szybę" wmontowywaną w stronę Help. 
    Zawiera informacje o autorze oraz źródłach
*/

import React from "react";
import "./styles/Pane.css";
import "./styles/Credits.css";

const Credits = (props) => {
 
    return(
        <div className="pane-main">
            <div className="author">
                <h2>Stworzone przez:</h2>
                <h1>Michał Mikuła</h1>
                <span>
                    <a href="https://github.com/Polaczeq22/tetris">
                        Projekt Open Source - repozytorium.
                    </a>
                    <a href="https://github.com/Polaczeq22">
                        Mój profil na GitHub.
                    </a>
                </span>
            </div>
            <div className="thanks">
                <h2>Specjalne podziękowania dla:</h2>
                <ul>
                    <li><b>Thomas Weibenfaik</b> - za 
                        <a
                            href="https://www.youtube.com/watch?v=ZGOaCxX8HIU&t=7290s"
                        >
                            &nbsp;ten poradnik pomocny przy tworzeniu tego projektu.
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Credits;