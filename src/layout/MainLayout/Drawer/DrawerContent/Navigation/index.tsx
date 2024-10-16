import { useEffect, useLayoutEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Typography, useMediaQuery } from "@mui/material";

// project-imports
import NavGroup from "./NavGroup";
import menuItem from "menu-items";
import adminMenuItems from "menu-items/admin";
import authorMenuItems from "menu-items/author";
import { Menu } from "menu-items/dashboard";
// import useAuth from "hooks/useAuth";

import { useSelector } from "store";
import useConfig from "hooks/useConfig";
import { HORIZONTAL_MAX_ITEM } from "config";

// types
import { NavItemType } from "types/menu";
import { MenuOrientation } from "types/config";
import { useUser } from "../../../../../pages/user//UserContext";

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();
  const { userData } = useUser();

  const downLG = useMediaQuery(theme.breakpoints.down("lg"));

  const { menuOrientation } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);

  const [selectedItems, setSelectedItems] = useState<string | undefined>("");
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<{ items: NavItemType[] }>({
    items: [],
  });

  useEffect(() => {
    handlerMenuItem();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Function to update menu items based on user role
    const updateMenuItemsBasedOnRole = () => {
      console.log(userData, "xxxxxxxxxxxxxx");
      if (userData && userData.role) {
        // Assume we have different menu items for different roles
        let roleBasedMenuItems = menuItems; // Default menu items

        if (userData.role === "Admin") {
          roleBasedMenuItems = adminMenuItems; // Define admin menu items
        } else if (userData.role === "Author") {
          roleBasedMenuItems = authorMenuItems; // Define userData menu items
        }

        setMenuItems(roleBasedMenuItems);
      }
    };

    updateMenuItemsBasedOnRole();
  }, [userData]);

  useLayoutEffect(() => {
    setMenuItems(menuItem);
    // eslint-disable-next-line
  }, [menuItem]);

  let getMenu = Menu();
  const handlerMenuItem = () => {
    const isFound = menuItem.items.some((element) => {
      if (element.id === "group-dashboard") {
        return true;
      }
      return false;
    });

    if (getMenu?.id !== undefined && !isFound) {
      menuItem.items.splice(0, 0, getMenu);
      setMenuItems(menuItem);
    }
  };

  const isHorizontal =
    menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems: NavItemType[] = [];
  let lastItemId: string;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id!;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items
      .slice(lastItem - 1, menuItems.items.length)
      .map((item) => ({
        title: item.title,
        elements: item.children,
        icon: item.icon,
      }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case "group":
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem!}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        "& > ul:first-of-type": { mt: 0 },
        display: isHorizontal ? { xs: "block", lg: "flex" } : "block",
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
