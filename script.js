'use strict';

const DEFAULT_BOOK_COVER = 'https://cdn-icons-png.flaticon.com/512/3557/3557574.png';


const mainSection = document.querySelector('.main-section');
const addBookButton = document.getElementById('btn-add-book');
const submitBookButton = document.getElementById('btn-submit-book');
const titleInput = document.querySelector('input.title');
const authorInput = document.querySelector('input.author');
const coverImageInput = document.querySelector('input.cover-image');
const fileInput = document.querySelector('input.file');
const modalForm = document.querySelector('.modal');

const books = [];
const localStorageEnabled = storageAvailable('localStorage');

function Book(name, author, coverImageUrl, pageCount, read = false) {
    this.name = name;
    this.author = author;
    this.pageCount = pageCount;
    this.coverImageUrl = (coverImageUrl !== null &&
            coverImageUrl !== undefined &&
            coverImageUrl.length > 0)?
        coverImageUrl : DEFAULT_BOOK_COVER;
    this.read = read;

    const element = document.createElement('div');
    element.classList.add('item', 'book-info', 'tooltip', 'vflex');
    element.innerHTML = `
    <p>${this.name}</p>
    <img src="${this.coverImageUrl}" alt="coverimage"></img>
    <div class="book-buttons hflex">
        <button class="remove-button">
            <i class="fas fa-minus-circle fa-sm"></i>
        </button>
        <button class="read-button">
            <i class="fas fa-book fa-sm"></i>
        </button>
    </div>
    <ul class="tooltiptext vflex">
        <li>Title: ${this.name}</li>
        <li>Author: ${this.author}</li>
        <li>Pages: ${this.pageCount}</li>
    </ul>
    `;

    this.removeButton = element.querySelector('.remove-button');
    this.readButton = element.querySelector('.read-button');
    this.element = element;

    if (read)
        this.readButton.querySelector('i').classList.toggle('hovered');

    this.removeButton.addEventListener('click', (e) => {
        mainSection.removeChild(this.element);
        books.splice(books.indexOf(this), 1);
    });
    this.readButton.addEventListener('click', (e) => {
        this.read = !this.read;
        this.readButton.querySelector('i').classList.toggle('hovered');
    });
}

function displayBook(book) {
    if (mainSection.childElementCount > 1)
        mainSection.insertBefore(book.element, mainSection.children[1]);
    else
        mainSection.appendChild(book.element);
}

function displayBooks() {
    books.forEach(book => displayBook(book));
}

function addInitialBooks() {
    /*
    books.push(new Book(
        'The Fountainhead',
        'Ayn Rand',
        'https://covers.openlibrary.org/b/olid/OL32100180M-M.jpg',
        'Unknown'
    ));
    books.push(new Book(
        'Atlas Shrugged',
        'Ayn Rand',
        'https://covers.openlibrary.org/b/olid/OL1556406M-M.jpg',
        'Unknown'
    ));
    */
}

function storageAvailable(type) {
    let storage;

    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;

    } catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function onAddBookButtonClick(e) {
    modalForm.style.display = 'flex';
}

function onSubmitBookButtonClick(e) {
    modalForm.style.display = 'none';
    books.push(new Book(
        titleInput.value,
        authorInput.value,
        coverImageInput.value,
        fileInput.value
    ));
    displayBooks();
}

function onWindowClick(e) {
    if (e.target === modalForm)
        modalForm.style.display = 'none';
}

function onWindowBeforeUnload(e) {
    const savedBooks = [];
    books.forEach(book => {
        savedBooks.push({
            name: book.name,
            author: book.author,
            coverImageUrl: book.coverImageUrl,
            pageCount: book.pageCount,
            read: book.read
        });
    });
    localStorage.setItem('books', JSON.stringify(savedBooks));
}


if (localStorageEnabled) {
    console.log('localStorage enabled!');
    let savedBooks = localStorage.getItem('books');
    if (savedBooks !== null && savedBooks !== undefined) {
        savedBooks = JSON.parse(savedBooks);
        savedBooks.forEach(savedBook => {
            const book = new Book(
                savedBook.name,
                savedBook.author,
                savedBook.coverImageUrl,
                savedBook.pageCount,
                savedBook.read
            );
            books.push(book);
        });
    }
}

window.addEventListener('beforeunload', onWindowBeforeUnload);
window.addEventListener('click', onWindowClick);
addBookButton.addEventListener('click', onAddBookButtonClick);
submitBookButton.addEventListener('click', onSubmitBookButtonClick);

addInitialBooks();
displayBooks();