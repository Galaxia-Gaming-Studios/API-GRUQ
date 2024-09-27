const express = require('express');
const axios = require('axios');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno
const app = express();
const port = process.env.PORT || 3000;

// Inicializa la instancia de GroqCloud con la API Key desde .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware para permitir solicitudes POST con JSON
app.use(express.json());

// Endpoint principal para interactuar con la API de GroqCloud
app.post('/', async (req, res) => {
  const { pregunta } = req.body; // Obtener la pregunta del cuerpo de la solicitud

  console.log("Pregunta recibida:", pregunta); // Log para verificar la recepción de la pregunta

  try {
    // Llamada a la API de GroqCloud para obtener la respuesta
    const respuesta = await getGroqChatCompletion(pregunta || "Pregunta predeterminada para Groq");

    console.log("Respuesta de GroqCloud:", respuesta); // Log para mostrar la respuesta de GroqCloud

    // Enviar la respuesta al cliente
    res.send({ respuesta }); // Se envía como objeto para ser más claro
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(500).send("Error al procesar la solicitud."); // Devolver un error 500 en caso de fallo
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
      model: "llama3-8b-8192", // Especificar el modelo de GroqCloud
    });

    // Verificar la respuesta obtenida de GroqCloud
    console.log("Respuesta obtenida de GroqCloud:", chatCompletion);

    // Retorna el contenido de la respuesta
    return chatCompletion.choices[0]?.message?.content || "No se recibió contenido de Groq";
  } catch (error) {
    console.error('Error al obtener la respuesta de GroqCloud:', error.message);
    throw new Error('Error en la interacción con la API de GroqCloud');
  }
}

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`API Local en línea en http://localhost:${port}`);
});