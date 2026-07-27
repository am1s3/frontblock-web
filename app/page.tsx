
export const runtime = "edge";
export default function Home() {
  return (
    <div className="wrap">
      <h1>FRONT BLOCK</h1>
      <p>Милитари-сервер. Две фракции, фронт в 5 км, техника, FPV-дроны.</p>
      <div className="card">
        <div><b>IP:</b> <code>play.frontblock.dev</code></div>
        <div><b>Версия:</b> 1.20.1 (Forge-сборка)</div>
        <div><b>Онлайн:</b> скоро подтянем с сервера</div>
      </div>
      <div className="card">
        <span className="tpa">[ТПА]</span> Террористическая повстанческая армия &nbsp;·&nbsp;
        <span className="vss">[ВСС]</span> Военные силы сопротивления
      </div>
      <p><a href="/register">Регистрация</a> · <a href="/login">Вход</a> (играть без аккаунта на сайте нельзя)</p>
    </div>
  );
}
