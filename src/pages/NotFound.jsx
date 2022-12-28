import React from 'react';

class NotFound extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div>
                <h1>404</h1>
                <h2>Not found</h2>
            </div>
        );
    };
}

export default NotFound;