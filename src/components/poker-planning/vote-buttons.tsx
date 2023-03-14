import React, { useState } from "react";
import { Button } from "@mui/material";

interface VoteButtonsProps {
  voteAction: (points: number) => void;
  possiblePointsToVote: number[]
  selectedValue: number
}

const VoteButtons: React.FC<VoteButtonsProps> = (props) => {
  return (
    <div style={{ display: "block", margin: "5px" }}>
      {
        props.possiblePointsToVote.map((value) =>
          <Button key={value} variant="contained" color={value === props.selectedValue ? "success" : "primary"} style={{ minWidth: "0px", fontSize: "2rem", margin: "5px" }}
                  onClick={() => {
                    props.voteAction(value);
                  }
                  }>{value}</Button>
        )
      }
    </div>
  );
};

export default VoteButtons;