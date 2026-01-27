import express from "express";
import crypro from "node:crypto";

const MOCK_DB = {
    Users: [],
    Books: [
        {
            id: "bid_001",
            title: "Clean Code: A Handbook of Agile Software Craftsmanship",
            description: "Robert C. Martin klasszikusa a tiszta, olvasható és fenntartható kód írásáról.",
            pages: 431
        },
        {
            id: "bid_002",
            title: "The Pragmatic Programmer: Your Journey to Mastery",
            description: "Andrew Hunt és David Thomas gyakorlati tanácsai a jobb programozóvá váláshoz.",
            pages: 352
        },
        {
            id: "bid_003",
            title: "Designing Data-Intensive Applications",
            description: "Martin Kleppmann mélyreható könyv adatbázisokról, elosztott rendszerekről és skálázhatóságról.",
            pages: 611
        },
        {
            id: "bid_004",
            title: "JavaScript: The Good Parts",
            description: "Douglas Crockford rövid, de nagyon lényegre törő könyve a JavaScript legjobb részeiről.",
            pages: 153
        },
        {
            id: "bid_005",
            title: "You Don't Know JS Yet: Scope & Closures",
            description: "Kyle Simpson sorozatának első kötete a JavaScript scope és closure mechanizmusairól.",
            pages: 98
        },
        {
            id: "bid_006",
            title: "Eloquent JavaScript: A Modern Introduction to Programming",
            description: "Marijn Haverbeke ingyenesen is elérhető modern JavaScript bevezető könyve.",
            pages: 472
        },
        {
            id: "bid_007",
            title: "Refactoring: Improving the Design of Existing Code",
            description: "Martin Fowler klasszikusa a meglévő kód átdolgozásáról és javításáról (2. kiadás).",
            pages: 431
        },
        {
            id: "bid_008",
            title: "Domain-Driven Design: Tackling Complexity in the Heart of Software",
            description: "Eric Evans alapmű a domain-driven design filozófiájáról és gyakorlatáról.",
            pages: 560
        },
        {
            id: "bid_009",
            title: "Introduction to Algorithms",
            description: "CLRS (Cormen, Leiserson, Rivest, Stein) – az algoritmusok „bibliája”.",
            pages: 1312
        },
        {
            id: "bid_010",
            title: "Grokking Algorithms",
            description: "Aditya Bhargava nagyon szemléletes, illusztrált bevezető az algoritmusok világába.",
            pages: 256
        }
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