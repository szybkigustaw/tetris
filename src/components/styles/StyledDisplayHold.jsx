/*
    StyledDisplayHold - komponent zagnieżdżony wewnątrz komponentu DisplayHold, 
    odpowiedzialny za renderowanie stylizowanego komponentu. Tworzy stylizowany 
    komponent okna z informacją o przechowywanym Tetrominie.
*/
import styled from "styled-components";

export const StyledDisplayHold = styled.div`
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    width: 100%;
    max-width: 15vw;
    padding: 1vh 1vw;
    text-align: center;
    margin: 10px 0;
    border: 2px solid white;
    border-radius: 30px;
    color: white;
    background-color: black;
`;