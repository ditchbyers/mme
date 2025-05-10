import { NavigationConfig } from "@/types"

export const navigationConfig: NavigationConfig = {
  mainNav: [
    { title: "Login", href: "/login" },
    { title: "Register", href: "/register" },
    { title: "Profile", href: "/profile" },
  ],
  footerNav: [
    { title: "Impressum", href: "/impressum" },
    { title: "Jugendschutz", href: "/jugendschutz" },
    { title: "FAQ", href: "/faq" },
    { title: "Datenschutz", href: "/datenschutz" },
  ],
}
