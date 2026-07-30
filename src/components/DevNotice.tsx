export default function DevNotice() {
  return (
    <div className="devnotice clip" role="status" aria-live="polite">
      <div className="devnotice__tape" aria-hidden />
      <div className="devnotice__body">
        <div className="devnotice__stamp">
          <span className="devnotice__dot" />СЕРВЕР В РАЗРАБОТКЕ
        </div>
        <p>Следи за социальными сетями, чтобы быть в курсе запуска.</p>
        <div className="devnotice__socials">
          <a
            className="soc soc--tt clip"
            href="https://www.tiktok.com/@frontblock_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="soc__tag">TT</span> frontblock_official
          </a>
          <a
            className="soc soc--tg clip"
            href="https://t.me/FrontBlock1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="soc__tag">TG</span> t.me/FrontBlock1
          </a>
        </div>
      </div>
      <div className="devnotice__tape devnotice__tape--b" aria-hidden />
    </div>
  );
}
