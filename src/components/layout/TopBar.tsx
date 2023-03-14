import React from "react";
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {GetServerSideProps} from "next";

export interface TopBarProps {
    toggleDrawer: () => void;
}

const TopBar: React.FC<TopBarProps> = ({toggleDrawer}) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={toggleDrawer}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    Poker planning application
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

    return {props: {}};
};

export default TopBar;
