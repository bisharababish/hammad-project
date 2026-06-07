import { H as HTTPResponse } from "../../index.mjs";
import "node:http";
import "node:https";
import "node:fs";
import "node:url";
import "node:path";
const rendererTemplate = () => new HTTPResponse('<!doctype html>\n<html lang="ar" dir="rtl">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>hammad</title>\n  </head>\n  <body>\n  </body>\n</html>', { headers: { "content-type": "text/html; charset=utf-8" } });
function renderIndexHTML(event) {
  return rendererTemplate(event.req);
}
export {
  renderIndexHTML as default
};
