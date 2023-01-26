function setCurrentUser(currentUserId, currentUsername) {
    localStorage.setItem('currentUserId', currentUserId);
    localStorage.setItem('currentUsername', currentUsername);
}

function getCurrentUser() {
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUsername = localStorage.getItem('currentUsername');

    if (!currentUserId || !currentUsername)
       return undefined;
    
    return {currentUserId, currentUsername};
}

module.exports = {
    setCurrentUser,
    getCurrentUser
}