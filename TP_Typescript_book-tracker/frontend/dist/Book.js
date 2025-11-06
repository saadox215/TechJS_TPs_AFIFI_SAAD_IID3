export class Book {
    constructor(data) {
        this._id = data._id;
        this.title = data.title;
        this.author = data.author || '';
        this.pages = data.pages;
        this.status = data.status || 'Want to read';
        this.price = data.price || 0;
        this.pagesRead = data.pagesRead || 0;
        this.format = data.format || 'Print';
        this.suggestedBy = data.suggestedBy;
        this.finished = !!data.finished || this.pagesRead >= this.pages;
    }
    // retourne pourcentage lu (0 100)
    currentlyAt() {
        if (!this.pages || this.pages <= 0)
            return 0;
        return Math.round((this.pagesRead / this.pages) * 100);
    }
    deleteBook() {
        return { id: this._id };
    }
    increasePagesRead(by = 1) {
        this.pagesRead += by;
        if (this.pagesRead >= this.pages) {
            this.pagesRead = this.pages;
            this.finished = true;
        }
    }
}
