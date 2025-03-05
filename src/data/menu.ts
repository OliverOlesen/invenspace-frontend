// Define a type for menu items
interface MenuItem {
  name: string;
  to: string;
  icon: string;
}

// Use the MenuItem type for the items in the arrays
export default {
  main: [
    {
      name: "Dashboard",
      to: "backend.dashboard",
      icon: "si si-speedometer",
    },
    {
      name: "User Management",
      to: "backend.user.datatable",
      icon: "si si-user",
    },
    {
      name: "Contacts Management",
      to: "backend.contacts.datatable",
      icon: "si si-notebook",
    },
    {
      name: "Orders Management",
      to: "backend.orders.datatable",
      icon: "si si-wallet",
    },
    {
      name: "Products Management",
      to: "backend.products.datatable",
      icon: "si si-bag",
    },
    {
      name: "Categories Management",
      to: "backend.categories.datatable",
      icon: "si si-book-open",
    },
  ] as MenuItem[],
};
