import React        from 'react';
import { MenuItem } from "@blueprintjs/core";

export class SelectMenuItem extends React.Component<any, any> {

  selectMenuItem = (e: any) => {
    e.preventDefault();
    if (this.props.selected) {
      this.props.onItemDeSelected();
    } else {
      this.props.onItemSelected();
    }
  };

  render() {
    const {
      text,
      ariaLabel,
    } = this.props;
    return (
      <MenuItem
        aria-label={ariaLabel}
        text={text}
        icon={this.props.selected ? "tick" : "blank"}
        onClick={this.selectMenuItem}
      />
    )
  }
}