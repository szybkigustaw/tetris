import React from 'react';
import "./styles/NotFound.css";

class NotFound extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div className="main">
                <h1>404</h1>
                <h2>Not found</h2>
            </div>
        );
    };
}

export default NotFound;