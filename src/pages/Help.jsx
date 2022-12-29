import React from 'react';
import { Link } from 'react-router-dom';

class Help extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div>
                <h1>Pomoc</h1>
                <Link to="/game">Zagraj!</Link>
            </div>
        );
    };
}

export default Help;