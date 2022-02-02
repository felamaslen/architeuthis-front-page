/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_TITLE: process.env.NEXT_PUBLIC_TITLE,
        NEXT_SERVER_HOSTNAME: process.env.NEXT_SERVER_HOSTNAME,
        NEXT_INSTALLATION_TIME: process.env.NEXT_INSTALLATION_TIME,
    },
};
