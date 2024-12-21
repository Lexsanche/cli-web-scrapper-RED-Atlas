# cli-web-scrapper-RED-Atlas

# Web Scraper de Propiedades

Este proyecto es un scraper que obtiene información sobre propiedades de compra-venta (casas y apartamentos) del sitio [Reality Realty PR](https://www.realityrealtypr.com). Usa **Puppeteer** para navegar por el sitio web y extraer los detalles de las propiedades.

## Requisitos

- **Node.js**: [Descargar Node.js](https://nodejs.org/)
- **npm** (viene con Node.js)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu_usuario/realty-web-scraper.git
   cd realty-web-scraper
Instala las dependencias:

bash
Copiar código
npm install
Uso
Ejecuta el scraper con el siguiente comando:

bash
Copiar código
node scraper.js [TIPO_DE_PROPIEDAD] [NUMERO_DE_PAGINA] [ARCHIVO_JSON]
TIPO_DE_PROPIEDAD: 'HOUSE' para casas o 'APARTMENT' para apartamentos.
NUMERO_DE_PAGINA: Número de la página de propiedades que quieres extraer.
ARCHIVO_JSON: Nombre del archivo donde se guardarán los resultados.
Ejemplo:

bash
Copiar código
node scraper.js HOUSE 1 propiedades.json
Esto obtendrá las propiedades de la página 1 para casas y guardará los detalles en propiedades.json.

Estructura del archivo JSON
El archivo .json tendrá la siguiente estructura:

json
Copiar código
[
  {
    "url": "https://www.realityrealtypr.com/properties/ejemplo",
    "title": "Casa en San Juan",
    "city": "San Juan",
    "price": "$300,000",
    "description": "Una hermosa casa con vista al mar...",
    "images": [
      "https://www.realityrealtypr.com/images/imagen1.jpg",
      "https://www.realityrealtypr.com/images/imagen2.jpg"
    ],
    "flyer": "https://www.realityrealtypr.com/properties/flyer"
  }
]
