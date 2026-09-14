/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if(url.pathname==='/admin'||url.pathname.startsWith('/admin/')){const target=new URL('/library',request.url);const topic=url.searchParams.get('topic');if(topic)target.searchParams.set('topic',topic);return Response.redirect(target,308);}
    const agent=request.headers.get('user-agent')||'';
    if(/GPTBot|ClaudeBot|CCBot|Bytespider|Amazonbot|meta-externalagent|Applebot-Extended/i.test(agent)){
      return new Response('Automated collection is not permitted.',{status:403,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const response=await handler.fetch(request, env, ctx);
    const secured=new Response(response.body,response);
    secured.headers.set('X-Content-Type-Options','nosniff');
    secured.headers.set('Referrer-Policy','strict-origin-when-cross-origin');
    if(url.pathname==='/admin'||url.pathname.startsWith('/admin/')||url.pathname.startsWith('/api/private/')){
      secured.headers.set('Cache-Control','private, no-store, max-age=0');
      secured.headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
      secured.headers.set('Vary','Cookie, oai-authenticated-user-email');
      secured.headers.set('Content-Security-Policy',"frame-ancestors 'self'");
    }
    return secured;
  },
};

export default worker;
