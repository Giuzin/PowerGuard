function redirectToIndex() {
    window.location.href = 'index.html';
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'flex';
}