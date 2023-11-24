
const FINISHED_BOOK = "finishedbooklist";
const UNREAD_BOOK = "unreadbooklist";
const IDITEM_BOOK = "iditembook";

const STORAGE_KEY = "Bookshelf-App";

let books = [];

function isStorageExist() {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return true;
  } catch (error) {
    alert("Browser Anda tidak mendukung local storage");
    return false;
  }
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    let data = JSON.parse(serializedData);
    if (data !== null) books = data;
    refreshDataBook();
  }
}

function updateDataStorage() {
  if (isStorageExist()) {
    saveData();
  }
}

function composeBookObject(titlebook, authorbook, yearbook, isCompleted) {
  return {
    id: +new Date(),
    titlebook,
    authorbook,
    yearbook,
    isCompleted,
  };
}

function findBook(iditembook) {
    for (const book of books) {
      if (book.id === iditembook) return book;
    }
    return null;
  }

function findbookindex(iditembook) {
  for (let index = 0; index < books.length; index++) {
    if (books[index].id === iditembook) return index;
  }
  return -1;
}

function refreshDataBook() {
  const listUnread = document.getElementById(UNREAD_BOOK);
  const listCompleted = document.getElementById(FINISHED_BOOK);

  listUnread.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const book of books) {
    const newBook = createbooklist(
      book.titlebook,
      book.authorbook,
      book.yearbook,
      book.isCompleted
    );
    newBook[IDITEM_BOOK] = book.id;

    if (book.isCompleted) {
      listCompleted.append(newBook);
    } else {
      listUnread.append(newBook);
    }
  }
}

function addbooklist() {
  const unreadBook = document.getElementById(UNREAD_BOOK);
  const finishedBook = document.getElementById(FINISHED_BOOK);
  const titleBook = document.getElementById("inputtitlebook").value;
  const authorBook = document.getElementById("inputauthorbook").value;
  const yearBook = document.getElementById("inputyearbook").value;
  const listChecked = document.getElementById("inputbookstatus").checked;

  const bookObject = composeBookObject(titleBook, authorBook, yearBook, listChecked);
  const bookList = createbooklist(titleBook, authorBook, yearBook, listChecked);

  bookList[IDITEM_BOOK] = bookObject.id;
  books.push(bookObject);

  if (listChecked) {
    finishedBook.append(bookList);
  } else {
    unreadBook.append(bookList);
  }

  updateDataStorage();
  setBackDefault();
}

function createbooklist(title, author, year, isCompleted) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerHTML = `Author: <span id="author"> ` + author + `</span>`;

  const bookYear = document.createElement("p");
  bookYear.innerHTML = `Year: <span id="year">` + year + `</span>`;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-list");

  if (isCompleted) {
    buttonContainer.append(
        createundobutton(),
      createeditbutton(),
      createdeletebutton()
    );
  } else {
    buttonContainer.append(
        createdonebutton(),
      createeditbutton(),
      createdeletebutton()
    );
  }

  const bookContainer = document.createElement("article");
  bookContainer.classList.add("book-item");
  bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  return bookContainer;
}

function createdonebutton() {
  return createButton("button-green", "Finished", function (event) {
    addbookitemlist(event.target.parentElement.parentElement);
  });
}

function createdeletebutton() {
  return createButton("button-red", "Delete", function (event) {
    deletebookitemlist(event.target.parentElement.parentElement);
  });
}

function createundobutton() {
  return createButton("button-yellow", "Unread", function (event) {
    undobookitemlist(event.target.parentElement.parentElement);
  });
}

function createeditbutton() {
  return createButton("button-orange", "Edit", function (e) {
    editBook(e.target.parentElement.parentElement);
  });
}

