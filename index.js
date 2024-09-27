const express = require('express');
const axios = require('axios');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Inicializa la instancia de GroqCloud con la API Key desde .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware para permitir solicitudes POST con JSON
app.use(express.json());

// Endpoint principal para interactuar con la API de GroqCloud
app.post('/', async (req, res) => {
  const { pregunta } = req.body; // Usar el cuerpo de la solicitud para obtener la pregunta

  console.log("Pregunta recibida:", pregunta); // Verifica que se esté recibiendo correctamente la pregunta

  try {
    // Llamada a la función que interactúa con la API de GroqCloud
    const respuesta = await getGroqChatCompletion(pregunta || "Default question for Groq");

    console.log("Respuesta de GroqCloud:", respuesta); // Muestra la respuesta de GroqCloud

    // Respuesta enviada al cliente
    res.send(respuesta);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(500).send("Error al procesar la solicitud.");
  }
});

// Función para interactuar con la API de GroqCloud
async function getGroqChatCompletion(pregunta) {
  try {
    // Llamada a la API de GroqCloud usando la instancia inicializada con la API Key
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: pregunta,
        },
      ],
      model: "llama3-8b-8192", // Modelo de GroqCloud
    });

    // Verificar la respuesta obtenida de GroqCloud
    console.log("Respuesta obtenida de GroqCloud:", chatCompletion);

    // Retorna el contenido de la respuesta
    return chatCompletion.choices[0]?.message?.content || "No content from Groq";
  } catch (error) {
    console.error('Error al obtener la respuesta de GroqCloud:', error.message);
    throw new Error('Error en la interacción con la API de GroqCloud');
  }
}

// Escuchar en el puerto especificado
app.listen(port, () => {
  console.log(`API Local En Línea http://localhost:${port}`);
});