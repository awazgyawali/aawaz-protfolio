import { journey } from "../content";

export function Journey() {
  return (
    <>
      <p className="sc-kicker">The Journey</p>
      <h2 className="sc-title">{journey.title}</h2>
      <div className="journey-list">
        {journey.items.map((item) => (
          <div className="journey-item sc-item" key={item.year + item.title}>
            <b>{item.year}</b>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
