const express = require('express');
const axios = require('axios');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();  // Cargar las variables de entorno desde el archivo .env
const app = express();
const port = process.env.PORT || 3000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware para manejar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Endpoint principal para Groq
app.post('/', async (req, res) => {
  const { pregunta } = req.body; // Usamos el cuerpo de la solicitud en lugar de req.query

  if (!pregunta) {
    return res.status(400).send("Debes proporcionar 'pregunta' en el cuerpo de la solicitud.");
  }

  try {
    const respuesta = await getGroqChatCompletion(pregunta);
    res.send({ respuesta });
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res.status(500).send("Error al procesar la solicitud.");
  }
});

// Función para interactuar con la API de Groq
async function getGroqChatCompletion(pregunta) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: pregunta,
        },
      ],
      model: "llama3-8b-8192",  // Asegúrate de que el modelo sea correcto
    });
    return chatCompletion.choices[0]?.message?.content || "No se obtuvo contenido de Groq.";
  } catch (error) {
    console.error("Error en la API de Groq:", error);
    throw new Error("Solicitud fallida a Groq");
  }
}

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});