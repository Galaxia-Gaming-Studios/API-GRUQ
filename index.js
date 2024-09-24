const express = require('express');
const axios = require('axios');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Endpoint principal para Groq y para Apimocha
app.get('/', async (req, res) => {
  const { pregunta, servicio } = req.query; // Usar parámetros de la URL (pregunta y servicio)

  try {
    let respuesta;
    if (servicio === 'groq') {
      // Si se especifica 'groq', usar la API de Groq
      respuesta = await getGroqChatCompletion(pregunta || "Default question for Groq");
    } else if (servicio === 'apimocha') {
      // Si se especifica 'apimocha', usar la URL externa
      respuesta = await enviarSolicitudMetaAI(pregunta || "Default question for Apimocha");
    } else {
      // Si no se especifica un servicio válido, enviar un mensaje de error
      respuesta = "Servicio no especificado o inválido. Usa 'groq' o 'apimocha' como servicio.";
    }

    res.send(respuesta);
  } catch (error) {
    res.status(500).send("Error al procesar la solicitud.");
  }
});

// Función para interactuar con Groq API
async function getGroqChatCompletion(pregunta) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: pregunta,
      },
    ],
    model: "llama3-8b-8192",
  });
  return chatCompletion.choices[0]?.message?.content || "No content from Groq";
}

// Función para enviar la solicitud a la URL externa (https://apimocha.com/metaai/IA/meta=)
async function enviarSolicitudMetaAI(pregunta) {
  try {
    const response = await axios.post('https://apimocha.com/metaai/IA/meta=', {
      question: pregunta
    });
    return response.data; // Regresa el contenido de la respuesta
  } catch (error) {
    console.error('Error al enviar la solicitud:', error.message);
    throw new Error('Solicitud fallida a Apimocha');
  }
}

// Escuchar en el puerto especificado
app.listen(port, () => {
  console.log(`API Local En Línea en http://localhost:${port}`);
});