/*
    Stage - komponent-kontener odpowiedzialny za renderowanie macierzy z komórkami.
    Jako własności przyjmuje informacje o stanie poszczególnych komórek.
    Renderuje macierz, wypełniając ją komponentami Cell, przekazując im dane o ich typie oraz kolorze.
*/

import React from "react";
import Cell from "../components/Cell";
import { StyledStage } from "./styles/StyledStage";

class Stage extends React.Component{
    constructor(props){
        super(props)
    };

    render(){
        const stage = this.props.stage;
        return(
            <StyledStage height={stage.length} width={stage[0].length}>
                {stage.map(row => row.map((cell, x) => (
                    <Cell key={x} type={cell[0]} />
                )))}
            </StyledStage>
        );
    };
};

export default Stage;