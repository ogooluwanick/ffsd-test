import "@/styles/globals.scss";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { LoadingBox, Layout } from "@/components";
import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "@/context/GlobalContext";


export default function App({ Component, pageProps }) {
        const router = useRouter();
        return (
                <GlobalProvider>
                        <SessionProvider session={pageProps.session}>
                                <Layout>
                                        <Toaster />
                                        {Component.auth ? (
                                                <Auth adminOnly={Component.auth.adminOnly}>
                                                        <Component {...pageProps} key={router.asPath} />
                                                </Auth>
                                        ) : (
                                                <Component {...pageProps} key={router.asPath} />
                                        )}
                                </Layout>
                        </SessionProvider >
                </GlobalProvider>
        )
}

function Auth({ children, adminOnly }) {
        const router = useRouter();
        const { status, data: session } = useSession({
                required: true,
                onUnauthenticated() {
                        router.push(
                                "/unauthorized?message=The page you're trying to access has restricted access. Please login first!"
                        );
                },
        });
        if (status === "loading") {
                return <LoadingBox block color={"white"} text="" size={35} />;
        }
        if (adminOnly && !session.user.isStaff && !session.user.isAdmin) {
                router.push(
                        "/unauthorized?message=The page you're trying to access has restricted access. Please admins only!"
                );
        }

        return children;
}