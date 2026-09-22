export function HomeFooter() {
  return (
    <footer className="wrap">
      <a className="brand" href="#" aria-label="Delta Labs home">
        <svg className="brand-lockup" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370 108" width="205" height="60" aria-hidden="true">
          <path d="M49 8 13 73h24L62 28Z" fill="currentColor" />
          <path d="m65 35-12 22 10 17H43L31 94h66Z" fill="currentColor" />
          <text x="126" y="61" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" fontSize="31" letterSpacing="1.1" fill="currentColor">DELTA LABS</text>
          <text x="128" y="82" fontFamily="Arial,Helvetica,sans-serif" fontSize="9" letterSpacing="2.1" fill="currentColor">ENGINEERING CHANGE.</text>
        </svg>
      </a>
      <span>Engineering change.</span>
      <span>© {new Date().getFullYear()} Delta Labs</span>
      <a href="#">Back to top ↑</a>
    </footer>
  );
}
