import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./AccordionQuestion.css";
import { motion } from "framer-motion";
type AccordionQuestionPropTypes = {
  info: { id: number; question: string; description: string };
  index: number;
};

export default function AccordionQuestion({
  info,
  index,
}: AccordionQuestionPropTypes) {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: "20px", filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: "0", filter: "blur(0)" }}
      transition={{ duration: 1.2, delay: (index + 1) / 3 + 0.2 }}
      viewport={{once:true}}
      className="my-5"
    >
      <Accordion
        className="accordion-style"
        expanded={expanded === `${info.id}`}
        onChange={handleChange(`${info.id}`)}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: expanded === `${info.id}` ? "#888" : "#888",
                fontSize: expanded === `${info.id}` ? "2rem" : "2rem",
              }}
            />
          }
          aria-controls={`${info.id}bh-content`}
          id={`${info.id}bh-header`}
        >
          <Typography
            component="p"
            sx={{
              color: "#fff",
              fontSize: expanded === `${info.id}` ? "1.1rem" : "1rem",
            }}
          >
            {info.question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            component={"span"}
            sx={{ color: "#888" }}
            dangerouslySetInnerHTML={{ __html: info.description }}
          ></Typography>
        </AccordionDetails>
      </Accordion>
    </motion.div>
  );
}
