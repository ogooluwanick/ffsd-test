import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { BASE_URL } from "@/utils";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function SignInForm() {
        const [showPassword, setShowPassword] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const router = useRouter();

        const {
                register,
                handleSubmit,
                formState: { errors },
        } = useForm({
                defaultValues: {
                        email: "",
                        password: "",
                },
        });


        const onSubmit = async (data) => {
                setIsSubmitting(true);
                const loadingToast = toast.loading("Signing in...");

                try {
                        const result = await signIn("credentials", {
                                email: data.email,
                                password: data.password,
                                redirect: false,
                        });

                        if (result.error) {
                                throw new Error(result.error);
                        }

                        toast.success("Signed in successfully!", { id: loadingToast });
                        router.push("/dashboard");
                } catch (error) {
                        toast.error(error.message, { id: loadingToast });
                } finally {
                        setIsSubmitting(false);
                }
        };


        // const onSubmit = async (data) => {
        //         setIsSubmitting(true);
        //         const loadingToast = toast.loading("Signing in...");

        //         try {
        //                 const response = await fetch(`${BASE_URL}/users/signin`, {
        //                         method: "POST",
        //                         headers: {
        //                                 "Content-Type": "application/json",
        //                         },
        //                         body: JSON.stringify(data),
        //                 });

        //                 const result = await response.json();

        //                 if (!response.ok) {
        //                         throw new Error(result?.message || "Invalid credentials");
        //                 }

        //                 // Store the token
        //                 localStorage.setItem("token", result.token);

        //                 toast.success("Signed in successfully!", { id: loadingToast });
        //                 router.push("/dashboard"); // Redirect to dashboard
        //         } catch (error) {
        //                 toast.error(error.message, { id: loadingToast });
        //         } finally {
        //                 setIsSubmitting(false);
        //         }
        // };

        return (
                <div className="w-full max-w-md mx-auto p-6 space-y-8">
                        <div className="text-center">
                                <h1 className="text-2xl font-bold">Welcome Back</h1>
                                <p className="text-gray-600 mt-2">Sign in to your account</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                        <input
                                                type="email"
                                                placeholder="Email"
                                                className={`w-full p-2 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                {...register("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: "Invalid email address",
                                                        },
                                                })}
                                        />
                                        {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                        )}
                                </div>

                                <div className="relative">
                                        <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                className={`w-full p-2 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                {...register("password", {
                                                        required: "Password is required",
                                                })}
                                        />
                                        <button
                                                type="button"
                                                className="absolute right-3 top-2.5 text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                        >
                                                {showPassword ? (
                                                        <VscEyeClosed className="h-5 w-5" />
                                                ) : (
                                                        <VscEye className="h-5 w-5" />
                                                )}
                                        </button>
                                        {errors.password && (
                                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                        )}
                                </div>

                                <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-200 text-center block"
                                >
                                        {isSubmitting ? "Signing in..." : "Sign In"}
                                </button>
                        </form>
                </div>
        );
};

