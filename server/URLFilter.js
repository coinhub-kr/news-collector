const validUrl = require('valid-url');

/**
 * The URL Filter
 * Decorator pattern
 */
class URLFilter {
    isValid(suspect){
        return validUrl.isUri(suspect);
    }
}

class URLFilterItem {
    constructor(nextFilter, filtering = function(suspect) {}){
        this.nextFilter = nextFilter;
        this.filtering = filtering;
    }

    processing(suspect){
        
    }
}


class URLFilterDecorator {
    #nextFilter
    processing(suspect){ }
    #doNextFilter(suspect, results){
        if(this.nextFilter) {
            results.push(this.nextFilter.filtering(suspect));
        }
    }

    buildFilteringResults(){
        return true;
    }
}

class URLAliveFilterDecorator extends URLFilterDecorator {
    buildFilteringResults(){
        
    }
}



///////////////////////////////

class URLFilter {
    filtering(suspect){ }
}

const http = require('http');
class URLAliveFilter extends URLFilter {
    filtering(suspect) { // override
        const options = {method: 'HEAD', host: 'stackoverflow.com', port: 80, path: '/'};
        const req = http.request(options, function(r) {
            console.log(JSON.stringify(r.headers));
        });
        req.end();
    }
}