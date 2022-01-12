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
        return element => element.textContent ? element.textContent : undefined
    }){
        var targetElement = await this.resolveElementIdentifier(page, identifier, baseElement);
        return await targetElement.evaluate(evaluationFunction);
    }

    async resolveElementIdentifier(page, identifier, baseElement = undefined) {
        var element = undefined;
        if(identifier.xpath) {
            element = await page.$x(identifier.xpath);
        }

        if(element === undefined && identifier.selector) {
            // todo: selector
        }

        return element;
    }
    
}



module.exports = {
    Parser,
    ParserPuppeteer
}