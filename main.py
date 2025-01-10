import os

from langchain.chains import LLMChain
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.messages import SystemMessage
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_groq import ChatGroq


def main():
    """
    Esta función es el punto de entrada principal de la aplicación. Configura el cliente de Groq, la interfaz de Streamlit y maneja la interacción del chat.
    """

    # Obtener la clave API de Groq
    groq_api_key = os.environ['GROQ_API_KEY']
    modelo = 'llama3-8b-8192'
    # Inicializar el objeto de chat de Groq Langchain y la conversación
    groq_chat = ChatGroq(
            groq_api_key=groq_api_key, 
            model_name=modelo
    )
    
    print("¡Hola! Soy tu amigable chatbot de Groq. Puedo ayudar a responder tus preguntas, proporcionar información o simplemente charlar. ¡También soy muy rápido! Comencemos nuestra conversación.")

    prompt_sistema = 'Eres un chatbot conversacional amigable'
    longitud_memoria_conversacional = 5  # número de mensajes anteriores que el chatbot recordará durante la conversación

    memoria = ConversationBufferWindowMemory(k=longitud_memoria_conversacional, memory_key="historial_chat", return_messages=True)

    while True:
        pregunta_usuario = input("Haz una pregunta: ")

        # Si el usuario ha hecho una pregunta,
        if pregunta_usuario:

            # Construir una plantilla de prompt de chat usando varios componentes
            prompt = ChatPromptTemplate.from_messages(
                [
                    SystemMessage(
                        content=prompt_sistema
                    ),  # Este es el prompt del sistema persistente que siempre se incluye al inicio del chat.

                    MessagesPlaceholder(
                        variable_name="historial_chat"
                    ),  # Este marcador de posición será reemplazado por el historial de chat real durante la conversación. Ayuda a mantener el contexto.

                    HumanMessagePromptTemplate.from_template(
                        "{entrada_humana}"
                    ),  # Esta plantilla es donde se inyectará la entrada actual del usuario en el prompt.
                ]
            )

            # Crear una cadena de conversación usando el LLM (Modelo de Lenguaje)
            conversacion = LLMChain(
                llm=groq_chat,  # El objeto de chat de Groq LangChain inicializado anteriormente.
                prompt=prompt,  # La plantilla de prompt construida.
                verbose=False,   # TRUE habilita la salida detallada, lo cual puede ser útil para depurar.
                memory=memoria,  # El objeto de memoria conversacional que almacena y gestiona el historial de la conversación.
            )
            # La respuesta del chatbot se genera enviando el prompt completo a la API de Groq.
            respuesta = conversacion.predict(entrada_humana=pregunta_usuario)
            print("Chatbot:", respuesta)

if __name__ == "__main__":
    main()
