// CIT2011 IA2. Load saved registration details into the ticket.

document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('codingConfUser');

    if (!storedData) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const userData = JSON.parse(storedData);

        if (!userData.fullName || !userData.email || !userData.github || !userData.ticketNumber) {
            throw new Error('Registration details are incomplete.');
        }

        document.getElementById('masterName').textContent = userData.fullName;
        document.getElementById('masterEmail').textContent = userData.email;
        document.getElementById('ticketName').textContent = userData.fullName;
        document.getElementById('ticketGithub').textContent = userData.github;
        document.getElementById('ticketNumber').textContent = userData.ticketNumber;

        const avatar = document.getElementById('ticketAvatar');

        if (userData.avatar) {
            avatar.src = userData.avatar;
            avatar.alt = `${userData.fullName}'s avatar`;
            avatar.hidden = false;
        } else {
            avatar.hidden = true;
        }
    } catch (error) {
        console.error('Ticket data error:', error);
        localStorage.removeItem('codingConfUser');
        window.location.href = 'index.html';
    }
});
