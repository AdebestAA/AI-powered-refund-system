export type SeedItem = {
  sku: string;
  name: string;
  category: string;
  price: number;
  qty?: number;
  finalSale?: boolean;
};

export type SeedOrder = {
  number: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  placedDaysAgo: number;
  deliveredDaysAgo?: number;
  items: SeedItem[];
};

export type SeedPastRefund = {
  orderNumber: string;
  category: "damaged" | "wrong_item" | "changed_mind";
  status: "approved" | "denied" | "escalated";
  daysAgo: number;
  message: string;
};

export type SeedCustomer = {
  name: string;
  email: string;
  phone: string;
  customerSinceDaysAgo: number;
  flagged?: string;
  scenario: string;
  orders: SeedOrder[];
  pastRefunds?: SeedPastRefund[];
};

export const DEMO_PASSWORD = "Password123!";
export const ADMIN = { name: "Support Admin", email: "admin@resolve.dev", password: "Admin123!" };

export const customers: SeedCustomer[] = [
  {
    name: "Ada Okafor",
    email: "ada@resolve.dev",
    phone: "+1 415 555 0101",
    customerSinceDaysAgo: 820,
    scenario: "Test account: one order for every scenario (see README)",
    orders: [
      {
        number: "ORD-10001",
        status: "delivered",
        placedDaysAgo: 9,
        deliveredDaysAgo: 5,
        items: [
          { sku: "AUD-220", name: "Aurora Wireless Headphones", category: "Electronics", price: 129.0 },
          { sku: "ACC-014", name: "Braided USB-C Cable", category: "Accessories", price: 14.5 },
        ],
      },
      {
        number: "ORD-20002",
        status: "delivered",
        placedDaysAgo: 7,
        deliveredDaysAgo: 3,
        items: [{ sku: "SHO-118", name: "Canvas Sneakers (US 8)", category: "Footwear", price: 65.0 }],
      },
      {
        number: "ORD-20003",
        status: "delivered",
        placedDaysAgo: 6,
        deliveredDaysAgo: 2,
        items: [{ sku: "HOM-040", name: "Scented Candle Set", category: "Home", price: 32.0 }],
      },
      {
        number: "ORD-20004",
        status: "delivered",
        placedDaysAgo: 10,
        deliveredDaysAgo: 6,
        items: [
          { sku: "APP-330", name: "Wool Beanie", category: "Apparel", price: 48.0 },
          { sku: "APP-990", name: "Clearance Gloves", category: "Apparel", price: 18.0, finalSale: true },
        ],
      },
      {
        number: "ORD-20005",
        status: "delivered",
        placedDaysAgo: 12,
        deliveredDaysAgo: 8,
        items: [{ sku: "APP-901", name: "Clearance Rain Jacket", category: "Apparel", price: 55.0, finalSale: true }],
      },
      {
        number: "ORD-20006",
        status: "delivered",
        placedDaysAgo: 65,
        deliveredDaysAgo: 60,
        items: [{ sku: "KIT-222", name: "French Press", category: "Kitchen", price: 39.0 }],
      },
      {
        number: "ORD-20007",
        status: "cancelled",
        placedDaysAgo: 4,
        items: [{ sku: "FUR-410", name: "Bookshelf", category: "Furniture", price: 120.0 }],
      },
      {
        number: "ORD-20008",
        status: "shipped",
        placedDaysAgo: 3,
        items: [{ sku: "ELE-510", name: "Portable Charger", category: "Electronics", price: 45.0 }],
      },
      {
        number: "ORD-20009",
        status: "delivered",
        placedDaysAgo: 8,
        deliveredDaysAgo: 4,
        items: [{ sku: "CMP-900", name: "Studio Monitor 27\"", category: "Electronics", price: 689.0 }],
      },
      {
        number: "ORD-20010",
        status: "delivered",
        placedDaysAgo: 9,
        deliveredDaysAgo: 5,
        items: [{ sku: "BK-210", name: "Recipe Book", category: "Books", price: 28.0 }],
      },
      {
        number: "ORD-20011",
        status: "delivered",
        placedDaysAgo: 14,
        deliveredDaysAgo: 10,
        items: [{ sku: "TOY-050", name: "Puzzle 1000pc", category: "Toys", price: 24.0 }],
      },
      {
        number: "ORD-20012",
        status: "delivered",
        placedDaysAgo: 5,
        deliveredDaysAgo: 2,
        items: [{ sku: "ACC-777", name: "Leather Wallet", category: "Accessories", price: 59.0 }],
      },
    ],
    pastRefunds: [
      { orderNumber: "ORD-20011", category: "damaged", status: "approved", daysAgo: 7, message: "Several puzzle pieces were missing." },
    ],
  },
  {
    name: "Grace Mensah",
    email: "grace@resolve.dev",
    phone: "+1 415 555 0102",
    customerSinceDaysAgo: 210,
    scenario: "Final-sale clearance jacket → Denied",
    orders: [
      {
        number: "ORD-10002",
        status: "delivered",
        placedDaysAgo: 14,
        deliveredDaysAgo: 10,
        items: [{ sku: "APP-901", name: "Clearance Down Jacket", category: "Apparel", price: 79.99, finalSale: true }],
      },
    ],
  },
  {
    name: "Alan Whitfield",
    email: "alan@resolve.dev",
    phone: "+1 415 555 0103",
    customerSinceDaysAgo: 1500,
    scenario: "$1,299 laptop → Escalated (over $500)",
    orders: [
      {
        number: "ORD-10003",
        status: "delivered",
        placedDaysAgo: 11,
        deliveredDaysAgo: 7,
        items: [{ sku: "CMP-1300", name: "Nimbus 14\" Laptop", category: "Electronics", price: 1299.0 }],
      },
    ],
  },
  {
    name: "Katherine Diallo",
    email: "katherine@resolve.dev",
    phone: "+1 415 555 0104",
    customerSinceDaysAgo: 400,
    scenario: "Delivered 75 days ago → Denied (outside 30-day window)",
    orders: [
      {
        number: "ORD-10004",
        status: "delivered",
        placedDaysAgo: 80,
        deliveredDaysAgo: 75,
        items: [{ sku: "HOM-330", name: "Ceramic Pour-Over Set", category: "Home", price: 54.0 }],
      },
    ],
  },
  {
    name: "Linus Berg",
    email: "linus@resolve.dev",
    phone: "+1 415 555 0105",
    customerSinceDaysAgo: 95,
    scenario: "Received wrong size sneakers → Approved",
    orders: [
      {
        number: "ORD-10005",
        status: "delivered",
        placedDaysAgo: 6,
        deliveredDaysAgo: 3,
        items: [{ sku: "SHO-442", name: "Trail Runner Sneakers (US 10)", category: "Footwear", price: 89.0 }],
      },
    ],
  },
  {
    name: "Margaret Osei",
    email: "margaret@resolve.dev",
    phone: "+1 415 555 0106",
    customerSinceDaysAgo: 60,
    flagged: "Chargeback dispute opened on a previous order",
    scenario: "Account on fraud watch → Escalated",
    orders: [
      {
        number: "ORD-10006",
        status: "delivered",
        placedDaysAgo: 8,
        deliveredDaysAgo: 4,
        items: [{ sku: "BEA-120", name: "Vitamin C Serum Duo", category: "Beauty", price: 64.0 }],
      },
    ],
  },
  {
    name: "Tim Adeyemi",
    email: "tim@resolve.dev",
    phone: "+1 415 555 0107",
    customerSinceDaysAgo: 700,
    scenario: "Order still on its way → told where it is (Denied: not delivered yet)",
    orders: [
      {
        number: "ORD-10007",
        status: "shipped",
        placedDaysAgo: 4,
        items: [{ sku: "KIT-560", name: "Cast Iron Skillet 12\"", category: "Kitchen", price: 48.0 }],
      },
    ],
  },
  {
    name: "Barbara Lindqvist",
    email: "barbara@resolve.dev",
    phone: "+1 415 555 0108",
    customerSinceDaysAgo: 950,
    scenario: "Mixed order: one final-sale item + one regular → partial Approval",
    orders: [
      {
        number: "ORD-10008",
        status: "delivered",
        placedDaysAgo: 12,
        deliveredDaysAgo: 8,
        items: [
          { sku: "APP-210", name: "Linen Button-Down Shirt", category: "Apparel", price: 58.0 },
          { sku: "APP-777", name: "Sample Sale Scarf", category: "Apparel", price: 22.0, finalSale: true },
        ],
      },
    ],
  },
  {
    name: "Dennis Kariuki",
    email: "dennis@resolve.dev",
    phone: "+1 415 555 0109",
    customerSinceDaysAgo: 150,
    scenario: "Order shows delivered but 'never arrived' → Escalated (carrier check). Has one past refund.",
    orders: [
      {
        number: "ORD-10009",
        status: "delivered",
        placedDaysAgo: 7,
        deliveredDaysAgo: 4,
        items: [{ sku: "ELE-808", name: "Smart Desk Lamp", category: "Electronics", price: 39.0 }],
      },
      {
        number: "ORD-09901",
        status: "delivered",
        placedDaysAgo: 70,
        deliveredDaysAgo: 66,
        items: [
          { sku: "ACC-301", name: "Phone Case", category: "Accessories", price: 19.0 },
          { sku: "ACC-302", name: "Screen Protector", category: "Accessories", price: 12.0 },
          { sku: "ACC-303", name: "Wireless Charger", category: "Accessories", price: 35.0 },
        ],
      },
    ],
    pastRefunds: [
      { orderNumber: "ORD-09901", category: "damaged", status: "approved", daysAgo: 60, message: "Charger stopped working after a week." },
    ],
  },
  {
    name: "Radia Petrova",
    email: "radia@resolve.dev",
    phone: "+1 415 555 0110",
    customerSinceDaysAgo: 600,
    scenario: "Order already refunded → Denied (duplicate)",
    orders: [
      {
        number: "ORD-10010",
        status: "delivered",
        placedDaysAgo: 15,
        deliveredDaysAgo: 12,
        items: [
          { sku: "KIT-150", name: "Pro Blender 1200W", category: "Kitchen", price: 149.0 },
          { sku: "KIT-151", name: "Gooseneck Kettle", category: "Kitchen", price: 69.0 },
        ],
      },
    ],
    pastRefunds: [
      { orderNumber: "ORD-10010", category: "damaged", status: "approved", daysAgo: 9, message: "Blender jar arrived cracked." },
    ],
  },
  {
    name: "Ken Nakamura",
    email: "ken@resolve.dev",
    phone: "+1 415 555 0111",
    customerSinceDaysAgo: 30,
    scenario: "Changed mind within window → Approved",
    orders: [
      {
        number: "ORD-10011",
        status: "delivered",
        placedDaysAgo: 5,
        deliveredDaysAgo: 2,
        items: [{ sku: "BK-044", name: "Hardcover Notebook Set", category: "Stationery", price: 45.0 }],
      },
    ],
  },
  {
    name: "Frances Achebe",
    email: "frances@resolve.dev",
    phone: "+1 415 555 0112",
    customerSinceDaysAgo: 1100,
    scenario: "$649 TV with cracked screen → Escalated (over $500, even though damaged)",
    orders: [
      {
        number: "ORD-10012",
        status: "delivered",
        placedDaysAgo: 9,
        deliveredDaysAgo: 6,
        items: [{ sku: "TV-5500", name: "55\" 4K Smart TV", category: "Electronics", price: 649.0 }],
      },
    ],
  },
  {
    name: "Guido Romano",
    email: "guido@resolve.dev",
    phone: "+1 415 555 0113",
    customerSinceDaysAgo: 500,
    scenario: "Try a story that conflicts with the order (e.g. complain about a product he never bought) → Escalated",
    orders: [
      {
        number: "ORD-10013",
        status: "delivered",
        placedDaysAgo: 10,
        deliveredDaysAgo: 6,
        items: [
          { sku: "OUT-610", name: "Ultralight Tent (2P)", category: "Outdoors", price: 219.0 },
          { sku: "OUT-611", name: "Camping Headlamp", category: "Outdoors", price: 29.0 },
        ],
      },
      {
        number: "ORD-10014",
        status: "delivered",
        placedDaysAgo: 40,
        deliveredDaysAgo: 36,
        items: [{ sku: "OUT-100", name: "Insulated Water Bottle", category: "Outdoors", price: 32.0 }],
      },
    ],
  },
  {
    name: "Hedy Kowalski",
    email: "hedy@resolve.dev",
    phone: "+1 415 555 0114",
    customerSinceDaysAgo: 250,
    scenario: "Delivered 28 days ago (edge of window), defective → Approved",
    orders: [
      {
        number: "ORD-10015",
        status: "delivered",
        placedDaysAgo: 32,
        deliveredDaysAgo: 28,
        items: [{ sku: "ELE-212", name: "Bluetooth Speaker Mini", category: "Electronics", price: 59.0 }],
      },
    ],
  },
  {
    name: "John Mwangi",
    email: "john@resolve.dev",
    phone: "+1 415 555 0115",
    customerSinceDaysAgo: 45,
    scenario: "Cancelled order → Denied (nothing was charged). Also good for prompt-injection tests.",
    orders: [
      {
        number: "ORD-10016",
        status: "cancelled",
        placedDaysAgo: 6,
        items: [{ sku: "FUR-900", name: "Ergonomic Office Chair", category: "Furniture", price: 329.0 }],
      },
      {
        number: "ORD-10017",
        status: "delivered",
        placedDaysAgo: 8,
        deliveredDaysAgo: 5,
        items: [{ sku: "FUR-120", name: "Monitor Riser", category: "Furniture", price: 42.0 }],
      },
    ],
  },
];
