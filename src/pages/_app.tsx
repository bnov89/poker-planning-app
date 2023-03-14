import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import { StompSessionProvider } from "react-stomp-hooks";
import { NotificationProvider } from "../store/notification-context";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <NotificationProvider>
        <StompSessionProvider url={"ws://localhost:8080/hello"} onConnect={() => console.log("Connected...")}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StompSessionProvider>
      </NotificationProvider>
  );
}
