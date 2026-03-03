// Módulos necesarios
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

// 1️⃣ Crear servidor HTTPS usando los certificados generados con OpenSSL
const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
});

// 2️⃣ Crear servidor WebSocket sobre HTTPS (WSS)
const wss = new WebSocket.Server({ server });

console.log("🔐 Servidor WebSocket Seguro iniciado en wss://localhost:3000");

// Función para generar datos aleatorios
const generarDatos = () => {
    const nombres = ["Sensor_Alfa", "Sensor_Beta", "Sensor_Gamma", "Sensor_Delta"];
    return JSON.stringify({
        id: Math.floor(Math.random() * 1000),
        nombre: nombres[Math.floor(Math.random() * nombres.length)],
        temperatura: (Math.random() * (40 - 20) + 20).toFixed(2) + "°C"
    });
};

// Evento de conexión
wss.on('connection', (ws) => {
    console.log("✅ Cliente conectado (conexión cifrada)");

    const intervalo = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(generarDatos());
        }
    }, 2000);

    ws.on('close', () => {
        console.log("❌ Cliente desconectado");
        clearInterval(intervalo);
    });
});

// 3️⃣ Escuchar en el puerto 3000
server.listen(3000);