/**
 * Google tag (Google Analytics 4).
 *
 * This is Google's standard gtag.js snippet — an `async` loader followed by the inline
 * configuration — rendered into the document <head> by the root layout so it reaches every
 * page exactly once. The measurement ID comes from NEXT_PUBLIC_GA_ID (see .env.production),
 * falling back to the site's own tag so a build always ships the correct ID.
 *
 * The `async` attribute keeps the loader non-blocking (no render-blocking request and no
 * layout shift). This is the only third-party script on the site; see /privacy for what it
 * collects. Do not add a second loader or a Tag Manager container alongside it.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-HK72FDCSWW';

export function GoogleTag() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`,
        }}
      />
    </>
  );
}

