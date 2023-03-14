import React, {useContext, useEffect, useState} from "react";
import useHttp from "../../../../hooks/http/use-http";
import {useRouter} from "next/router";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import VoteButtons from "../../../../components/poker-planning/vote-buttons";
import NotificationContext from "../../../../store/notification-context";

interface FindRoomResponse {
    roomNumber: Number,
    guests: Guest[],

    cardsAreRevealed: boolean
}

interface Statistics {
    average: number;
    devAverage: number;
    qaAverage: number;
}

interface Room {
    guests: Guest[],
    cardsAreRevealed: boolean,
    statistics: Statistics
}

interface Guest {
    userId: string,
    userType: string,
    points: number
}

const Room: React.FC = (props) => {
    const {addError} = useContext(NotificationContext);


    const [lastVote, setLastVote] = useState(-1);
    const [average, setAverage] = useState(0);
    const [devAverage, setDevAverage] = useState(0);
    const [qaAverage, setQaAverage] = useState(0);
    const [hasJoined, setHasJoined] = useState(false);
    const [nickname, setNickname] = useState("");
    const [userType, setUserType] = useState("DEV");
    const [guests, setGuests] = useState<Guest[]>([]);
    const [cardsAreRevealed, setCardsAreRevealed] = useState<boolean>(false);
    const http = useHttp();
    const router = useRouter();
    const stompClient = useStompClient();

    const {roomNumber} = router.query;

    useSubscription("/topic/room/" + roomNumber + "/join", message => {
        const room: Room = JSON.parse(message.body);
        setCardsAreRevealed(room.cardsAreRevealed);
        setGuests(room.guests);
    });
    useSubscription("/topic/room/" + roomNumber + "/vote", message => {
        setGuests(JSON.parse(message.body));
    });
    useSubscription("/topic/room/" + roomNumber + "/leave", message => {
        setGuests(JSON.parse(message.body));
    });
    useSubscription("/topic/room/" + roomNumber + "/revealCards", message => {
        const room: Room = JSON.parse(message.body);
        setAverage(room.statistics.average);
        setQaAverage(room.statistics.qaAverage);
        setDevAverage(room.statistics.devAverage);
        setCardsAreRevealed(true);

    });
    useSubscription("/topic/room/" + roomNumber + "/hideCards", message => {
        setCardsAreRevealed(false);
        setLastVote(-1);
        setGuests(JSON.parse(message.body));
    });

    const joinRoom = () => {
        http.sendRequest<Room>(
            {
                url: "http://localhost:8080/rooms/" + roomNumber + "/guests",
                method: "GET",
                headers: {"Content-Type": "application/json"}
            },
            (room: Room) => {
                if (room.guests.filter(guest => guest.userId === nickname).length > 0) {
                    addError({message: "User with given nickname already joined room"});
                    return;
                } else {
                    if (stompClient) {
                        stompClient.publish({
                            destination: "/app/room/" + roomNumber + "/join",
                            body: JSON.stringify({userId: nickname, userType})
                        });
                        sessionStorage.setItem("userId", nickname);
                        setHasJoined(true);
                    } else {
                    }
                }
            }
        );
    };

    const leaveRoom = (thisUserId: string) => {
        if (stompClient) {
            stompClient.publish({
                destination: "/app/room/" + roomNumber + "/leave",
                body: JSON.stringify({userId: thisUserId})
            });
        } else {
        }
    };
    const vote = (points: number) => {
        if (stompClient) {
            stompClient.publish({
                destination: "/app/room/" + roomNumber + "/vote",
                body: JSON.stringify({
                    userId: nickname,
                    points
                })
            });
            setLastVote(points);
        } else {
        }
    };

    const revealCards = () => {
        if (stompClient) {
            stompClient.publish({
                destination: "/app/room/" + roomNumber + "/revealCards",
                body: JSON.stringify({userId: nickname})
            });
        } else {
        }
    };

    const hideCards = () => {
        if (stompClient) {
            stompClient.publish({
                destination: "/app/room/" + roomNumber + "/hideCards",
                body: JSON.stringify({userId: nickname})
            });
        } else {
        }
    };

    const submitNickname = (event: React.KeyboardEvent<HTMLDivElement>) => {
        debugger;
        if (event.key === "Enter") {
            event.preventDefault();
            joinRoom();
        }
    };

    useEffect(() => {
        if (router.isReady) {
            http.sendRequest<FindRoomResponse>(
                {
                    url: "http://localhost:8080/rooms/" + roomNumber,
                    method: "GET",
                    headers: {"Content-Type": "application/json"}
                },
                (room) => {
                    const userId = sessionStorage.getItem("userId");
                    setCardsAreRevealed(room.cardsAreRevealed);
                    if (room.guests.filter(value => value.userId === userId).length > 0) {
                        setNickname(userId);
                        setHasJoined(true);
                        setGuests(room.guests);
                    }
                }
            );
        }
    }, [router.isReady]);
    if (!router.isReady) {
        return (<div><CircularProgress/></div>);
    }
    return (
        <React.Fragment>
            {http.isLoading && <div><CircularProgress/></div>}
            {http.error && <div>Error occurred</div>}
            {!http.isLoading && !http.error && !hasJoined &&
                <Box
                    component="form"
                    noValidate
                    autoComplete="off">
                    <div style={{textAlign: "center"}}>
                        <div style={{display: "block", margin: "5px"}}>
                            <TextField label="Nickname" value={nickname} onKeyPress={submitNickname}
                                       onChange={event => setNickname(event.target.value)}/>
                        </div>
                        <Button variant={"contained"} onClick={joinRoom}>JOIN</Button>
                        <Select
                            id="user-type-select"
                            value={userType}
                            label="Age"
                            onChange={event => {
                                console.log(event.target.value);
                                setUserType(event.target.value)
                            }}
                        >
                            <MenuItem value={"DEV"}>DEV</MenuItem>
                            <MenuItem value={"QA"}>QA</MenuItem>
                        </Select>
                    </div>
                </Box>
            }
            {!http.isLoading && !http.error && hasJoined &&
                <div>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off">
                        <div style={{textAlign: "center", fontSize: "2rem"}}>Nickname: {nickname}</div>
                        <div style={{textAlign: "center"}}>
                            {!cardsAreRevealed &&
                                <Button variant={"contained"} onClick={revealCards}>Reveal cards</Button>}
                            {cardsAreRevealed &&
                                <Button variant={"contained"} onClick={hideCards}>Hide cards</Button>}
                            <VoteButtons voteAction={vote} possiblePointsToVote={[1, 2, 3, 5, 8, 13, 21, 40]}
                                         selectedValue={lastVote}/>
                        </div>
                        <div style={{
                            textAlign: "center",
                            fontSize: "2rem"
                        }}>Avarage: {cardsAreRevealed ? average : "Hidden"}</div>
                        <div style={{textAlign: "center", fontSize: "2rem"}}>Dev
                            Avarage: {cardsAreRevealed ? devAverage : "Hidden"}</div>
                        <div style={{textAlign: "center", fontSize: "2rem"}}>Qa
                            Avarage: {cardsAreRevealed ? qaAverage : "Hidden"}
                        </div>
                        <div>
                            {guests.map((value, index) =>
                                <Card key={index} sx={{display: "inline-block", margin: "5px"}}>
                                    <CardContent>
                                        <Typography sx={{fontSize: 14}} color="text.secondary">
                                            {value.userId + " " + value.userType}
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            {cardsAreRevealed ? value.points : value.points ? "Voted" :
                                                <CircularProgress/>}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => leaveRoom(value.userId)}>Remove</Button>
                                    </CardActions>
                                </Card>
                            )}
                        </div>
                    </Box>
                </div>
            }
        </React.Fragment>
    );
};

export default Room;