// project-imports
// import applications from './applications';
import adminWidget from './admin-widget';
// import formsTables from './forms-tables';
// import chartsMap from './charts-map';
// import support from './support';
// import pages from './pages';


// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //
const adminMenuItems: { items: NavItemType[] } = {
  items: [adminWidget]
  // items: [widget, applications, formsTables, chartsMap, pages, support]
};
export default adminMenuItems;