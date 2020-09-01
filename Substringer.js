function cropString(fullLine, word1, word2) {

    let startPosition = a.indexOf(b) + b.length;
    let endPosition = a.indexOf(c, startPosition);

    let croppedString = a.substr(startPosition, endPosition - startPosition);
    let continueFrom = endPosition + c.length; //for further parsing

    return [croppedString, continueFrom];
}

module.exports = {cropString};