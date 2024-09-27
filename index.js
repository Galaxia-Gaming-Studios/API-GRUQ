const express = require('express');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar Groq SDK con la clave de API
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// Endpoint principal que recibe solicitudes POST
app.post('/', async (req, res) => {
  const { pregunta } = req.body; // Obtener la pregunta del cuerpo de la solicitud

  // Validar si se proporcionó la pregunta
  if (!pregunta) {
    return res.status(400).json({ error: "Debes proporcionar 'pregunta' en el cuerpo de la solicitud." });
  }

  try {
    // Llamada a la función que interactúa con la API de Groq
    const respuesta = await getGroqChatCompletion(pregunta);
    res.json({ respuesta }); // Devolver la respuesta en formato JSON
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error al procesar la solicitud a Groq." });
  }
});

// Función que interactúa con la API de Groq
async function getGroqChatCompletion(pregunta) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: pregunta, // Pasamos la pregunta que viene del cuerpo de la solicitud
        },
      ],
      model: "llama3-8b-8192", // Especificamos el modelo, asegúrate que sea correcto
    });
    return chatCompletion.choices[0]?.message?.content || "No se obtuvo contenido de Groq."; // Validamos que haya contenido en la respuesta
  } catch (error) {
    console.error("Error en la API de Groq:", error);
    throw new Error("Solicitud fallida a Groq"); // Propagamos el error para ser manejado en el endpoint
  }
}

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});