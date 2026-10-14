import type {
  IconName,
} from "@/components/ui/icon";

export interface NavigationItem {
  label: string;
  href: string;
  icon?: IconName;
}

export const mainNavigation:
  NavigationItem[] = [
    {
      label:
        "Mapy",

      href:
        "/mapy",

      icon:
        "map-pin",
    },

    {
      label:
        "Narzędzia",

      href:
        "/narzedzia",

      icon:
        "calculator",
    },

    {
      label:
        "Społeczność",

      href:
        "/spolecznosc",

      icon:
        "users",
    },

    {
      label:
        "Rozrywka",

      href:
        "/rozrywka",

      icon:
        "smile",
    },
  ];

export const mobileNavigation:
  NavigationItem[] = [
    {
      label:
        "Start",

      href:
        "/",

      icon:
        "home",
    },

    {
      label:
        "Mapy",

      href:
        "/mapy",

      icon:
        "map-pin",
    },

    {
      label:
        "Narzędzia",

      href:
        "/narzedzia",

      icon:
        "calculator",
    },

    {
      label:
        "Ludzie",

      href:
        "/spolecznosc",

      icon:
        "users",
    },
  ];

export const footerNavigation = [
  {
    title:
      "Januszownia",

    links: [
      {
        label:
          "Strona główna",

        href:
          "/",
      },

      {
        label:
          "O projekcie",

        href:
          "/o-projekcie",
      },
    ],
  },

  {
    title:
      "Portal",

    links: [
      {
        label:
          "Mapy",

        href:
          "/mapy",
      },

      {
        label:
          "Narzędzia",

        href:
          "/narzedzia",
      },

      {
        label:
          "Społeczność",

        href:
          "/spolecznosc",
      },

      {
        label:
          "Rozrywka",

        href:
          "/rozrywka",
      },
    ],
  },
] as const;
