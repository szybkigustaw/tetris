/*
    Cell - komponent odpowedzialny za renderowanie komórki w macierzy.
    Jako własności przyjmuje typ oraz kolor komórki. Renderowany jest wewnątrz macierzy
    (patrz: Stage.jsx).
*/

import React from "react";
import { TETROMINOS } from "../utils/tetrominos"; //Pobieramy listę Tetrominów dostępnych w grze
import StyledCell from "./styles/StyledCell";

class Cell extends React.Component{
    constructor(props){
        super(props)
    };

    render(){

        return(
            <StyledCell 
                type={this.props.type}
                color={TETROMINOS[this.props.type].color}
            />
        );
    };
};

export default Cell;