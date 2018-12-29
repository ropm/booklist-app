//Book class
class Book {
    constructor(title, author, courses, buylink) {
        this.title = title;
        this.author = author;
        this.courses = courses;
        this.buylink = buylink;
    }
}

//Ui class: handles ui tasks
class Ui {
    
    static displayBooks() {
        const books = Store.getBooks(); //pretending this is localstorage, testing
        //loop books
        books.forEach( (book) => Ui.addBookToList(book));
    }

    //create row to table
    static addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.courses}</td>
        <td><a href="${book.buylink}" target="_blank">${book.buylink}</a></td>
        <td><a href="#" class="btn btn-danger btn-sm delete">DEL</a></td>
        `;
        
        list.appendChild(row);
    }

    static deleteBook(el) { //target list by delete book comment, if list contains delete then remove parent<tr></tr> of the parent <td></td>
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static checkAlert(){
        const inputs = document.getElementsByClassName('form-control');
        for (var i = 0; i<inputs.length; i++){
            if(inputs[i].value === ''){
                return true;
            }else{
                return false;
            }
        }
    }
    static showAlert(msg, className) {
        const div = document.createElement('div');
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(msg));
            const cont = document.getElementById('book-form');
            const formButton = document.getElementById('btn-add');
            cont.insertBefore(div, formButton);
            setTimeout(() => document.querySelector('.alert').remove(), 5000);
    }

    static clearFields() {
        const inputs = document.getElementsByClassName('form-control');
        for (var i = 0; i<inputs.length; i++){
            inputs[i].value = '';
        }
    }
}

//Store class: handles localstorage, localstorage takes only strings
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(buylink) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.buylink === buylink){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }


}



//Events
//display books
document.addEventListener('DOMContentLoaded', Ui.displayBooks);
//add books
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if(Ui.checkAlert()){
        Ui.showAlert('Please fill all the fields!', 'danger')
    }else{
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const courses = document.querySelector('#courses').value;
        let buyLink = document.querySelector('#shop-link').value;

        const httpsMatch = buyLink.match(/^https?:\/\//i);
        if (httpsMatch === null) {
        buyLink = 'http://' + buyLink;
        }

        const book = new Book(title, author, courses, buyLink);
        Ui.addBookToList(book);
        Store.addBook(book);
        Ui.showAlert('Book added', 'success');
        Ui.clearFields();
    }
});


//delete book
document.querySelector('#book-list').addEventListener('click', (e) => {
    Ui.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    Ui.showAlert('Book deleted', 'info');
});