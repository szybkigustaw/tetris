import Tetris from "./Tetris";
import { connect } from "react-redux";

const TetrisRedux = connect((state) => ({scores: state}))(Tetris);

export default TetrisRedux;