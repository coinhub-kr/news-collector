const validUrl = require('valid-url');

/**
 * The URL Filter
 * Decorator pattern
 */
class URLFilter {
    #nextFilter

    constructor(nextFilter) {
        this.#nextFilter = nextFilter;
    }
    
    async filtering(suspect) {
        var result = true;
        if(this.#nextFilter) {
            result = await this.#nextFilter.filtering(suspect);
        }
        return result;
    }

}

const http = require('http');
class URLAliveFilter extends URLFilter {
    async filtering(suspect) { // override
        var result = await super.filtering(suspect);
        if(result){
            console.log('test' + result);
            const options = {method: 'HEAD', host: suspect, port: 80, path: '/'};
            try {
                const req = await http.request(options, function(r) {
                    //console.log(JSON.stringify(r.headers));
                });
                await req.end();
            } catch(e){
                result = false;
                console.log('test' + result);
            }

            // todo: result
        }
        return result;
    }
}

class URLValidationFilter extends URLFilter {
    constructor(nextFilter) {
        super(nextFilter);
    }

    async filtering(suspect) {
        var result = await super.filtering(suspect);
        if(result){
            result = await validUrl.isUri(suspect);
            if(result === undefined) {
                result = false;
            } else {
                result = true;
            }
        }
        return result;
    }
}

(async () => {
    var urlFilter = new URLAliveFilter(
        new URLValidationFilter()
    );
    
    var result = await urlFilter.filtering('http://anb.anb');
    console.log("result");
    console.log(result);
})();

