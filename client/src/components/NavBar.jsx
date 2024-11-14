import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import { BsFillCreditCardFill } from 'react-icons/bs';
import { GoHomeFill } from 'react-icons/go';
import { HiUserCircle } from "react-icons/hi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaPowerOff } from "react-icons/fa6";

const NavBar = () => {
        const router = useRouter();
        const { pathname } = router;
        const { status, data: session } = useSession();

        const handleSignOut = () => {
                // const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
                // signOut({ callbackUrl: `${baseUrl}/signin` });
                router.push("/signin")
        }


        // Define specific pages where you want to show something else
        const isNavController = ["/signin", "/signup", "/check-email", "/email-verification"].includes(pathname);


        return (

                isNavController ?
                        <div className='px-4 pt-8'>
                                <Link href={"/home"}>
                                        <Image src={"data:image/png;base64,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"} alt='Social logo' width={52} height={52} />
                                </Link>
                        </div>
                        :
                        <>
                                <div className="flex justify-between items-center gap-14 px-4 pt-8">
                                        <div className="app__flex gap-12.5">
                                                <Image className='rounded-full mr-2' src={"/next.svg"} alt='user avater' width={32} height={32} />
                                                <p className="app__flex text-[#1D1D1D] font-medium text-lg"><span className="text-[#1D1D1D99] font-light mr-1 capitalize">Hi, </span>{session?.user?.name.split(" ")[0]}</p>
                                        </div>

                                        <div className="app__flex rounded-full bg-[#F1F1F1] h-[36px] min-h-[36px] w-[36px] min-w-[36px] transition  hover:bg-[#d3d3d3] cursor-pointer" onClick={() => handleSignOut()}>
                                                <FaPowerOff />
                                        </div>
                                </div>

                        </>
        )
}

export default NavBar