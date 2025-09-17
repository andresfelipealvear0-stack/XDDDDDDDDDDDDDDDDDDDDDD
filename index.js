const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const app = express();
const port = 3000;

// Reemplaza con tus propios valores
const DISCORD_BOT_TOKEN = 'MTQxNzYzMTk4MzE3NzA0NDA5MA.G17L0s.mRqkulPxPpRjwwpCsxbc8qz6Yb6LR_-XdEhoc0'
const DISCORD_GUILD_ID = '1391103791750844507';
const REQUIRED_ROLE_ID = '1399515623834521660';

// Configura el cliente de Discord con las intenciones necesarias
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.on('ready', () => {
    console.log(`Bot de Discord ${client.user.tag} está listo.`);
});

client.login(DISCORD_BOT_TOKEN);

app.use(express.json());

// Endpoint que recibirá las solicitudes de Roblox
app.post('/check-role', async (req, res) => {
    const { robloxUserId } = req.body;

    if (!robloxUserId) {
        return res.status(400).json({ error: 'Falta el ID de usuario de Roblox.' });
    }

    try {
        // En un caso real, necesitarías una base de datos o un servicio
        // para mapear el RobloxUserId al DiscordUserId.
        // Aquí simulamos esa lógica con una llamada a una API de verificación.
        // Ejemplo: Bloxlink (necesitas configurar esto)
        const bloxlinkResponse = await axios.get(`https://api.blox.link/v1/user/${robloxUserId}`);
        const discordUserId = bloxlinkResponse.data.discordId;

        if (!discordUserId) {
            return res.json({ hasRole: false, message: 'Usuario de Roblox no vinculado a Discord.' });
        }

        const guild = await client.guilds.fetch(DISCORD_GUILD_ID);
        const member = await guild.members.fetch(discordUserId);

        const hasRole = member.roles.cache.has(REQUIRED_ROLE_ID);
        
        // Envía la respuesta a Roblox
        res.json({ hasRole: hasRole, message: hasRole ? 'Tiene el rol' : 'No tiene el rol' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ hasRole: false, error: 'Error del servidor.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});