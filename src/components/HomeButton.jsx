/*
    HomeButton - komponent reprezentujący przycisk na panelu na Stronie Głównej. 
    Jako własności przyjmuje ścieżkę, do jakiej się odnosi oraz tekst, który ma wyświetlać.
*/

import React from "react";
import { Link } from "react-router-dom";
import "./styles/HomeButton.css";

class HomeButton extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <Link 
                className="home-button"
                to={this.props.path}
            >
                {this.props.text}
            </Link>
        );
    };
}

export default HomeButton;