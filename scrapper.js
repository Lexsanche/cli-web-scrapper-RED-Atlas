const puppeteer = require('puppeteer');
const fs = require('fs');

// Función principal de scraping
async function scrapePropertyUrls(propertyType, pageNumber, filename) {
  const baseUrl = `https://www.realityrealtypr.com/properties/pagination:size%7C15%7Cpage%7C${pageNumber}/`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navegar a la página base
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

  // Obtener URLs de las propiedades
  const propertyUrls = await page.evaluate((propertyType) => {
    return Array.from(document.querySelectorAll('.result .viewDetails'))
      .map(listing => listing.href.split('?')[0])
      .filter(url => url && url.startsWith('https://www.realityrealtypr.com') &&
        ((propertyType === 'HOUSE' && url.includes('/compra-venta/casa/')) ||
         (propertyType === 'APARTMENT' && url.includes('/compra-venta/apartamento/'))));
  }, propertyType);

  await page.close(); // Cerrar la pestaña después de que se obtiene la información

  if (propertyUrls.length > 0) {
    // Obtener los detalles de las propiedades concurrentemente
    const propertyDetailsList = await Promise.all(
      propertyUrls.map(url => getPropertyDetails(browser, url))
    );

    fs.writeFileSync(filename, JSON.stringify(propertyDetailsList, null, 2), 'utf-8');
  }

  await browser.close(); // Cerrar el navegador después de terminar
}

// Función para obtener los detalles de cada propiedad
async function getPropertyDetails(browser, url) {
  const page = await browser.newPage();

  // Navegar a la URL de la propiedad
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const propertyDetails = await page.evaluate(() => {
    const getText = (selector) => document.querySelector(selector)?.innerText.trim() || '';
    const getImages = () => Array.from(document.querySelectorAll('.carousel-inner .item img'))
      .map(img => img.src)
      .filter((value, index, self) => self.indexOf(value) === index); // Eliminar duplicados

    return {
      url: window.location.href,
      title: getText('h1'),
      city: getText('.col-xs-12.col-sm-8 p'),
      price: getText('.sale-rent-title'),
      description: getText('#home'),
      images: getImages(),
      flyer: document.querySelector('.title-side a')?.href || '',
    };
  });

  await page.close(); // Cerrar la pestaña después de obtener los detalles
  return propertyDetails;
}

// Recibir los argumentos de la línea de comando
const [propertyType, pageNumber, filename] = process.argv.slice(2);
scrapePropertyUrls(propertyType, pageNumber, filename).catch(console.error);
