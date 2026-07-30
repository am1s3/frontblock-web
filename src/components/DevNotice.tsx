export default function DevNotice() {
  return (
    <div className="devnotice clip" role="status" aria-live="polite">
      <div className="devnotice__tape" aria-hidden />
      <div className="devnotice__body">
        <div className="devnotice__stamp">
          <span className="devnotice__dot" />СЕРВЕР В РАЗРАБОТКЕ
        </div>
        <p>
          Кнопки <s>«Скачать сборку»</s> и <s>«Зайти на сервер»</s> сняты с боевого
          дежурства — заходить пока некуда. Сейчас <b>доступна только регистрация</b>:
          займи место в строю, и в день запуска получишь доступ одним из первых.
        </p>
        <div className="devnotice__meta">
          <span>// сборка клиента</span><span className="devnotice__x">недоступна</span>
          <span>// подключение</span><span className="devnotice__x">недоступно</span>
          <span>// регистрация</span><span className="devnotice__ok">открыта</span>
        </div>
      </div>
      <div className="devnotice__tape devnotice__tape--b" aria-hidden />
    </div>
  );
}
