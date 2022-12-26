/* 
    StyledCell - komponent zagnieżdżony wewnątrz komponentu Cell, odpowiedzialny za renderowanie stylizowanego komponentu.
    Jako własności przyjmuje kolor komórki oraz jej typ. Tworzy komponent komórki wyświetlanej w macierzy.
*/

import styled from "styled-components";

const StyledCell = styled.div`
    width: auto;
    background-color: rgba(${props => props.color}, 0.75);
    border: ${props => (props.type === '0' ? "0px solid" : "4px solid")};
    border-bottom-color: rgba(${props => props.color}, 0.1);
    border-right-color: rgba(${props => props.color}, 1);
    border-top-color: rgba(${props => props.color}, 1);
    border-left-color: rgba(${props => props.color}, 0.25);
`;

export default StyledCell; 