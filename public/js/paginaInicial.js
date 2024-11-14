import { refreshToken } from './refresh.js';

let barChart, pieChart;

const serverURL = "http://54.172.89.130/api/v1/energy/history";

verificarToken();

function verificarToken() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.href = "login.html";
    }

    fetch(serverURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
        .then(response => {
            if (response.status == 401) {
                refreshToken();
            }
        })
        .catch(error => {
            console.error("Erro ao fazer requisição:", error);
        });
}

function gerarDadosAleatorios() {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const categorias = ['Ar Condicionado', 'Iluminação', 'Computador', 'Geladeira'];
    const distribuicaoConsumo = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100));

    const dias = Array.from({ length: 31 }, (_, i) => i + 1);
    const consumoDiario = dias.map(() => Math.floor(Math.random() * 20));

    const consumoMensal = Array.from({ length: 12 }, (_, i) => {
        return consumoDiario.reduce((a, b) => a + b, 0) + Math.floor(Math.random() * 100);
    });

    return { meses, consumoMensal, categorias, distribuicaoConsumo, consumoDiario };
}

function updateBarChart(data) {
    barChart.data.labels = data.meses;
    barChart.data.datasets[0].data = data.consumoMensal;
    barChart.update();
}

function updatePieChart(data) {
    pieChart.data.labels = data.categorias;
    pieChart.data.datasets[0].data = data.distribuicaoConsumo;
    pieChart.update();
}

async function setupCharts() {
    const initialData = gerarDadosAleatorios();

    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: initialData.meses,
            datasets: [{
                label: 'Consumo de Energia (kWh)',
                data: initialData.consumoMensal,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Consumo Mensal de Energia'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Consumo (kWh)'
                    }
                }
            }
        }
    });

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: initialData.categorias,
            datasets: [{
                data: initialData.distribuicaoConsumo,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição do Consumo de Energia'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

setInterval(() => {
    const newData = gerarDadosAleatorios();
    updateBarChart(newData);
    updatePieChart(newData);
}, 120000);

document.addEventListener('DOMContentLoaded', function () {
    setupCharts();
});


document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');

            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            document.getElementById('dispositivos').style.display = 'none';
            document.getElementById('deviceDetails').style.display = 'none';

            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');

            if (targetSection === 'dispositivos') {
                document.getElementById('dispositivos').style.display = 'block';
            }
        });
    });

    const generateReportButton = document.getElementById('generateReport');
    generateReportButton.addEventListener('click', generatePDF);

    const backButton = document.getElementById('backToList');
    backButton.addEventListener('click', function () {
        document.getElementById('dispositivos').style.display = 'block';
        document.getElementById('deviceDetails').style.display = 'none';
    });
});

const devices = [
    { id: 1, name: 'Ar Condicionado - Sala 1', status: 'Ligado', consumption: 1.5, mac: '00:1B:44:11:3A:B7', ip: '192.168.1.100', type: 'Ar Condicionado' },
    { id: 2, name: 'Iluminação - Corredor', status: 'Ligado', consumption: 0.5, mac: '00:1B:44:11:3A:B8', ip: '192.168.1.101', type: 'Iluminação' },
    { id: 3, name: 'Computador - Escritório', status: 'Desligado', consumption: 0, mac: '00:1B:44:11:3A:B9', ip: '192.168.1.102', type: 'Computador' },
    { id: 4, name: 'Geladeira - Cozinha', status: 'Ligado', consumption: 0.8, mac: '00:1B:44:11:3A:C0', ip: '192.168.1.103', type: 'Eletrodoméstico' }
];

