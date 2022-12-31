/*
    HoldMatrix - komponent-kontener odpowiedzialny za renderowanie macierzy z komórkami.
    Jako własności przyjmuje informacje o stanie poszczególnych komórek. Renderuje macierz, 
    wypełniając ją komponentami Cell, przekazując im dane o ich typie oraz kolorze. W 
    przeciwieństwie do Stage, HoldMatrix wyświetla macierz dla przechowywanego Tetromina, 
    nie całej sceny gry.
*/

import React from "react";
import Cell from "../components/Cell";
import { StyledHoldMatrix } from "./styles/StyledHoldMatrix";

class HoldMatrix extends React.Component{
    constructor(props){
        super(props)
    };

    render(){
        const matrix = this.props.matrix;
        return(
            <StyledHoldMatrix height={matrix.length} width={matrix[0].length}>
                {matrix.map(row => row.map((cell, x) => (
                    <Cell key={x} type={cell[0]} />
                )))}
            </StyledHoldMatrix>
        );
    };
};

export default HoldMatrix;