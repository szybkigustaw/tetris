/*
    StyledTetris - komponent zagnieżdzony wewnątrz komponentu StyledTetrisWrapper, 
    odpowiedzialny za renderowanie stylizowanego pola gry. Nie przyjmuje własności, 
    tworzy stylizowany komponent zawierający macierz komórek. okna z informacjami 
    oraz przycisk rozpoczęcia gry.

    StyledTetrisWrapper - komponent zagnieżdżony wewnątrz komponentu Tetris, 
    odpowiedzialny za stworzenie otoczki wokół pola gry. Jako własność przyjmuje 
    funkcję zwrotną odpowiedzialną za rejestrowanie naciśnięć klawiszy na klawiaturze 
    (patrz. Tetris.jsx). Stylizuje wyłącznie tło za polem gry. 
*/
import styled from "styled-components";

//Wrapper okna gry
export const StyledTetrisWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: url(${require('../../images/background.jpg')});
    background-size: cover;
    background-repeat: no-repeat;
`;

//Właściwa przestrzeń z grą
export const StyledTetris = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px;
    margin auto auto;
    max-width: 40vw;
    overflow: hidden;

    aside{
        width: 100%;
        max-width: 30vw;
        height: 100%;
        display: block;
        padding: 0 20px;
    }
`;
