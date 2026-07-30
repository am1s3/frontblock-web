export default function DevNotice() {
  return (
    <div className="devnotice clip" role="status" aria-live="polite">
      <div className="devnotice__tape" aria-hidden />
      <div className="devnotice__body">
        <div className="devnotice__stamp"><span className="devnotice__dot" />СЕРВЕР В РАЗРАБОТКЕ</div>
        <p>Следи за социальными сетями, чтобы быть в курсе запуска.</p>
        <div className="devnotice__socials">
          <a className="soc soc--tt clip" href="https://www.tiktok.com/@frontblock_official" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-1-.11z"/></svg>
            frontblock_official
          </a>
          <a className="soc soc--tg clip" href="https://t.me/FrontBlock1" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.94 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.64 6.8-1.63 7.7c-.12.55-.44.68-.9.42l-2.5-1.84-1.2 1.16c-.14.13-.25.24-.5.24l.18-2.52 4.58-4.14c.2-.18-.04-.27-.3-.1l-5.66 3.56-2.44-.76c-.53-.17-.54-.53.11-.79l9.53-3.67c.44-.16.83.11.73.74z"/></svg>
            t.me/FrontBlock1
          </a>
        </div>
      </div>
      <div className="devnotice__tape devnotice__tape--b" aria-hidden />
    </div>
  );
}
