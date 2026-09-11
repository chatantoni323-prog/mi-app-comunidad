// server.js
const express = require('express');
const app = express();
app.use(express.json());

// Simulación de Base de Datos en memoria
let usuarios = {
    "user_01": { id: "user_01", nombre: "Carlos", creditos: 50 },
    "user_02": { id: "user_02", nombre: "Elena", creditos: 10 }
};

let campañasComunitarias = [
    { id: "campaña_99", creadorId: "user_02", tipo: "Spotify_Stream", enlace: "https://spotify.com...", costoCredito: 5 }
];

// 1. ENDPOINT: Reclamar créditos por descubrir a otro creador de forma manual
app.post('/api/comunidad/descubrir', (req, res) => {
    const { usuarioId, campañaId } = req.body;
    
    if (!usuarios[usuarioId]) return res.status(404).json({ error: "Usuario no encontrado" });
    
    const campaña = campañasComunitarias.find(c => c.id === campañaId);
    if (!campaña) return res.status(404).json({ error: "Contenido no disponible" });

    // El usuario gana créditos por su acción humana y orgánica
    usuarios[usuarioId].creditos += 2; 
    
    // Se le descuentan los créditos al creador que configuró la campaña
    if (usuarios[campaña.creadorId]) {
        usuarios[campaña.creadorId].creditos -= campaña.costoCredito;
    }

    res.json({
        mensaje: "¡Interacción orgánica registrada con éxito!",
        nuevosCreditos: usuarios[usuarioId].creditos
    });
});

// 2. ENDPOINT: Crear una campaña de marketing gratuita usando tus créditos acumulados
app.post('/api/comunidad/promocionar', (req, res) => {
    const { usuarioId, enlaceContenido, tipoPlataforma } = req.body;
    const usuario = usuarios[usuarioId];

    if (!usuario || usuario.creditos < 10) {
        return res.status(400).json({ error: "Créditos insuficientes. Debes descubrir a más creadores primero." });
    }

    const nuevaCampaña = {
        id: `campaña_${Date.now()}`,
        creadorId: usuarioId,
        tipo: tipoPlataforma,
        enlace: enlaceContenido,
        costoCredito: 5
    };

    campañasComunitarias.push(nuevaCampaña);
    res.json({ mensaje: "Tu contenido ya está visible para miles de usuarios reales.", campaña: nuevaCampaña });
});

app.listen(3000, () => console.log('Backend de la plataforma corriendo en el puerto 3000'));
