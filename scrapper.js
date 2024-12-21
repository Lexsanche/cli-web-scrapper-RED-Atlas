const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapePropertyUrls(propertyType, pageNumber, filename) {
  const baseUrl = `https://www.realityrealtypr.com/properties/pagination:size%7C15%7Cpage%7C${pageNumber}/`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

  const propertyUrls = await page.evaluate((propertyType) => {
    return Array.from(document.querySelectorAll('.result .viewDetails'))
      .map(listing => listing.href.split('?')[0])
      .filter(url => url && url.startsWith('https://www.realityrealtypr.com') &&
        ((propertyType === 'HOUSE' && url.includes('/compra-venta/casa/')) ||
         (propertyType === 'APARTMENT' && url.includes('/compra-venta/apartamento/'))));
  }, propertyType);

  await page.close(); 

  if (propertyUrls.length > 0) {
    const propertyDetailsList = await Promise.all(
      propertyUrls.map(url => getPropertyDetails(browser, url))
    );

    try {
      fs.writeFileSync(filename, JSON.stringify(propertyDetailsList, null, 2), 'utf-8');
      console.log(`Archivo ${filename} creado con éxito.`);
    } catch (err) {
      console.error(`Error al crear el archivo ${filename}:`, err);
    }
  } else {
    console.log('No se encontraron propiedades para procesar.');
  }

  await browser.close(); 
}

async function getPropertyDetails(browser, url) {
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const propertyDetails = await page.evaluate(() => {
    const getText = (selector) => document.querySelector(selector)?.innerText.trim() || '';
    const getImages = () => Array.from(document.querySelectorAll('.carousel-inner .item img'))
      .map(img => img.src)
      .filter((value, index, self) => self.indexOf(value) === index); 

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

  await page.close(); 
  return propertyDetails;
}

const [propertyType, pageNumber, filename] = process.argv.slice(2);
scrapePropertyUrls(propertyType, pageNumber, filename).catch(console.error);
