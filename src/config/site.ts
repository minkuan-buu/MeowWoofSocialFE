export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Trang chủ",
      href: "/#",
    },
    {
      label: "Dịch vụ",
      href: "/#our-services",
    },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
    // {
    //   label: "Blog",
    //   href: "/blog",
    // },
    // {
    //   label: "About",
    //   href: "/about",
    // },
  ],
  navTokenItems: [
    {
      label: "Trang chủ",
      href: "/#",
    },
    {
      label: "Dịch vụ",
      href: "/services",
    },
    {
      label: "Cửa hàng",
      href: "/stores",
    },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
    // {
    //   label: "Blog",
    //   href: "/blog",
    // },
    // {
    //   label: "About",
    //   href: "/about",
    // },
  ],
  navMenuItems: [
    // {
    //   label: "Profile",
    //   href: "/profile",
    // },
    // {
    //   label: "Dashboard",
    //   href: "/dashboard",
    // },
    // {
    //   label: "Projects",
    //   href: "/projects",
    // },
    // {
    //   label: "Team",
    //   href: "/team",
    // },
    // {
    //   label: "Calendar",
    //   href: "/calendar",
    // },
    // {
    //   label: "Settings",
    //   href: "/settings",
    // },
    // {
    //   label: "Help & Feedback",
    //   href: "/help-feedback",
    // },
    // {
    //   label: "Logout",
    //   href: "/logout",
    // },
  ],
  links: {
    // github: "https://github.com/nextui-org/nextui",
    // twitter: "https://twitter.com/getnextui",
    // docs: "https://nextui-docs-v2.vercel.app",
    // discord: "https://discord.gg/9b6yyZKmH4",
    // sponsor: "https://patreon.com/jrgarciadev",
    facebook:"https://www.facebook.com/profile.php?id=61566172440597",
    tiktok:"https://www.tiktok.com/@meowwoof.social?_t=8qAtk9EgNHT&_r=1"
  },
};

export const ourServices = [
  {
    id: 1,
    iconPath: "/pet-health-logo.svg",
    name: "Chăm sóc sức khỏe chuyên nghiệp",
    description: "Hợp tác với những phòng khám, spa uy tín và chất lượng cao.",
  },
  {
    id: 2,
    iconPath: "/pet-hotel.svg",
    name: "Lưu trú sang trọng và an toàn",
    description: "Đặt phòng khách sạn dễ dàng qua nền tảng trực tuyến tiện lợi.",
  },
  {
    id: 3,
    iconPath: "/pet-shop.svg",
    name: "Mua sắm tiện lợi",
    description: "Đa dạng sản phẩm từ các nhà cung cấp uy tín.",
  },
];
