class Parser {
    async resolveElementIdentifier(page, identifier, base_elemnt = undefined) {}

}

/**
 * 
 * identifier = {
 *   xpath: A identifying xpath to represent some element. Full path
 *   selector: A identifying CSS selector to represent some element. Full path
 * }
 */

class ParserPuppeteer extends Parser {

    async parseElementValue(page, identifier, baseElement, evaluationFunction = function(element){
        return element.textContent ? element.textContent : undefined
    }){
        var targetElement = await this.resolveElementIdentifier(page, identifier, baseElement);
        return await targetElement[0].evaluate(evaluationFunction);
    }

    async resolveElementIdentifier(page, identifier, baseElement = undefined) {
        var element = undefined;
        var searchContext = page;
        if(baseElement !== undefined) {
            searchContext = baseElement;
        }
        
        if(identifier.xpath) {
            element = await searchContext.$x(identifier.xpath);
        }

        if((element === undefined || element.length === 0) && identifier.selector) {
            element = await searchContext.$$(identifier.selector);
        }

        return element;
    }
    
}

module.exports = {
    Parser,
    ParserPuppeteer
}
