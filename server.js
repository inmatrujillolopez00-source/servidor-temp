const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Variables de control
let temperaturaManual = null;
let modoAutomatico = true;

// GET - Obtener temperatura (automática o manual)
app.get('/api/temperatura', (req, res) => {
    let temp;
    
    if (!modoAutomatico && temperaturaManual !== null) {
        temp = temperaturaManual;
    } else {
        temp = -5 + Math.random() * 50; // aleatoria
    }
    
    res.json({
        temperatura: Number(temp.toFixed(1)),
        unidad: "C",
        timestamp: new Date().toISOString(),
        calidad: obtenerCalidad(temp),
        modo: modoAutomatico ? "auto" : "manual"
    });
});

// POST - Establecer temperatura manualmente
app.post('/api/temperatura', (req, res) => {
    const { temperatura } = req.body;
    
    if (temperatura === undefined) {
        return res.status(400).json({ error: "Falta el campo temperatura" });
    }
    
    temperaturaManual = temperatura;
    modoAutomatico = false;
    
    console.log(`Temperatura manual: ${temperatura}°C`);
    
    res.json({
        mensaje: "Temperatura actualizada manualmente",
        temperatura: temperatura,
        modo: "manual",
        timestamp: new Date().toISOString()
    });
});

// POST - Volver a modo automático
app.post('/api/auto', (req, res) => {
    modoAutomatico = true;
    temperaturaManual = null;
    console.log("Modo automático restaurado");
    res.json({ mensaje: "Modo automático" });
});

function obtenerCalidad(temp) {
    if (temp < 0) return "bajo cero";
    if (temp < 15) return "frío";
    if (temp < 25) return "templado";
    if (temp < 35) return "cálido";
    return "muy caliente";
}

app.listen(PORT, () => {
    console.log(`Servidor con POST en puerto ${PORT}`);
});