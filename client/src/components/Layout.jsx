import React from 'react'
import { NavBar } from '.'
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
        const router = useRouter();
        const { pathname } = router;


        return (
                <div className={"w-full bg-[#F9F9F9] mx-auto max-w-[500px] min-h-[100vh]"}>
                        <header className=''>
                                <NavBar />
                        </header>
                        <main className={"px-4 pt-8 pb-[110px]"}>
                                {children}
                        </main>
                </div>
        )
}

export default Layout