import React from "react";
import RollConfig from "./RollConfig";
import EmployeeConfig from "./EmployeeConfig";
import AddPermissionConfig from "./AddPermissionConfig";
import ConfigsPage from "./ConfigsPage";

export default function SluDetailPage({ slug }: { slug: string }) {
  switch (slug) {
    case "permissions": {
      return (
        <>
          <AddPermissionConfig />
        </>
      );
    }
    case "roll": {
      return (
        <>
          <RollConfig />

        </>
      );
    }
    case "employee": {
      return <EmployeeConfig />;
    }
    case "configs": {
      return <ConfigsPage />;
    }
  }
}
