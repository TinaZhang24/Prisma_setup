# Seed the Database

1. Create a new file `index.js` in the `prisma` folder. In that file, create and export a new `PrismaClient`.
   ```js
   const { PrismaClient } = require("@prisma/client");
   const prisma = new PrismaClient();
   module.exports = prisma;
   ```
2. Create a new file `seed.js` in the `prisma` folder. Refer to [the docs on how to create many records](https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-multiple-records).

   1. Create an empty array.
   2. Fill the array with 10 objects. Each object should have a `title` key and some placeholder value.
   3. Pass that array in as the `data` to `createMany`.

   ```js
   const prisma = require("../prisma");
   const seed = async () => {
     // TODO: Create 10 books with placeholder titles
   };
   seed()
     .then(async () => await prisma.$disconnect())
     .catch(async (e) => {
       console.error(e);
       await prisma.$disconnect();
       process.exit(1);
     });
   ```

      <details>
      <summary>See Solution</summary>

   ```js
   const seed = async () => {
     const books = [];
     for (let i = 0; i < 10; i++) {
       books.push({ title: `Book ${i}` });
     }
     await prisma.book.createMany({ data: books });
   };
   ```

      </details>

3. Update `package.json` to configure Prisma's integrated seeding functionality.
   ```json
   "prisma": {
     "seed": "node prisma/seed.js"
   }
   ```
4. Use Prisma Migrate to completely reset and seed the database.\
   `npx prisma migrate reset`
   - Note: this is designed to be used in _development_ only! Another option is `npx prisma db seed`, but that will not clear existing data. `reset` is simpler to use (for now).
5. Confirm that the database is correctly seeded with 10 books.\
   `npx prisma studio`

Congrats! You have a seeded database and are ready to serve that data through Express! We'll be doing that in the next block :)
