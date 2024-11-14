import { toast } from "react-hot-toast";
import { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useForm } from "react-hook-form";
import { BASE_URL } from "@/utils";
import { useRouter } from "next/router";


export default function SignUpForm() {
        const router = useRouter();

        const [showPassword, setShowPassword] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const {
                register,
                handleSubmit,
                formState: { errors },
                watch,
        } = useForm({
                defaultValues: {
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                },
        });

        const onSubmit = async (data) => {
                setIsSubmitting(true);
                const loadingToast = toast.loading("Creating your account...");

                try {
                        const response = await fetch(`${BASE_URL}/users/signup`, {
                                method: "POST",
                                headers: {
                                        "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                        firstName: data.firstName,
                                        lastName: data.lastName,
                                        email: data.email,
                                        password: data.password,
                                }),
                        });

                        
                        const result = await response.json();
                        
                        if (!response.ok) {
                                throw new Error(result?.message || "Something went wrong");
                        }
                        
                        console.log("response",response)
                        
                        toast.success(
                                response?.data?.message||"Account created! Please check your email for verification.",
                                { id: loadingToast }
                        );
                        router.push("/check-email");
                } catch (error) {
                        toast.error(error.message, { id: loadingToast });
                } finally {
                        setIsSubmitting(false);
                }
        };

        return (
                <div className="w-full max-w-md mx-auto p-6 space-y-8">
                        <div className="text-center">
                                <h1 className="text-2xl font-bold">Create an Account</h1>
                                <p className="text-gray-600 mt-2">Sign up to get started</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                        <div>
                                                <input
                                                        type="text"
                                                        placeholder="First Name"
                                                        className={`w-full p-2 border rounded-lg ${errors.firstName ? "border-red-500" : "border-gray-300"
                                                                }`}
                                                        {...register("firstName", {
                                                                required: "First name is required",
                                                                minLength: {
                                                                        value: 2,
                                                                        message: "First name must be at least 2 characters",
                                                                },
                                                        })}
                                                />
                                                {errors.firstName && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                                {errors.firstName.message}
                                                        </p>
                                                )}
                                        </div>

                                        <div>
                                                <input
                                                        type="text"
                                                        placeholder="Last Name"
                                                        className={`w-full p-2 border rounded-lg ${errors.lastName ? "border-red-500" : "border-gray-300"
                                                                }`}
                                                        {...register("lastName", {
                                                                required: "Last name is required",
                                                                minLength: {
                                                                        value: 2,
                                                                        message: "Last name must be at least 2 characters",
                                                                },
                                                        })}
                                                />
                                                {errors.lastName && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                                {errors.lastName.message}
                                                        </p>
                                                )}
                                        </div>
                                </div>

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
                                                        minLength: {
                                                                value: 8,
                                                                message: "Password must be at least 8 characters",
                                                        },
                                                        pattern: {
                                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                                                message:
                                                                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                                                        },
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

                                <div className="relative">
                                        <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirm Password"
                                                className={`w-full p-2 border rounded-lg ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                {...register("confirmPassword", {
                                                        required: "Please confirm your password",
                                                        validate: (value) =>
                                                                value === watch("password") || "Passwords do not match",
                                                })}
                                        />
                                        {errors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">
                                                        {errors.confirmPassword.message}
                                                </p>
                                        )}
                                </div>

                                <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-200 text-center"
                                >
                                        {isSubmitting ? "Creating Account..." : "Sign Up"}
                                </button>
                        </form>
                </div>
        );
};
