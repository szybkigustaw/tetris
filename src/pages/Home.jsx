import React from "react";
import HomeButton from "../components/HomeButton";

class Home extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div>
                <h1>Tetris</h1>
                <div className="button-bar">
                    <HomeButton path="/game" text="Graj" />
                    <HomeButton path="/help" text="Pomoc"/>
                    <HomeButton path="/leaderboard" text="Tablica wyników"/>
                </div>
            </div>
        );
    };
};

export default Home;