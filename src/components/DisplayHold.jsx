/*
    DisplayHold - Zmodyfikowany komponent Display, 
    przedstawiający okno z informacją o przechowywanym Tetrominie.
*/
import React from "react";
import HoldMatrix from "../containers/HoldMatrix";
import { StyledDisplayHold } from "./styles/StyledDisplayHold";

class DisplayHold extends React.Component{
    render(){

        //Jeśli nie jest przechowywane żadne Tetromino, stwórz pustą macierz 4x4
        let blank_stage = null;
        if(this.props.held_tetromino === null){
            blank_stage = Array.from(new Array(4), () => (
                new Array(4).fill(['0','clear'])
            ));
        }

        return(
            <StyledDisplayHold>
				{this.props.title}: {
                    (this.props.held_tetromino === null) ? 
                    <HoldMatrix matrix={blank_stage} /> :
                    <HoldMatrix matrix={this.props.held_tetromino} />                  
                }
            </StyledDisplayHold>
        );
    };
};

export default DisplayHold;
