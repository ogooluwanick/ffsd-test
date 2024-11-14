import { BASE_URL } from "@/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoXCircleFill } from "react-icons/go";
import { LuCheckCircle2 } from "react-icons/lu";

export default function EmailVerification() {
        const [verificationStatus, setVerificationStatus] = useState("verifying");
        const [isResending, setIsResending] = useState(false);
        const [resendCount, setResendCount] = useState(0);

        const router = useRouter();
        const { token } = router.query


        const handleResendVerification = async () => {
                if (resendCount >= 3) {
                        toast.error("Maximum resend attempts reached. Please try signing up again.");
                        return;
                }

                if (!token) {
                        toast.error("Verification token not found. Please try signing up again.");
                        return;
                }

                setIsResending(true);
                const loadingToast = toast.loading("Resending verification email...");

                try {
                        const response = await fetch(`${BASE_URL}/users/resend-verification-token`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ token }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                                throw new Error(data?.message || 'Failed to resend verification email');
                        }

                        setResendCount(prev => prev + 1);
                        toast.success("Verification email resent successfully!", { id: loadingToast });
                } catch (error) {
                        toast.error(error.message, { id: loadingToast });
                } finally {
                        setIsResending(false);
                }
        };


        useEffect(() => {
                const verifyEmail = async () => {
                        try {
                                const response = await fetch(`${BASE_URL}/users/verify-email/${token}`);
                                const data = await response.json();

                                if (response.ok) {
                                        setVerificationStatus("success");
                                        toast.success("Email verified successfully!");
                                        setTimeout(() => {
                                                router.push("/signin");
                                        }, 3000);
                                } else {
                                        setVerificationStatus("error");
                                        toast.error(data.message || "Verification failed");
                                }
                        } catch (error) {
                                setVerificationStatus("error");
                                toast.error("Something went wrong during verification");
                        }
                };

                verifyEmail();
        }, [router, token]);

        return (
                <div className="w-full max-w-md mx-auto p-6 text-center">
                        <div className="space-y-6">
                                {verificationStatus === "verifying" && (
                                        <div>
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                                <h2 className="text-xl font-semibold mt-4">Verifying your email...</h2>
                                        </div>
                                )}

                                {verificationStatus === "success" && (
                                        <div>
                                                <div className="w-12 h-12 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                                                        <LuCheckCircle2 className="h-6 w-6 text-green-600" />
                                                </div>
                                                <h2 className="text-xl font-semibold mt-4">Email Verified!</h2>
                                                <p className="text-gray-600 mt-2">
                                                        Your email has been verified successfully. Redirecting to login...
                                                </p>
                                        </div>
                                )}

                                {verificationStatus === "error" && (
                                        <div>
                                                <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center">
                                                        <GoXCircleFill className="h-6 w-6 text-red-600" />
                                                </div>
                                                <h2 className="text-xl font-semibold mt-4">Verification Failed</h2>
                                                <p className="text-gray-600 mt-2">
                                                        Unable to verify your email. The link may have expired or is invalid.
                                                </p>
                                                <button
                                                        onClick={() => router.push("/signup")}
                                                        className="text-blue-600 hover:text-blue-700 mt-2"
                                                >
                                                        Back to Sign Up
                                                </button>


                                                {
                                                        token &&
                                                        <div className="mt-8">
                                                                <p className="text-sm text-gray-500">
                                                                        Didn&apos;t receive the email? Check your spam folder or
                                                                </p>
                                                                <button
                                                                        onClick={() => handleResendVerification()}
                                                                        className="text-blue-600 hover:text-blue-700 mt-2"
                                                                >
                                                                        Click here to resend
                                                                </button>
                                                        </div>
                                                }
                                        </div>
                                )}
                        </div>
                </div>
        );
};