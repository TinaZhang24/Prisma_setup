# Setting up Express

1. `npm install express`
2. Create a new Express app.

   1. In the root project folder, create a new file named `server.js`.
   2. In `server.js`, set up an Express app that will listen on port 3000.
   3. Be sure to include body-parsing, 404, and error-handling middleware!

   <details>
   <summary>See Solution</summary>

   ```js
   const express = require("express");
   const app = express();
   const PORT = 3000;

   app.use(express.json());

   // Logging middleware
   app.use((req, res, next) => {
     console.log(`${req.method} ${req.originalUrl}`);
     next();
   });

   // 404
   app.use((req, res, next) => {
     next({ status: 404, message: "Endpoint not found." });
   });

   // Error-handling
   app.use((err, req, res, next) => {
     console.error(err);
     res.status(err.status ?? 500);
     res.json(err.message ?? "Sorry, something went wrong :(");
   });

   app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}...`);
   });
   ```

   </details>

3. Create a `/books` router.

   1. Create a new folder named `api`.
   2. In that folder, create a new file `books.js`.
   3. In that file, create and export a new Express router.
   4. Import the router into `server.js`.

    <details>
    <summary>See Solution</summary>

   `api/books.js`

   ```js
   const express = require("express");
   const router = express.Router();
   module.exports = router;
   ```

   `server.js`

   ```js
   app.use("/books", require("./api/books"));
   ```

    </details>

4. Install `nodemon` and add a `dev` script to `package.json`.
     <details>
     <summary>See Solution</summary>

   `npm install -D nodemon`

   ```json
    "scripts": {
      "dev": "nodemon server.js"
    }
   ```

     </details>

# Serve Data From Prisma

Let's add some routes to the `/books` router! These routes will perform the corresponding [Prisma CRUD Operation](https://www.prisma.io/docs/orm/prisma-client/queries/crud).

1. In `api/books.js`, import the Prisma Client so we can access the database.
    <details>
    <summary>See Solution</summary>

   ```js
   const prisma = require("../prisma");
   ```

    </details>

2. `GET /books` should send an array of all the books. Test this route in the `.http` file to make sure it works!
     <details>
     <summary>See Solution</summary>

   ```js
   router.get("/", async (req, res, next) => {
     try {
       const books = await prisma.book.findMany();
       res.json(books);
     } catch (e) {
       next(e);
     }
   });
   ```

     </details>

3. `GET /books/:id` should send a single book with the specified id. It should 404 if the book is not found.
    <details>
    <summary>See Solution</summary>

   ```js
   router.get("/:id", async (req, res, next) => {
     const { id } = req.params;

     try {
       // `id` has to be converted into a number before looking for it!
       const book = await prisma.book.findUnique({ where: { id: +id } });
       if (book) {
         res.json(book);
       } else {
         next({ status: 404, message: `Book with id ${id} does not exist.` });
       }
     } catch (e) {
       next(e);
     }
   });
   ```

    </details>

4. `PUT /books/:id` should update the book according to the request body. Send a 400 error if a title is not properly provided. Send 404 if the book does not exist.
     <details>
     <summary>See Solution</summary>

   ```js
   router.put("/:id", async (req, res, next) => {
     const { id } = req.params;
     const { title } = req.body;

     // Check if title was provided
     if (!title) {
       return next({
         status: 400,
         message: "A new title must be provided.",
       });
     }

     try {
       // Check if the book exists
       const book = await prisma.book.findUnique({ where: { id: +id } });
       if (!book) {
         return next({
           status: 404,
           message: `Book with id ${id} does not exist.`,
         });
       }

       // Update the book
       const updatedBook = await prisma.book.update({
         where: { id: +id },
         data: { title },
       });
       res.json(updatedBook);
     } catch (e) {
       next(e);
     }
   });
   ```

     </details>

5. `POST /books/` should add a new book to the database. It should send a 400 error if a title was not properly provided. Send the created book on success.
   <details>
   <summary>See Solution</summary>

   ```js
   router.post("/", async (req, res, next) => {
     const { title } = req.body;
     if (!title) {
       return next({
         status: 400,
         message: "Title must be provided for a new book.",
       });
     }
     try {
       const book = await prisma.book.create({ data: { title } });
       res.status(201).json(book);
     } catch (e) {
       next(e);
     }
   });
   ```

    </details>

6. `DELETE /books/:id` should delete the book with the specified id. It should 404 if the book is not found. On success, send just the status 204.
    <details>
    <summary>See Solution</summary>

   ```js
   router.delete("/:id", async (req, res, next) => {
     const { id } = req.params;

     try {
       // Check if the book exists
       const book = await prisma.book.findUnique({ where: { id: +id } });
       if (!book) {
         return next({
           status: 404,
           message: `Book with id ${id} does not exist.`,
         });
       }

       // Delete the book
       await prisma.book.delete({ where: { id: +id } });
       res.sendStatus(204);
     } catch (e) {
       next(e);
     }
   });
   ```

     </details>

You now have a fully working CRUD API!
