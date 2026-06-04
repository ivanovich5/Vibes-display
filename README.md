<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Vibes — InspiraFlow

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ea48fad1-4f70-4971-acde-a6bd304325d6

# 🌌 Vibes — InspiraFlow

Una joya interactiva y minimalista diseñada como una pantalla inmersiva de motivación diaria. 
Las frases flotan suavemente por la pantalla en un espacio atmosférico y tridimensional gracias a 
fórmulas de movimiento predictivo y aleatorio.

## ✨ Características clave:
*   **Diseño Térmico "Frosted Glass":** Tarjetas y paneles con efectos traslúcidos fluidos, desenfoque de fondo (backdrop-blur) y sombras profundas sobre un lienzo cósmico oscuro.
*   **Marca del Autor Rediseñada:** Título de marca minimalista **"VIBES"** con un sutil resplandor dorado metálico cepillado.
*   **Interacción en Foco:** Al seleccionar cualquier tarjeta flotante, la frase se detiene y se despliega al centro de la pantalla en un módulo estático de alta densidad visual, mientras el fondo se atenúa y el resto de elementos continúa circulando de manera asíncrona.
*   **IA Generativa Integrada:** Frases generadas dinámicamente conectando de manera segura con el SDK oficial de **Google GenAI** (`gemini-3-flash-preview`).
*   **Persistencia Local Elegante:** Panel lateral corredizo (Drawer) para salvaguardar tus frases preferidas guardadas con sincronización en `localStorage`.



## Run Locally

**Prerequisites:**  Node.js


1. Instala dependencias:
   `npm install`
2. Configura `GEMINI_API_KEY` en [.env.local](.env.local) para tu Gemini API key
3. Ejecuta la app:
   `npm run dev`
