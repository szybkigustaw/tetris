import React from "react";
import "./styles/Pane.css"
import "./styles/TechStack.css";


const TechStack = (props) => {

    return(
        <div className="pane-main">
            <a 
                className="reactjs"
                href="https://reactjs.org"
            >
                <div><img
                    src={require('../../images/reactjs.png')}
                    alt="reactjs" 
                /></div>
                <p>React.js - biblioteka wykorzystana do zbudowania interfejsu użytkownika.</p>
            </a>
            <a
                className="redux"
                href="https://redux.js.org"
            >
                <div><img
                    src={require('../../images/redux.png')}
                    alt="redux" 
                /></div>
                <p>Redux - przewidywalny kontener przechowujący stany.</p>
            </a>
            <a
                className="react-router"
                href="https://reactrouter.com"
            >
                <div><img
                    src={require('../../images/reactrouter.png')}
                    alt="react-router" 
                /></div>
                <p>React Router - biblioteka umożliwiająca tzw. "client side routing".</p>
            </a>
        </div>
    );
}

export default TechStack;