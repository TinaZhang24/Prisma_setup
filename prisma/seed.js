const prisma = require("../prisma");
const seed = async () => {
    const books = [];
    for (let i = 0; i < 10; i++) {
      books.push({ title: `Book ${i}` });
    }
    await prisma.book.createMany({ data: books });
  };
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });