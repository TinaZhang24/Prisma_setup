# Express Routing

You may have noticed that there's a lot of repeated logic in our `/books` router.

1. Use [`router.route`](https://expressjs.com/en/5x/api.html#router.route) to chain HTTP verbs with optional middleware. This allows us to avoid duplicate route naming and thus typing errors.
2. Use [`router.param`](https://expressjs.com/en/5x/api.html#router.param) to pull out repeated logic. In this case, whenever an `id` is passed in, we'll always send a 404 if the book with that ID does not exist.

# Prisma Error Handling

Currently we're just calling `next(e)` for every error that Prisma throws, but we can use that information to build better errors. Prisma errors have codes, which we can use to do things like attach better status codes.

See [Prisma examples on error handling](https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors).
