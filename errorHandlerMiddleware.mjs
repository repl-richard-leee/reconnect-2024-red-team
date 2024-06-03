export default function errorHandlerMiddleware(err, req, res, next) {
  res.status(400);
  const output = `
    <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <h1>Error!</h1>
        ${err.message}
      </body>
    </html>
  `;
  res.send(output);
}