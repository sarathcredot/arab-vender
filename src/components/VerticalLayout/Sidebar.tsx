import React from "react";

//import components
import SidebarContent from "./SidebarContent";

const Sidebar = (props: any) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar >
          {props.type !== "condensed" ? <SidebarContent /> : ""}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
