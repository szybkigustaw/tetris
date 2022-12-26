/*
    StyledStartButton - komponent zagnieżdżony wewnątrz komponentu StartButton, odpowiedzialny za renderowanie stylizowanego komponentu.
    Nie przyjmuje żadnych własności, tworzy stylizowany komponent przycisku rozpoczęcia gry.
*/
import styled from "styled-components";

export const StyledStartButton = styled.div`
    width: 100%;
    max-width: 15vw;
    padding: 5vh 2vw;
    text-align: center;
    margin-top: 5vh;
    border: 2px solid white;
    border-radius: 30px;
    color: white;
    background-color: black;
`;