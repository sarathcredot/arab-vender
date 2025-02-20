import { capitalize } from "lodash";
import React from "react";

interface StatusIndicatorProps {
  status: string | boolean;
  variant?: "chip" | "default";
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, variant = "default" }) => {
  const getStatusColor = (status: string | boolean): string => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "BLOCKED":
        return "red";
      case "PENDING":
        return "#f0ad4e";
      case "PAID":
        return "green";
      case "APPROVED":
        return "green";
      case "UNDER_VERIFICATION":
        return "#ff9500";
      case "COMPLETED":
        return "green";
      case "REJECTED":
        return "RED";
      case "IN_PROGRESS":
        return "#97c9b4";
      default:
        return "";
    }
  };

  const getButtonStyle = (status: string | boolean): React.CSSProperties => {
    return {
      border: `1px solid ${getStatusColor(status)}`,
      color: getStatusColor(status),
      borderRadius: "10px",
      padding: "2px 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "100px",
      maxWidth: "auto",
    };
  };

  if (variant === "chip") {
    return <div style={getButtonStyle(status)}>{capitalize(status?.toString())}</div>;
  }

  return (
    // <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    //     <div
    //         style={{
    //             width: '8px',
    //             height: '8px',
    //             borderRadius: '50%',
    //             background: getStatusColor(status),
    //         }}
    //     />
    //     {status.toString()}
    // </div>
    <p
      style={{
        background: getStatusColor(status),
        color: "#fff",
        padding: "3px 15px",
        borderRadius: 20,
        fontSize: "12px",
        margin: 0,
      }}
    >
      {status && capitalize(status.toString().replace("_", " "))}
    </p>
  );
};

export default StatusIndicator;
