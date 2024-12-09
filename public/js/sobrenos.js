
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const sectionId = this.getAttribute('href').slice(1);
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    });
});

    function showColorOptions() {
            const choice = prompt("Escolha o esquema de cores: 1. Protanopia, 2. Deuteranopia, 3. Tritanopia");
    if (choice === "1") {
        document.body.className = "protanopia"
    } else if (choice === "2") {
        document.body.className = "deuteranopia"
    } else if (choice === "3") {
        document.body.className = "tritanopia"
    } else {
        alert("Opção inválida. Voltando ao padrão.");
    document.body.className = "";
            }
        }
