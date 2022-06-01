var coinDeskKoreaParser = {
    url: "https://www.coindeskkorea.com/",
    postParsing: function(parsedNewsList){
        for(var news of parsedNewsList) {
            for(const name in news){
                if(name === 'author&date') {
                    var parsedArray = news[name].split('|');
                    var author = parsedArray[0].trim();
                    var date = parsedArray[1].trim();
                    Object.assign(news, {
                        author,
                        date
                    });
                }
            }
            delete news['author&date'];
        }
        return parsedNewsList;
    }
}

module.exports = coinDeskKoreaParser;