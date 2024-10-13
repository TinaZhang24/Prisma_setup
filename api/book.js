const express = require("express");
const prisma = require("../prisma");
const router = express.Router();
module.exports = router;

//GET /books should send an array of all the books.//
router.get("/", async (req, res, next) => {
    try {
      const books = await prisma.book.findMany();
      res.json(books);
    } catch (e) {
      next(e);
    }
  });

  //GET /books/:id should send a single book with the specified id. It should 404 if the book is not found.//
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

  //PUT /books/:id should update the book according to the request body. Send a 400 error if a title is not properly provided. Send 404 if the book does not exist.//
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

  //POST /books/ should add a new book to the database. It should send a 400 error if a title was not properly provided. Send the created book on success.//
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

  //DELETE /books/:id should delete the book with the specified id. It should 404 if the book is not found. On success, send just the status 204.//
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