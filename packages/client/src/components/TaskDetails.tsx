import React                      from "react";
import { HTMLTable, IPanelProps } from "@blueprintjs/core";

class TaskDetails extends React.Component<IPanelProps & { task: any }> {
  render() {
    const {task} = this.props;
    return (
      <HTMLTable condensed={true} striped={true} interactive={true} className="table">
        <tbody>
        <tr>
          <td>Id:</td>
          <td>{task.id}</td>
        </tr>
        <tr>
          <td>Status:</td>
          <td>{task.status}</td>
        </tr>
        <tr>
          <td>IntegrationId:</td>
          <td>{task.integrationId}</td>
        </tr>
        <tr>
          <td>Type:</td>
          <td>{task.type}</td>
        </tr>
        <tr>
          <td>CreatedAt:</td>
          <td>{task.createdAt}</td>
        </tr>
        </tbody>
      </HTMLTable>
    )
  }
}

export default TaskDetails

