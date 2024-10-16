// third-party
import { FormattedMessage } from "react-intl";

// assets
import { Story, Fatrows, PresentionChart } from "iconsax-react";

// type
import { NavItemType } from "types/menu";

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart,
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //
const adminWidget: NavItemType = {
  id: "group-widget",
  title: <FormattedMessage id="widgets" />,
  icon: icons.widgets,
  type: "group",
  children: [
    {
      id: "3d-models",
      title: <FormattedMessage id="3d-models" />,
      type: "item",
      url: "/3d-models/list",
      icon: icons.statistics,
      disabled: true,
    },
    // {
    //   id: "users",
    //   title: <FormattedMessage id="users" />,
    //   type: "item",
    //   url: "/users/list",
    //   icon: icons.statistics,
    // },
    // {
    //   id: "profile",
    //   title: <FormattedMessage id="profile" />,
    //   type: "item",
    //   url: "/user/profile",
    //   icon: icons.statistics,
    // },
  ],
};

export default adminWidget;
