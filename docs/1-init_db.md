# Initialize the Database

1. Create a new repository using this one as a template.
2. Clone down your repository.
3. Install the Prisma CLI.\
   `npm install prisma --save-dev`
4. Initialize Prisma to connect to PostgreSQL. You should see a new `prisma` folder, in which is a single `schema.prisma` file.\
   `npx prisma init --datasource-provider postgresql`
5. Create a new PostgreSQL database.\
   `createdb prismatic-books`
6. In the generated `.env` file, set `DATABASE_URL` to `"postgresql://username:password@localhost:5432/prismatic-books"`.
   - Make sure to change the username and password to your actual PostgreSQL credentials!
7. In the `schema.prisma` file, add a `Book` model with the following fields:

   - the `id` is an integer that will auto-increment (see [how to define an ID field](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-an-id-field))
   - `title` is a string

   <details>
   <summary>See solution</summary>

   ```prisma
   model Book {
    id    Int     @id @default(autoincrement())
    title String
   }
   ```

   </details>

8. Create and run the initial migration.\
   `npx prisma migrate dev --name init`
   - If successful, you should see the message "Your database is now in sync with your schema."
9. Explore the created database. You should see an empty `Book` model.\
   `npx prisma studio`
10. If you made a mistake or need to change the schema, use [`npx prisma db push`](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema) to quickly sync your Prisma schema with your database schema. You want to run that command any time you change your `schema.prisma` file.
    1. Once you are happy with your changes to the schema, run `npx prisma migrate dev` to generate a migration from your changes.