function populateDeviceList() {
    const deviceList = document.getElementById('deviceList');
    deviceList.innerHTML = '';
    devices.forEach(device => {
        const li = document.createElement('li');
        const statusIndicator = document.createElement('span');
        statusIndicator.className = `status-indicator ${device.status === 'Ligado' ? 'status-on' : 'status-off'}`;
        li.appendChild(statusIndicator);
        li.appendChild(document.createTextNode(`${device.name} - Status: ${device.status} - Consumo: ${device.consumption} kWh`));
        li.addEventListener('click', () => {
            document.querySelectorAll('#deviceList li').forEach(item => item.classList.remove('selected'));
            li.classList.add('selected');
            showDeviceDetails(device);
        });
        deviceList.appendChild(li);
    });
}
function showDeviceDetails(device) {
    const deviceInfo = document.getElementById('deviceInfo');

    let deviceImage = '';
    switch (device.type) {
        case 'Ar Condicionado':
            deviceImage = '<img src="./img/ar.png" alt="Imagem do Ar Condicionado" class="device-image1">';
            break;
        case 'Iluminação':
            deviceImage = '<img src="./img/luz.png" alt="Imagem da Iluminação" class="device-image2">';
            break;
        case 'Computador':
            deviceImage = '<img src="./img/computador.png" alt="Imagem do Computador" class="device-image3">';
            break;
        case 'Geladeira':
            deviceImage = '<img src="./img/geladeira.png" alt="Imagem da Geladeira" class="device-image4" >';
            break;
        default:
            deviceImage = '<img src="./img/geladeira.png" alt="Imagem da Geladeira" class="device-image4" >';
    }

    deviceInfo.innerHTML = `
        <p><strong>Nome:</strong> ${device.name}</p>
        <p><strong>Status:</strong> <span class="status-text ${device.status === 'Ligado' ? 'status-on' : 'status-off'}">${device.status}</span></p>
        ${deviceImage}
        <p><strong>Consumo:</strong> ${device.consumption} kWh</p>
        <p><strong>MAC:</strong> ${device.mac}</p>
        <p><strong>IP:</strong> ${device.ip}</p>
        <p><strong>Tipo:</strong> ${device.type}</p>
    `;

    const toggleButton = document.getElementById('toggleDevice');
    toggleButton.textContent = device.status === 'Ligado' ? 'Desligar' : 'Ligar';
    toggleButton.onclick = () => toggleDeviceStatus(device);

    document.getElementById('dispositivos').style.display = 'none';
    document.getElementById('deviceDetails').style.display = 'block';
}


function toggleDeviceStatus(device) {
    device.status = device.status === 'Ligado' ? 'Desligado' : 'Ligado';
    device.consumption = device.status === 'Ligado' ? (Math.random() * 2).toFixed(1) : 0;
    showDeviceDetails(device);
    populateDeviceList();
}

populateDeviceList();

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();


    doc.setFontSize(18);
    doc.text("Relatório de Consumo de Energia", 20, 20);

    doc.setFontSize(12);
    doc.text(`Data do relatório: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);

    const totalConsumption = barChart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    doc.text(`Consumo total: ${totalConsumption} kWh`, 20, 40);

    doc.text("Status dos Dispositivos:", 20, 50);
    devices.forEach((device, index) => {
        doc.text(`${device.name} - Status: ${device.status} - Consumo: ${device.consumption} kWh`, 20, 60 + (index * 10));
    });

    doc.save("relatorio_consumo_energia.pdf");
}

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');

            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    const generateReportButton = document.getElementById('generateReport');
    generateReportButton.addEventListener('click', generatePDF);

    const backButton = document.getElementById('backToList');
    backButton.addEventListener('click', function () {
        document.getElementById('dispositivos').style.display = 'block';
        document.getElementById('deviceDetails').style.display = 'none';
    });
});

function gerarDadosFiltrados(startDate, endDate) {
    const dias = Array.from({ length: (endDate - startDate) / (1000 * 60 * 60 * 24) + 1 }, (_, i) => new Date(startDate.getTime() + i * (1000 * 60 * 60 * 24)));
    const consumoDiario = dias.map(() => Math.floor(Math.random() * 10));
    return {
        meses: dias.map(dia => dia.toLocaleString('pt-BR', { month: 'short' })),
        consumoMensal: [consumoDiario.reduce((a, b) => a + b, 0)],
        categorias: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4'],
        distribuicaoConsumo: Array.from({ length: 4 }, () => Math.floor(Math.random() * 50))
    };
}

function filterData() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (startDate && endDate && startDate <= endDate) {
        const filteredData = gerarDadosFiltrados(startDate, endDate);
        updateBarChart(filteredData);
        updatePieChart(filteredData);
    } else {
        const originalData = gerarDadosAleatorios();
        updateBarChart(originalData);
        updatePieChart(originalData);
    }
}

document.getElementById('filterData').addEventListener('click', filterData);