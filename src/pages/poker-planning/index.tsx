import React, { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import useHttp from "../../hooks/http/use-http";
import { router } from "next/client";

const PokerPlanning: React.FC = (props) => {
  const [userId, setUserId] = useState("");
  const [roomNumberToJoin, setRoomNumberToJoin] = useState("");

  const http = useHttp();
  const createRoom = () => {
    http.sendRequest<Number>(
      {
        url: "http://localhost:8080/rooms",
        method: "POST",
        body: JSON.stringify({ userId: userId }),
        headers: { "Content-Type": "application/json" }
      },
      (roomNumber: Number) => {
        router.push("/poker-planning/room/" + roomNumber);
      }
    );
  };
  const joinRoom = () => {
    router.push("/poker-planning/room/" + roomNumberToJoin);
  };

  return (
    <React.Fragment>
      <Box
        component="form"
        noValidate
        autoComplete="off">
        <div style={{textAlign: "center"}}>
          <Button variant={"contained"} onClick={createRoom}>Create room</Button>
        </div>
        <div style={{textAlign: "center", margin: "30px"}}>
          OR
        </div>
        <div style={{textAlign: "center"}}>
          <div style={{display: "block", margin: "5px"}}>
          <TextField label="Type room number" variant="outlined" value={roomNumberToJoin}
                        onChange={event => setRoomNumberToJoin(event.target.value)} />
          </div>
          <Button variant={"contained"} onClick={joinRoom}>Join room</Button>
        </div>
      </Box>
    </React.Fragment>);
};


export default PokerPlanning;