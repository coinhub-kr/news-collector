const puppeteer = require('puppeteer');

puppeteer.launch()
  .then((browser) => {
    return browser.newPage()
      .then((page) => {
        return page.goto('https://github.com/')
          .then(() => page.screenshot({path: 'github.png'}))
      })
      .then(() => browser.close());
  });
