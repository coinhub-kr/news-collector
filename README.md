# Contact
Byung Hyun An(anb, coloredrabbit)
adh0463@gmail.com

# Setting environments
 - nodejs
   Windows       - https://nodejs.org/en/download/
   Linux(CentOS) - yum install node -y
 - puppeteer
  npm i puppeteer@12.0.0

# config.json
{
    "log": {
        "path": {string, A file path saved to}
    },
    "mongodb": {
        "host": {string, mongodb host},
        "port": {integer, mongodb port},
        "cluster": {string, mongodb cluster},
        "collection": {string, mongodb collection}
    }
}

# Parsing rule
{
  "newsChannelName": {string, },
  "use": {boolean},
  "urls": [
    {
      "url": "https://www.coindeskkorea.com/",
      "used": true,
      "newsItemListIdentifier": {
        "xpath": "//*[@id=\"moreList\"]/li",
        "selector": "#moreList > li"
      },
      "target": [
        {
          "name": "point",
          "use": false,
          "identifier": {
            "xpath": "",
            "selector": ""
          }
        }
      ]
    }
  ]
}