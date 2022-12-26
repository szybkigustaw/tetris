import React from 'react';
import Tetris from './containers/Tetris';

class App extends React.Component {
        constructor(){
                super()
        };

        render(){
                return(
                        <div className="App">
                                <Tetris />
                        </div>
                );
        };
}

export default App;
