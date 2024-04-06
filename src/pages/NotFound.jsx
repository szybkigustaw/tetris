/*
    NotFound - komponent reprezentujący stronę z błędem 404. 
    Wykorzystywana, gdy użytkownik próbuje odnieść się do 
    lokalizacji, której React Router nie przewiduje. 
*/
import React from 'react';
import "./styles/NotFound.css";

class NotFound extends React.Component{
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