import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import { format } from "date-fns";

const TimelineCard = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getTimeline();
  }, []);

  const getTimeline = async () => {
    //const res = await //DO API CALL HERE
    // For now, static list is used for demonstration. Do not forget to parse data from API response. Use static data as sample.
    const resList = [
      { title: "Car Service", desc: "Car service description", date: "2023-10-01" },
      { title: "Car Service", desc: "Car service description", date: "2023-10-02" },
      { title: "Car Service", desc: "Car service description", date: "2023-10-03" },
      { title: "Car Service", desc: "Car service description", date: "2023-10-04" },
      { title: "Car Service", desc: "Car service description", date: "2023-10-05" },
      { title: "Car Service", desc: "Car service description", date: "2023-10-06" },
      { title: "Car Service", desc: "Car service description", date: "2023-10-07" },
    ];
    setList(resList);
  };

  return (
    <>
      <div style={{ paddingTop: "100px" }}>
        {list.map((item, index) => (
          <TimelineItem sx={{ minHeight: "100px" }} key={index}>
            <TimelineOppositeContent sx={{ minHeight: "100px", m: "15px" }} align="right" variant="body2" color="text.secondary" fontWeight={"bold"}>
              {format(new Date(item.date), "dd/MM/yyyy")}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ display: "none" }} />
              <TimelineDot sx={{ backgroundColor: "white", minHeight: "20px" }}>
                <CarRepairIcon sx={{ color: "#000d6b" }} />
              </TimelineDot>
              {index !== list.length - 1 && <TimelineConnector sx={{ backgroundColor: "#000d6b" }} />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography>{item.title}</Typography>
              <Typography color="text.secondary">{item.desc}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </div>
    </>
  );
};

export default TimelineCard;
