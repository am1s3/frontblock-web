"use client";
import Reveal from "@/components/Reveal";
import Panel from "@/components/Panel";
import DevNotice from "@/components/DevNotice";

export default function Downloads() {
  return (
    <>
      <h1 className="page-h">Скачать сборку <small>// заморожено</small></h1>
      <Reveal>
        <DevNotice />
      </Reveal>
      <Reveal delay={80}>
        <Panel label="СТАТУС СБОРКИ">
          <p className="muted" style={{ lineHeight: 1.7, margin: 0 }}>
            Клиентская сборка появится здесь в день запуска сервера — одним архивом
            со всеми модами, конфигами и ресурс-паком. Пока качать нечего: сервер в
            разработке, и без него сборке некуда подключаться. Займи место в строю
            через регистрацию — оповестим, как только откроем фронт.
          </p>
        </Panel>
      </Reveal>
    </>
  );
}
