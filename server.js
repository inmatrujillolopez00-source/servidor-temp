const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Forzar UTF-8 en todas las respuestas (SOLUCIÓN)
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Endpoint principal
app.get('/', (req, res) => {
    res.json({
        mensaje: "API de Temperatura para Unity",
        endpoints: {
            temperatura: "/api/temperatura",
            health: "/health"
        }
    });
});

// Endpoint de temperatura (simulada)
app.get('/api/temperatura', (req, res) => {
    // Generar temperatura aleatoria entre -5 y 45 grados
    const temp = -5 + Math.random() * 50;
    
    res.json({
        temperatura: Number(temp.toFixed(1)),
        unidad: "°C",
        timestamp: new Date().toISOString(),
        calidad: obtenerCalidad(temp)
    });
});

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Función auxiliar para dar más realismo
function obtenerCalidad(temp) {
    if (temp < 0) return "bajo cero";
    if (temp < 15) return "frío";
    if (temp < 25) return "templado";
    if (temp < 35) return "cálido";
    return "muy caliente";
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor de temperatura corriendo en puerto ${PORT}`);
    console.log(`Endpoints:`);
    console.log(`   GET /`);
    console.log(`   GET /api/temperatura`);
    console.log(`   GET /health`);
});