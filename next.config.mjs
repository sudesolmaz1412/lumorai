/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint ayarını buradan kaldırdık çünkü Next.js bunu artık 'next.config' üzerinden değil,
  // terminal komutuyla veya ayrı bir config dosyasıyla yönetmeni istiyor.
};

export default nextConfig;