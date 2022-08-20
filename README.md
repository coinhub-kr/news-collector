# Contact
Byung Hyun An(anb, coloredrabbit)
adh0463@gmail.com
Team) coin-hub.

# Setting environments
 - nodejs
   Windows       - https://nodejs.org/en/download/
   Linux(CentOS) - yum install node -y
 - puppeteer
  npm i puppeteer@12.0.0

# How to run
```sh
node index.js {news channel config file path}
```
## example
```sh
node index.js ./my_news_channel.json
```

# Collector configuration JSON format
```json
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
```

# News channel JSON format
```json
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
```