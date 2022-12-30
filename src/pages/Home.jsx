/*
    Home - komponent reprezentujący stronę główną. Zawiera logo TETRIS, panel z przyciskami odproawdzającymi poprzez
    React Routera do innych podstron oraz stopkę z informacjami o prawach autorskich podmiotów,
*/

import React from "react";
import './styles/Home.css';
import HomeButton from "../components/HomeButton";

class Home extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div className="main">
            <div className="home-div">
                <header className="home-header">
                    <img 
                        className="app-logo"
                        src={require("../images/logo.png")} 
                        alt="TETRIS Logo" 
                    />
                </header>
                <div className="button-bar">
                    <HomeButton path="/game" text="Graj" />
                    <HomeButton path="/help" text="Pomoc"/>
                    <HomeButton path="/leaderboard" text="Tablica wyników"/>
                </div>
                <div className="spacer" />
                <footer>
                    <p>Prawa autorskie do logotypu TETRIS oraz konceptu gry należą do 
                        <a href="https://tetris.com/">
                            &nbsp; The Tetris Company.
                        </a>
                    </p>
                    <p>Tło strony autorstwa Andy'ego Holmes'a dla  
                        <a
                            href="https://unsplash.com/photos/rCbdp8VCYhQ"
                        >
                            &nbsp;unsplash.com.
                        </a>
                    </p>
                </footer>
            </div>
            </div>
        );
    };
};

export default Home;