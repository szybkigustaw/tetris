/*
    Display - komponent przedstawiający pojedyńcze "okienko" z informacją.
    Jak własność przyjmuje tekst do wyświetlenia.
*/
import React from "react";
import { StyledDisplay } from "./styles/StyledDisplay";

class Display extends React.Component{
    render(){

        return(
            <StyledDisplay text={this.props.text}>{ this.props.text }</StyledDisplay>
        );
    };
};

export default Display;