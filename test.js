import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
  
  const rootHtml = await page.$eval('#root', el => el.innerHTML);
  console.log('ROOT HTML:', rootHtml);
  
  await browser.close();
})();