function createButton(buttonTypeClass, buttonTypeName, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerHTML = buttonTypeName;
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function addbookitemlist (bookshelfElement) {
    const bookshelfCompleted = document.getElementById(FINISHED_BOOK);
    const listbooktitle =
      bookshelfElement.querySelector(".book-item > h3").innerText;
    const listbookauthor =
      bookshelfElement.querySelector("span#author").innerText;
    const listbookyear = bookshelfElement.querySelector("span#year").innerText;
    const newbooklist = createbooklist(
      listbooktitle,
      listbookauthor,
      listbookyear,
      true
    );
    const bookList = findBook(bookshelfElement[IDITEM_BOOK]); 
    bookList.isCompleted = true;
    newbooklist[IDITEM_BOOK] = bookList.id;
    bookshelfCompleted.append(newbooklist);
    bookshelfElement.remove();
    updateDataStorage();
  }

  function deletebookitemlist(bookshelfElement) {
    const bookPosition = findbookindex(bookshelfElement[IDITEM_BOOK]);
    books.splice(bookPosition, 1);
    bookshelfElement.remove();
    updateDataStorage();
  }

  function undobookitemlist(bookshelfElement) {
    const listunread = document.getElementById(UNREAD_BOOK);
    const listbooktitle =
      bookshelfElement.querySelector(".book-item > h3").innerText;
    const listbookauthor =
      bookshelfElement.querySelector("span#author").innerText;
    const listbookyear = bookshelfElement.querySelector("span#year").innerText;
    const newbooklist = createbooklist(
      listbooktitle,
      listbookauthor,
      listbookyear,
      false
    );
    const bookList = findBook(bookshelfElement[IDITEM_BOOK]);
    bookList.isCompleted = false;
    newbooklist[IDITEM_BOOK] = bookList.id;
    listunread.append(newbooklist);
    bookshelfElement.remove();
    updateDataStorage();
  }

  function editBook(bookshelfElement) {
    document.getElementById("submitbook").style.display = "none";
    const editBtn = document.getElementById("editbook");
    editBtn.style.display = "block";
    document.getElementById("inputtitlebook").value =
      bookshelfElement.querySelector(".book-item > h3").innerText;
    document.getElementById("inputauthorbook").value =
      bookshelfElement.querySelector("span#author").innerText;
    document.getElementById("inputyearbook").value =
      bookshelfElement.querySelector("span#year").innerText;
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addeditedbook(bookshelfElement);
    });
  }
  

  function addeditedbook(bookshelfElement) {
    const title = document.getElementById("inputtitlebook").value;
    const author = document.getElementById("inputauthorbook").value;
    const year = document.getElementById("inputyearbook").value;
    const isCompleted = document.getElementById("inputbookstatus").checked;

    const bookList = findBook(bookshelfElement[IDITEM_BOOK]);
    bookList.titlebook = title;
    bookList.authorbook = author;
    bookList.yearbook = year;
    bookList.isCompleted = isCompleted;

    const updatedBookList = createbooklist(title, author, year, isCompleted);
    updatedBookList[IDITEM_BOOK] = bookshelfElement[IDITEM_BOOK];

    bookshelfElement.replaceWith(updatedBookList);

    updateDataStorage();
    setBackDefault();
    resetAddBookForm(); 
}

function resetAddBookForm() {
    document.getElementById("inputtitlebook").value = "";
    document.getElementById("inputauthorbook").value = "";
    document.getElementById("inputyearbook").value = "";
    document.getElementById("inputbookstatus").checked = false;

    document.getElementById("submitbook").style.display = "block";
    document.getElementById("editbook").style.display = "none";
}


function setBackDefault() {
  document.getElementById("inputtitlebook").value = "";
  document.getElementById("inputauthorbook").value = "";
  document.getElementById("inputyearbook").value = "";
  document.getElementById("inputbookstatus").checked = false;
}

function searchbooklist() {
    let value = document.getElementById("searchbooktitle").value.toUpperCase();
    let books = document.getElementsByClassName("book-item");
    for (let i = 0; i < books.length; i++) {
      let book = books[i].getElementsByTagName("h3");
      if (book[0].innerHTML.toUpperCase().indexOf(value) > -1) {
        books[i].style.display = "";
      } else {
        books[i].style.display = "none";
      }
    }
  }

document.addEventListener("DOMContentLoaded", function () {
  const submitAdd = document.getElementById("addbook");
  submitAdd.addEventListener("submit", function (event) {
    event.preventDefault();
    addbooklist();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const searchSubmit = document.getElementById("searchbook");
  searchSubmit.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBookList();
    if (isStorageExist()) {
        loadDataFromStorage();
    }
  });
});

function moveBookToFinished(bookshelfElement) {
    const finishedBook = document.getElementById(FINISHED_BOOK);
    const listbooktitle =
      bookshelfElement.querySelector(".book-item > h3").innerText;
    const listbookauthor =
      bookshelfElement.querySelector("span#author").innerText;
    const listbookyear = bookshelfElement.querySelector("span#year").innerText;
    const newbooklist = createbooklist(
      listbooktitle,
      listbookauthor,
      listbookyear,
      true
    );
    const bookList = findBook(bookshelfElement[IDITEM_BOOK]);
    bookList.isCompleted = true;
    newbooklist[IDITEM_BOOK] = bookList.id;
    finishedBook.append(newbooklist);
    bookshelfElement.remove();
    updateDataStorage();
  }
