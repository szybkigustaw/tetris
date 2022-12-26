/*
    Display - komponent przedstawiający pojedyńcze "okienko" z informacją.
    Jak własność przyjmuje tekst do wyświetlenia.
*/
import React from "react";
import HoldMatrix from "../containers/HoldMatrix";
import { StyledDisplayHold } from "./styles/StyledDisplayHold";

class DisplayHold extends React.Component{
    constructor(props){
        super(props)
    };

    render(){

        let blank_stage = null;
        if(this.props.held_tetromino === null){
            blank_stage = Array.from(new Array(4), () => (
                new Array(4).fill(['0','clear'])
            ));
        }

        return(
            <StyledDisplayHold>
                W przechowaniu: {
                    (this.props.held_tetromino === null) ? 
                    <HoldMatrix stage={blank_stage} /> :
                    <HoldMatrix stage={this.props.held_tetromino} />                  
                }
            </StyledDisplayHold>
        );
    };
};

export default DisplayHold;