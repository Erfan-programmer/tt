"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TwalletPayment from "./TWalletPayment";
import DirectPayment from "./DirectPayment";

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
           {" "}
      {value === index && <Box sx={{ p: 3, minHeight: 200 }}>{children}</Box>} 
       {" "}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function PaymentMethodTabs({
  onCurrentTabValidityChange,
}: {
  onCurrentTabValidityChange?: (isValid: boolean) => void;
}) {
  const [value, setValue] = React.useState(0);
  const [twalletValid, setTwalletValid] = React.useState(false);
  const [directValid, setDirectValid] = React.useState(false);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onCurrentTabValidityChange) {
      if (newValue === 0) onCurrentTabValidityChange(twalletValid);
      else if (newValue === 1) onCurrentTabValidityChange(directValid);
    }
  };

  React.useEffect(() => {
    if (onCurrentTabValidityChange) {
      if (value === 0) onCurrentTabValidityChange(twalletValid);
      else if (value === 1) onCurrentTabValidityChange(directValid);
    }
  }, [twalletValid, directValid, value, onCurrentTabValidityChange]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
        }}
        className="tab-container"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            width: { xs: "90%" },
            borderBottom: "1px solid #222",
            "& .MuiTabs-indicator": {
              backgroundColor: "#00CB08",
              borderRadius: "1em",
              height: "4px",
            },
          }}
          aria-label="payment method tabs"
        >
          <Tab
            label={
              <span
                style={{ textTransform: "none" }}
                className="text-[var(--main-background)] dark:text-white"
              >
                Use T-Wallet
              </span>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <span
                style={{ textTransform: "none" }}
                className="text-[var(--main-background)] dark:text-white"
              >
                Direct Payment
              </span>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <TwalletPayment onValidityChange={setTwalletValid} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      <DirectPayment onValidityChange={setDirectValid} />
      </CustomTabPanel>
    </Box>
  );
}
