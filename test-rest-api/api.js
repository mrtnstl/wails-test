import express from "express";
import crypro from "node:crypto";

const MOCK_DB = {
    Users: [
        {id: "", name: "", eamil: ""},
    ],
    Books: [
        {id: "bid_001", title: "Book Title", description: "Book Description", pages: -1}
    ]
}

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    return res.status(200).json({message: "API is working!"});
});

app.get("/books", (_req, res) => {
    const books = MOCK_DB.Books;
    return res.status(200).json({books});
})

app.get("/books/:bookId", (req, res) => {
    const book = MOCK_DB.Books.filter(book => book.id === req.params.bookId);
    return res.status(200).json({book});
})

app.post("/books/:bookId", checkAuthTokenMW, (req, res) => {
    const newBook = req.body;
    newBook.id = crypro.randomBytes(32).toString("hex");
    MOCK_DB.Books.push(newBook);
    return res.status(201).json({message: "Book created", id: newBook.id});
})

app.delete("/books/:bookId", checkAuthTokenMW, (req, res) => {
    MOCK_DB.Books = MOCK_DB.Books.filter(book => book.id !== req.params.bookId);
    return res.status(200).json({message: "Book deleted", id: req.params.bookId});
})

app.listen(3000, ()=>console.log("API is listening on port 3000"));

// middleware
function checkAuthTokenMW(req, res, next){
    const bearerToken = req.headers["Authorization"]?.split(" ")[1] || undefined;
    if(!bearerToken){
        return res.status(401).json({message: "Unauthorized request"});
    }
    // TODO: check token existence in array
    return next();
}