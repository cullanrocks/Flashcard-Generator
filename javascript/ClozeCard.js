ClozeCard = function (text, cloze) {
	// exports.ClozeCard = function ClozeCard(text, cloze) {
    if (this instanceof ClozeCard) {
        this.text = text;
        this.cloze = cloze;
        this.partial = this.text.replace(cloze, "...");
    } else {
    	return new ClozeCard(text, cloze);
    }
}

module.exports = ClozeCard;
