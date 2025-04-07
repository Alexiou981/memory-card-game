import React from 'react';

const CardDeck = ({ id, context, isFlipped, onSelect}) => {

    // Handler for when the card is clicked
    const handleClick = () => {
        onSelect({ id, context, isFlipped });
    };
    
    return (
        <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
        {isFlipped ? context : '?'}
        </div>
    );
}

export default CardDeck;