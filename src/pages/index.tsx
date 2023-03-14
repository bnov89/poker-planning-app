import React from "react";
import { GetServerSideProps } from "next";

const HomePage: React.FC = () => {
  return <React.Fragment>
    This is home page
  </React.Fragment>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: {} };
};

export default HomePage;