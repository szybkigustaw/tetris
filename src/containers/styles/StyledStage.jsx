/*
    StyledStage - komponent zagnieżdżony wewnątrz komponentu Stage, odpowiedzialny za renderowanie stylizowanego komponentu. 
    Komponent ten przyjmuje w parametrach długość oraz wysokość sceny (macierzy) i  tworzy na ich podstawie stylizowaną macierz
    służącą jako pole gry.
*/

import styled from "styled-components";

export const StyledStage = styled.div`
    display: grid;
    grid-template-rows: repeat(
        ${props => props.height},
        calc(20vw / ${props => props.width})
    );
    grid-template-columns: repeat(${props => props.width}, 1fr);
    grid-gap: 1px;
    border: 2px solid #333;
    width: 100%;
    max-width: 20vw;
`;