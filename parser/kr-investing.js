var krInvesting = {
    url: "https://kr.investing.com/news/cryptocurrency-news",
    postParsing: function(parsedNewsList){
        console.log('??')
        for(var news of parsedNewsList) {
            for(const name in news){
                if(name === 'date') {
                    news[name] = 
                    news[name].replace("&nbsp-&nbsp", "")
                              .replace(' - ', '');
                }
            }
        }
        return parsedNewsList;
    }
}

module.exports = krInvesting;