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
newsCollection.findOneAndUpdate(
    testData, /* query */
    {$set: testData}, /* update */
    { upsert: true}, function(error, data){
        if(error) {
            console.log(error);
        } else {
            console.log('save');
        }
    });
//console.log(db.collection('news'));
//var newsCollection db.
class NewsTopicDatabase {
    
    save(parsedNewsList = []){
        for(var newsItem of parsedNewsList) {
            newsCollection.findOneAndUpdate(
                newsItem, 
                {$set: newsItem},
                { upsert: true}, // avoid duplication
                function(error, data){ // TODO: error control
                    if(error) {
                        console.log(error);
                    } else {
                        console.log('save');
                    }
                }
            );
        }
    }

}