/*
    StartButton - komponent reprezentujący przycisk rozpoczęcia nowej gry. Stylizowany jest podobnie do komponentu Display.
    Jako własność przyjmuje on funkcję zwrotną wywoływaną w momencie naciśnięcia przycisku.
 */

import React from "react";
import { StyledStartButton } from "./styles/StyledStartButton";

class StartButton extends React.Component{
    constructor(props){
        super(props)
    };

    render(){
        return(
            <StyledStartButton
                onClick={() => this.props.handleGameStart()}
            >Start Gaem
            </StyledStartButton>
        );
    };
}

export default StartButton;