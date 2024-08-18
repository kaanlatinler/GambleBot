const getCard = () => {
    const card = Math.floor(Math.random() * 13) + 1;
    const suit = Math.floor(Math.random() * 4) + 1;
    return { card, suit };
};

module.exports = { getCard };