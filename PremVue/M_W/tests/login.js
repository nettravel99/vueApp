const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8080/');
  const username = await page.$('[name="username"]');
  username.type('MG');
  const password = await page.$('[name="password"]');
  password.type('ADS');
  const login = await page.$('#login_button');
  login.click();
  await page.waitFor(2000);
  const logout = await page.$('#logout_button');
  logout.click();
  await page.waitFor(1000)
  browser.close();
}
(async function(){
    for (let i=0;i<100;i++){
        await run();
    }
})()

