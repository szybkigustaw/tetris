/*
    StyledDisplay - komponent zagnieżdżony wewnątrz komponentu Display, odpowiedzialny za renderowanie stylizowanego komponentu.
    Przyjmuje jako własności tekst wyświetlany, tworzy stylizowany komponent okna z informacją podaną we własnościach.
*/
import styled from "styled-components";

export const StyledDisplay = styled.div`
    display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	width: 100%;
    max-width: 25vw;
    padding: 2vh 2vw;
    text-align: center;
    margin: 10px 0;
    font-weight: ${props => (props.text === "Koniec gry!" ? "bold" : "normal")};
    border: 2px solid ${props => (props.text === "Koniec gry!" ? "black" : "white")};
    border-radius: 30px;
    color: ${props => (props.text === "Koniec gry!" ? "black" : "white")};
    background-color: ${props => (props.text === "Koniec gry!" ? "rgba(255,0,0,0.5)" : "black")};
`;
