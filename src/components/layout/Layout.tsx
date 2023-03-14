import React, {useState} from "react";
import {Box} from "@mui/material";
import classes from "./Layout.module.css";
import TopBar from "./TopBar";
import LeftBar from "./LeftBar";
import {GetServerSideProps} from "next";
import Notifications from "../notifications";

const Layout: React.FC = (props) => {
    const [drawerOpened, setDrawerOpened] = useState(false);

    function toggleDrawer() {
        setDrawerOpened(!drawerOpened);
    }

    return (
        <div>
            <Box sx={{flexGrow: 1}}>
                <TopBar toggleDrawer={toggleDrawer}/>
            </Box>
            <LeftBar toggleDrawer={toggleDrawer} drawerOpened={drawerOpened}/>
            <Notifications/>
            <main className={classes.main}>{props.children}</main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {props: {}};
};

export default Layout;
