import React from "react";
import "./styles/Pane.css";
import "./styles/Rules.css"

const Rules = (props) => {

    return(
        <div className="pane-main-rules">
            <div className="general">
                <h2>Zasady ogólne</h2>
                <p>
                    Gra rozgrywa się na macierzy, złożonej z 20 wierszy i 
                    10 kolumn komórek. Celem gracza jest manipulowanie spadającymi
                    z góry macierzy klockami - Tetrominami - tak, aby układać z nich wiersze.
                </p>
                <p>
                    Każdy wypełniony wiersz zostaje usunięty i przyznawane za niego zostają punkty.
                    Gra kończy się w momencie, w którym chociaż jedna z kolumn komórek zostanie zapełniona.
                </p>
            </div>

            <div className="points">
                <h2>Przyznawanie punktów</h2>
                <p>
                    Gra przyznaje punkty za każdy wypełniony wiersz. Wypełnienie jednoczesne
                    do czterech wierszy nagradzane jest bonusowymi punktami. Ilość punktów otrzymywanych
                    wzrasta wraz z poziomem gry.
                </p>
                <p>Oto przyznawana punktacja podstawowa: </p>
                <ul>
                    <li><b>1 wiersz</b> - 200</li>
                    <li><b>2 wiersze</b> - 400</li>
                    <li><b>3 wiersze</b> - 800</li>
                    <li><b>4 wiersze</b> - 2000</li>
                </ul>
            </div>

            <div className="time">
                <h2>System czasu</h2>
                <p>
                    Gra nie pozwala na chwilę wytchnienia. Cały czas nieubłaganie Tetromina spadają
                    w równych odstępach czasu. Ten odstęp czasowy spada wraz z poziomem.
                </p>
            </div>

            <div className="tetrominos">
                <h2>Tetromina</h2>
                <p>
                    W grze występuje siedem rodzajów klocków - tzw. Tetrominów.
                    Kształtem odpowiadają następującym literom: I, J, L, O, S, Z, T.
                </p>
                <p>
                    W grze można przechować jeden z Tetromin i wykorzystać go później.
                    W przechowaniu zawsze występuje jeden element (wyjątek - początek gry).
                    Po podmianie Tetromina następna jest możliwa dopiero, gdy obecne Tetromino znajdzie się na dole.
                </p>
                <p>
                    W grze występuje także mechanizm "worka" z Tetrominami, tzn. w obiegu jest wyłącznie 7 elementów.
                    Dopóki wszyskie nie zostaną wykorzystane, nie może pojawić się następny tego samego rodzaju.
                </p>
            </div>
        </div>
    );
}

export default Rules;