import { useRouter } from "next/router";
import { IoMailUnreadOutline } from "react-icons/io5";

export default function CheckEmail() {
        const router = useRouter();

        return (
                <div className="w-full max-w-md mx-auto p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center">
                                <IoMailUnreadOutline className="h-8 w-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold mt-6">Check your email</h2>
                        <p className="text-gray-600 mt-2">
                                We&apos;ve sent you a verification link to your email address. Please click the
                                link to verify your account.
                        </p>
                        <div className="mt-8">
                                <p className="text-sm text-gray-500">
                                        Didn&apos;t receive the email? Check your spam folder or
                                </p>
                                <button
                                        onClick={() => router.push("/email-verification")}
                                        className="text-blue-600 hover:text-blue-700 mt-2"
                                >
                                        Click here to resend
                                </button>
                        </div>
                </div>
        );
};
