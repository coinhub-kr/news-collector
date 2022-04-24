var Logger = require('../Logger');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;

db.on('error', function(){
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('Connected!');
});
/**
 * MongoDB
 */
var newsSchema = mongoose.Schema({
    title : 'string',
    summary : 'string',
    date : 'date'
});
// var Student2 = mongoose.model('Schema', student2);
// var newStudent = new Student2({name:'Hong Gil Dong', address:'서울시 강남구 논현동', age:'22'});

var NewsModel = mongoose.model('news', newsSchema);

var testData = {
    title: "Test title",
    summary: "test summary",
    date: new Date('2014-01-22T14:56:59.301Z')
};
// var newNews = new NewsModel(testData);
// newNews.save(function(error, data){
//     if(error){
//         console.log(error);
//     } else {
//         console.log('save');
//     }
// });
var newsCollection = db.collection('news');
// newsCollection.findOneAndUpdate(
//     testData, /* query */
//     {$set: testData}, /* update */
//     { upsert: true}, function(error, data){
//         if(error) {
//             console.log(error);
//         } else {
//             console.log('save');
//         }
//     });

//console.log(db.collection('news'));
//var newsCollection db.
class NewsTopicDatabase {
    
    save(parsedNewsList = []){
        var savedCount = 0;
        for(var newsItem of parsedNewsList) {
            newsCollection.findOneAndUpdate(
                newsItem, 
                { $set: newsItem },
                { upsert: true }, // avoid duplication
                function(error, data){ // TODO: error control
                    /**
                        console.log(data); ->
                        data = 
                        if exist {
                            lastErrorObject: { n: 1, updatedExisting: true },
                            value: {
                                _id: new ObjectId("6264ecf15abc15f636d1c949"),
                                date: ' - 2022년 04월 20일',
                                headline: '테라폼랩스 ‘비트코인’ 향후 100억달러 구매 계획, 테라 24시간 동안 4.74% 상승',
                                link: 'https://kr.investing.com/news/cryptocurrency-news/article-789623',
                                summary: 'By Jeongyeon Han/Investing.com\n' +
                                'Investing.com - 19일 시가총액 10위권 암호화폐 가격은 24시간 기준으로 상승세를 보이고 있...'
                            },
                            ok: 1
                        }
                        if no data found {
                            lastErrorObject: {
                                n: 1,
                                updatedExisting: false,
                                upserted: new ObjectId("6264f1a45abc15f636d1cc5d")
                            },
                            value: null,
                            ok: 1
                        }
                     */
                    // console.log(data)
                    if(error) {
                        Logger.error(error.message);
                    } else {
                        if(data.lastErrorObject.updatedExisting) {
                            Logger.info(`News already exist: ${data.value['headline']}`);
                        } else {
                            savedCount += 1;
                            Logger.info(`Saved successfully: ${data.lastErrorObject.upserted}`);
                        }
                    }
                }
            );
        }
        // Logger.info(`Total ${savedCount} item(s) saved`);
    }

}

module.exports.NewsTopicDatabase = NewsTopicDatabase;