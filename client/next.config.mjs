/** @type {import('next').NextConfig} */
const nextConfig = {
        reactStrictMode: true,
        swcMinify: true,
        serverRuntimeConfig: {
                maxPayloadSize: 10 * 1024 * 1024,  // Increase the maximum body size to 10 MB (default is 1 MB)
        },
        images: {
                domains: ['res.cloudinary.com', 'images.unsplash.com', "i.pinimg.com", "cdn.sanity.io","media.istockphoto.com"],
        },
}

export default nextConfig;
