import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DynamicVerificationTab, {
  StepItem,
} from "@/components/modules/UserPanel/dashboard/account/verification/DynamicVerificationTab";

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

export default function TabVerification() {
  const [value, setValue] = React.useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const passportSteps: StepItem[] = [
    {
      key: "front",
      title: "Front Side",
      image: "/6e3edf60c492e2af348dde34be66561622aa1d02.png",
    },
    {
      key: "selfie",
      title: "Selfie with Passport",
      image: "/2e08a3601196e8f3846025c785610f725ed4adfa.png",
    },
  ];

  const idCardSteps: StepItem[] = [
    {
      key: "front",
      title: "Front Side",
      image: "/6e3edf60c492e2af348dde34be66561622aa1d02.png",
    },
    {
      key: "back",
      title: "Back Side",
      image: "/b3626dd7eeff2cc724451fa8b0bea52b060b83d4.png",
    },
    {
      key: "selfie",
      title: "Selfie with ID card",
      image: "/d779a749454f1cb71ef4d5588454092d262382c5.png",
    },
  ];

  const driverLicenseSteps: StepItem[] = [
    {
      key: "front",
      title: "Front Side",
      image: "/6e3edf60c492e2af348dde34be66561622aa1d02.png",
    },
    {
      key: "back",
      title: "Back Side",
      image: "/b3626dd7eeff2cc724451fa8b0bea52b060b83d4.png",
    },
    {
      key: "selfie",
      title: "Selfie with ID card",
      image: "/d779a749454f1cb71ef4d5588454092d262382c5.png",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{ borderBottom: 1, borderColor: "divider" }}
        className="tab-container"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            justifyContent: "start",
            flexDirection: "column",
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
            label={
              <span className="text-[var(--main-background)] dark:text-white">
                Passport
              </span>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <span className="text-[var(--main-background)] dark:text-white">
                ID card
              </span>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <span className="text-[var(--main-background)] dark:text-white">
                Driver`&apos;s License
              </span>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DynamicVerificationTab type="passport" steps={passportSteps} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DynamicVerificationTab type="national_id" steps={idCardSteps} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DynamicVerificationTab
          type="driver_license"
          steps={driverLicenseSteps}
        />
      </CustomTabPanel>
    </Box>
  );
}
