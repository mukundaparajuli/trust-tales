/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media.licdn.com',
                port: '',
                pathname: '/dms/image/**',
            },
        ],
        domains: ['res.cloudinary.com']
    },
};

export default nextConfig;
