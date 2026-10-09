// GA4 bootstrap, rendered in <head> so events fired on first render are queued
// rather than lost. Disabled unless NEXT_PUBLIC_GA4_ID is set; admin pages are
// excluded because their URLs can contain applicant search terms.
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
const isValidId = /^G-[A-Z0-9]{4,20}$/.test(GA_ID); // interpolated into a script, so validate

export function GoogleAnalytics() {
  if (!isValidId) return null;
  const snippet = `if(!location.pathname.startsWith('/admin')){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}',{allow_google_signals:false});var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);}`;
  return <script dangerouslySetInnerHTML={{ __html: snippet }} />;
}
