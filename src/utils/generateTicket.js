const generateTicketCode = () => {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default generateTicketCode;