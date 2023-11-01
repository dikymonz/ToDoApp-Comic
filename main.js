document.addEventListener("DOMContentLoaded", function () {
    const inputBookTitle = document.querySelector("#inputBookTitle");
    const inputBookAuthor = document.querySelector("#inputBookAuthor");
    const inputBookYear = document.querySelector("#inputBookYear");
    const inputBookIsComplete = document.querySelector("#inputBookIsComplete");
    const bookSubmit = document.querySelector("#bookSubmit");
    const incompleteBookshelfList = document.querySelector("#incompleteBookshelfList");
    const completeBookshelfList = document.querySelector("#completeBookshelfList");
    const searchBookTitle = document.querySelector("#searchBookTitle");
    const searchForm = document.querySelector("#searchBook");
  
    // Fungsi untuk mendapatkan data buku dari localStorage
    function getBooksFromStorage() {
      const storedBooks = localStorage.getItem("books");
      return storedBooks ? JSON.parse(storedBooks) : [];
    }
  
    // Fungsi untuk menyimpan data buku ke localStorage
    function saveBooksToStorage() {
      localStorage.setItem("books", JSON.stringify(books));
    }
  
    let books = getBooksFromStorage();
  
    // Ketika halaman dimuat, tampilkan data buku dari localStorage
    books.forEach((book) => {
      addBookToShelf(book);
    });
  
    bookSubmit.addEventListener("click", function (e) {
      e.preventDefault();
  
      const title = inputBookTitle.value;
      const author = inputBookAuthor.value;
      const year = parseInt(inputBookYear.value);
      const isComplete = inputBookIsComplete.checked;
  
      if (title === "" || author === "" || isNaN(year)) {
        alert("Mohon isi semua kolom dengan benar!");
        return;
      }
  
      const book = {
        id: generateId(),
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
      };
  
      books.push(book);
      addBookToShelf(book);
      saveBooksToStorage();
      clearInput();
    });
  
    // Fungsi untuk mencari buku berdasarkan judul
    function searchBookByTitle(title) {
      return books.filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
    }
  
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault(); 
  
      const searchTitle = searchBookTitle.value.trim();
  
      if (searchTitle === "") {
        alert("Mohon masukkan judul buku untuk mencari.");
        return;
      }
  
      clearBookshelf();
  
      // Cari buku berdasarkan judul yang cocok
      const searchResult = searchBookByTitle(searchTitle);
  
      // Tampilkan hasil pencarian
      if (searchResult.length === 0) {
        alert("Tidak ada buku yang cocok dengan pencarian Anda.");
      } else {
        searchResult.forEach((book) => {
          addBookToShelf(book);
        });
      }
  
      clearInput();
    });
  
    // Fungsi untuk menambahkan buku ke rak buku
    function addBookToShelf(book) {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");
      bookItem.setAttribute("data-id", book.id);
  
      const titleElement = document.createElement("h3");
      titleElement.innerText = book.title;
  
      const authorElement = document.createElement("p");
      authorElement.innerText = "Penulis: " + book.author;
  
      const yearElement = document.createElement("p");
      yearElement.innerText = "Tahun: " + book.year;
  
      const actionElement = document.createElement("div");
      actionElement.classList.add("action");
  
      const buttonComplete = document.createElement("button");
      buttonComplete.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
      buttonComplete.classList.add(book.isComplete ? "red" : "green");
      buttonComplete.addEventListener("click", function () {
        toggleBookStatus(book, bookItem);
      });
  
      const buttonDelete = document.createElement("button");
      buttonDelete.innerText = "Hapus buku";
      buttonDelete.classList.add("red");
      buttonDelete.addEventListener("click", function () {
        deleteBook(book, bookItem); 
      });
  
      actionElement.appendChild(buttonComplete);
      actionElement.appendChild(buttonDelete);
  
      bookItem.appendChild(titleElement);
      bookItem.appendChild(authorElement);
      bookItem.appendChild(yearElement);
      bookItem.appendChild(actionElement);
  
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  
    // Fungsi untuk mengubah status buku
    function toggleBookStatus(book, bookItem) {
      book.isComplete = !book.isComplete;
  
      // Hapus buku dari rak buku yang sesuai
      const parentList = book.isComplete ? incompleteBookshelfList : completeBookshelfList;
      parentList.removeChild(bookItem);
  
      // Tambahkan kembali buku dengan status yang telah diubah
      addBookToShelf(book);
      saveBooksToStorage();
    }
  
    // Fungsi untuk menghapus buku
    function deleteBook(book, bookItem) {
      const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku ini?");
      if (confirmDelete) {
        const index = books.findIndex((b) => b.id === book.id);
        if (index !== -1) {
          books.splice(index, 1);
          saveBooksToStorage();
        }

        bookItem.parentElement.removeChild(bookItem);
      }
    }
  
    // Fungsi untuk membersihkan input
    function clearInput() {
      inputBookTitle.value = "";
      inputBookAuthor.value = "";
      inputBookYear.value = "";
      inputBookIsComplete.checked = false;
    }
  
    // Fungsi untuk menghasilkan ID unik
    function generateId() {
      return Date.now();
    }
  
    // Fungsi untuk membersihkan rak buku
    function clearBookshelf() {
      incompleteBookshelfList.innerHTML = "";
      completeBookshelfList.innerHTML = "";
    }
  });
  