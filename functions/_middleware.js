/**
 * Case-insensitive URL rescue.
 *
 * Cloudflare Pages routing is case-sensitive: /Foo/Bar.html and /foo/bar.html
 * are different paths and only the exact-case form is served. When an external
 * link, cached SERP entry, or bookmark uses different casing than the file on
 * disk, the user gets a 404 even though the content exists.
 *
 * This middleware lets the original request flow through untouched. If — and
 * only if — the response is a 404 on a GET request whose path contains any
 * uppercase letters, we 301 the user to the all-lowercase form. Lowercase is
 * the canonical form across these sites, so this is a permanent redirect.
 *
 * If the lowercase path also doesn't exist, the user lands on the lowercase
 * URL's 404 page (which has search). One redirect hop, no loop.
 */
export async function onRequest(context) {
  const response = await context.next();

  if (
    response.status !== 404 ||
    context.request.method !== 'GET'
  ) {
    return response;
  }

  const url = new URL(context.request.url);
  if (!/[A-Z]/.test(url.pathname)) {
    return response;
  }

  const lowerUrl = new URL(url);
  lowerUrl.pathname = url.pathname.toLowerCase();
  return Response.redirect(lowerUrl.toString(), 301);
}
