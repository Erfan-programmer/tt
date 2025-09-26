"use client"
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AddUserAction from "./AddUserAction";
import RemoveUserAction from "./RemoveUserAction";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function UserActionTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: { sx: "center", md: "end" },
        }}
        className="tab-container"
      >
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              width: {
                xs: "100%",
                md: "70%",
              },
              
              flexDirection: "column",
              marginLeft: "5rem",
              borderBottom: "1px solid #222",
              display: "flex",
              "& .MuiTabs-indicator": {
                backgroundColor: "#00CB08",
                borderRadius: "1em",
                height: "4px",
              },
            }}
            aria-label="basic tabs example"
          >
            <Tab
             sx={{
                 "&.Mui-selected": {
                  color: "inherit", 
               }
             }}
             label={ 
               <span className="text-[var(--main-background)] dark:text-white">
                  Add Contacts
                </span>
              }
              {...a11yProps(0)}
              />
            <Tab
              sx={{
                  "&.Mui-selected": {
                   color: "inherit", 
                }
              }}
              label={
                <span className="text-[var(--main-background)] dark:text-white">
                  Remove Contacts
                </span>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </div>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AddUserAction />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <RemoveUserAction />
      </CustomTabPanel>
    </Box>
  );
}
