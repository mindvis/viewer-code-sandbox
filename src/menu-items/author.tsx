// project-imports
// import applications from './applications';
import authorWidget from './author-widget';
// import formsTables from './forms-tables';
// import chartsMap from './charts-map';
// import support from './support';
// import pages from './pages';


// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //
const authorMenuItems: { items: NavItemType[] } = {
  items: [authorWidget]
  // items: [widget, applications, formsTables, chartsMap, pages, support]
};
export default authorMenuItems;