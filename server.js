const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir los archivos estáticos de nuestra carpeta actual (HTML, CSS)
app.use(express.static(__dirname));

// Cuando un usuario se conecta al chat
io.on('connection', (socket) => {
    console.log('¡Un usuario se conectó al MSN!');

    // Escuchar cuando manda un mensaje
    socket.on('chat_message', (data) => {
        // Reenviar el mensaje a todos los conectados
        io.emit('chat_message', data);
    });

    // Escuchar cuando manda un zumbido
    socket.on('enviar_zumbido', () => {
        // Reenviar el zumbido a todos los conectados
        io.emit('recibir_zumbido');
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se desconectó.');
    });
    // Adentro del io.on('connection', (socket) => { ... })

socket.on('actualizar_perfil', (data) => {
    // Retransmite el estado y la frase a todos los demás clientes
    socket.broadcast.emit('perfil_actualizado', {
        id: socket.id,
        estado: data.estado,
        frase: data.frase
    });
});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`¡Servidor prendido y andando en el puerto ${PORT}!`);
});