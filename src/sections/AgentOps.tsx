import { agentops } from "../content";

export function AgentOps() {
  return (
    <>
      <p className="sc-kicker">Workflow</p>
      <h2 className="sc-title">{agentops.title}</h2>
      <p className="sc-body sc-fade">{agentops.body}</p>
      <div className="agent-examples">
        {agentops.examples.map((ex) => (
          <div className="agent-example sc-item" key={ex.task}>
            <span className="agent-task">{ex.task}</span>
            <span className="agent-time">{ex.time}</span>
          </div>
        ))}
      </div>
      <p className="punchline sc-fade">{agentops.punch}</p>
    </>
  );
}
