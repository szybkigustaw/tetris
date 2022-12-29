function reducer(state=[], action){
    switch(action.type){

        case "scoreAdded":
            return [
                ...state,
                {
                    id: state.length,
                    player_name: action.payload.player_name,
                    rows_cleared: action.payload.rows_cleared,
                    level: action.payload.level,
                    time: action.payload.time,
                    points: action.payload.points
                }
            ];
        default:
            return state;    
    }
};

export default reducer;