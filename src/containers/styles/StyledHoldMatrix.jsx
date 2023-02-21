/*
    StyledHoldMatrix - komponent zagnieżdżony wewnątrz komponentu HoldMatrix, 
    odpowiedzialny za renderowanie stylizowanego komponentu. Komponent ten 
    przyjmuje w parametrach długość oraz wysokość macierzy i tworzy na ich 
    podstawie stylizowaną macierz służącą do umieszczenia przechowywanego 
    Tetromina.
*/

import styled from "styled-components";

export const StyledHoldMatrix = styled.div`
    margin: auto auto;
    display: grid;
    grid-template-rows: repeat(
        ${props => props.height},
        calc(${props => props.width * 2}vw / ${props => props.width})
    );
    grid-template-columns: repeat(${props => props.width}, 1fr);
    grid-gap: 1px;
    border: 2px solid #333;
    width: 100%;
    max-width: ${props => props.width * 2}vw;
`;
