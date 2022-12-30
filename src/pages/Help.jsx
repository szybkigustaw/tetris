/*
    Help - komponent reprezentujący stronę pomocy. Zawiera panel z czterema zakładkami, po których
    naciśnięciu React Router w miejscu komponentu Outlet renderuje "szyby" - odpowiednie podstrony.
*/

import React from 'react';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './styles/Help.css';

const Help = (props) => {

    const [clicked, setClicked] = useState(null);

    return(
        <div className="main">
            <header className="help-header">
                <Link
                    className="home-link"
                    to="/"
                >
                    Do Głównej
                </Link>
                <h1>Pomoc</h1>
            </header>
            <div className="options-bar">
                <div className={clicked === 'controls' ? "option clicked" : 'option'}>
                    <Link
                        className="link" 
                        to="/help/controls"
                        onClick={() => setClicked('controls')}
                    >
                        Sterowanie
                    </Link>
                </div>
                <div className={clicked === 'rules' ? 'option clicked' : 'option'}>
                    <Link 
                        className='link'
                        to="/help/rules"
                        onClick={() => setClicked('rules')}
                    >
                        Zasady gry
                    </Link>
                </div>
                <div className={clicked === 'techstack' ? 'option clicked' : 'option'}>
                    <Link 
                        className='link'
                        to="/help/techstack"
                        onClick={() => setClicked('techstack')}
                    >
                        Użyte technologie
                    </Link>
                </div>
                <div className={clicked === 'credits' ? "option clicked" : 'option'}>
                    <Link 
                        className='link'
                        to="/help/credits"
                        onClick={() => setClicked('credits')}
                    >
                        Autor
                    </Link>
                </div>
            </div>
            <div className="outlet-container">
                { clicked === null ?
                    <h2
                        style={{textAlign: 'center', marginTop: '25vh'}}
                    >
                        Wybierz dowolną opcję, aby wyświetlić kartę pomocy
                    </h2>
                    :
                    <Outlet />
                }
            </div>
        </div>
    );
}

export default Help;