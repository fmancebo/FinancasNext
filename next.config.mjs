/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true, // Ativa o suporte para styled-components
  },
  reactStrictMode: true, // Habilita o modo estrito do React
  swcMinify: true, // Ativa o minificador SWC para produção
};

export default nextConfig;
