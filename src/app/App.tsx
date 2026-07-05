import { useState, useRef, useEffect } from "react";
import {
  Search, ShoppingCart, MapPin, Phone, Clock, Plus, Minus, X,
  ArrowRight, Star, MessageSquare, Instagram, Facebook, Globe,
  Edit2, EyeOff, Eye, Upload, BarChart2, Home, UtensilsCrossed,
  Info, Trash2, Bell, TrendingUp, Package, Tag, DollarSign,
  Navigation, ChevronRight, Check, ChevronDown, Wifi, Settings,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Screen = "home" | "menu" | "cart" | "info";
type Lang = "en" | "ar";

interface MenuItem {
  id: number;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
  price: number;
  badge?: "Popular" | "New";
  photo: string;
  category: string;
  available: boolean;
}

interface CartItem {
  item: MenuItem;
  qty: number;
  notes: string;
}

// ─── SVG CEDAR ICON ───────────────────────────────────────────────────────────
function CedarIcon({ size = 32, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="currentColor" className={className} style={style} aria-hidden>
      <rect x="21" y="52" width="6" height="8" rx="2" />
      <polygon points="3,52 24,38 45,52" />
      <polygon points="7,43 24,29 41,43" />
      <polygon points="11,34 24,20 37,34" />
      <polygon points="15,25 24,13 33,25" />
      <polygon points="19,17 24,7 29,17" />
    </svg>
  );
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "cold-mezze", name: "Cold Mezze", nameAr: "مقبلات باردة", emoji: "🫙" },
  { id: "hot-mezze", name: "Hot Mezze", nameAr: "مقبلات ساخنة", emoji: "🔥" },
  { id: "salads", name: "Salads", nameAr: "سلطات", emoji: "🥗" },
  { id: "manakish", name: "Manakish", nameAr: "مناقيش", emoji: "🫓" },
  { id: "sandwiches", name: "Sandwiches", nameAr: "سندويشات", emoji: "🥙" },
  { id: "burgers", name: "Burgers", nameAr: "برغر", emoji: "🍔" },
  { id: "pizza", name: "Pizza", nameAr: "بيتزا", emoji: "🍕" },
  { id: "grills", name: "Grills", nameAr: "مشاوي", emoji: "🍖" },
  { id: "seafood", name: "Seafood", nameAr: "مأكولات بحرية", emoji: "🦐" },
  { id: "pasta", name: "Pasta", nameAr: "باستا", emoji: "🍝" },
  { id: "desserts", name: "Desserts", nameAr: "حلويات", emoji: "🍮" },
  { id: "juices", name: "Fresh Juices", nameAr: "عصائر طازجة", emoji: "🥤" },
  { id: "drinks", name: "Soft Drinks", nameAr: "مشروبات", emoji: "🥛" },
];

// ─── MENU DATA ────────────────────────────────────────────────────────────────
const MENU: MenuItem[] = [
  // Cold Mezze
  { id: 1, name: "Hummus", nameAr: "حمص", desc: "Creamy chickpea dip with olive oil & pine nuts", descAr: "حمص كريمي مع زيت الزيتون والصنوبر", price: 4.00, badge: "Popular", photo: "/menu-images/hummus.jpg", category: "cold-mezze", available: true },
  { id: 2, name: "Moutabbal", nameAr: "متبل", desc: "Smoky eggplant dip with tahini & pomegranate", descAr: "دبس باذنجان مدخن مع طحينية ورمان", price: 4.50, badge: "Popular", photo: "/menu-images/moutabbal.jpg", category: "cold-mezze", available: true },
  { id: 3, name: "Baba Ghanouj", nameAr: "بابا غنوج", desc: "Grilled eggplant blended with herbs & olive oil", descAr: "باذنجان مشوي مع الأعشاب وزيت الزيتون", price: 4.50, photo: "/menu-images/baba-ghanouj.jpg", category: "cold-mezze", available: true },
  { id: 4, name: "Labneh with Garlic", nameAr: "لبنة بالثوم", desc: "Strained yogurt with roasted garlic & herbs", descAr: "لبنة كريمية مع الثوم المحمص والأعشاب", price: 3.50, photo: "/menu-images/labneh-with-garlic.jpg", category: "cold-mezze", available: true },
  { id: 5, name: "Vine Leaves", nameAr: "ورق عريش", desc: "Stuffed grape leaves with rice & fresh herbs", descAr: "ورق عنب محشو بالأرز والأعشاب الطازجة", price: 5.00, badge: "Popular", photo: "/menu-images/vine-leaves.jpg", category: "cold-mezze", available: true },
  { id: 6, name: "Mixed Pickles", nameAr: "مخلل مشكل", desc: "House-pickled vegetables & turnips", descAr: "مخللات البيت المشكلة", price: 2.50, photo: "/menu-images/mixed-pickles.jpg", category: "cold-mezze", available: true },
  // Hot Mezze
  { id: 7, name: "French Fries", nameAr: "بطاطا مقلية", desc: "Golden crispy fries with ketchup & mayo", descAr: "بطاطا مقلية مقرمشة مع كاتشب ومايونيز", price: 3.00, photo: "/menu-images/french-fries.jpg", category: "hot-mezze", available: true },
  { id: 8, name: "Spicy Potatoes", nameAr: "بطاطا حارة", desc: "Crispy potatoes tossed in harissa & herbs", descAr: "بطاطا مقرمشة مع الهريسة والأعشاب", price: 4.00, badge: "Popular", photo: "/menu-images/spicy-potatoes.jpg", category: "hot-mezze", available: true },
  { id: 9, name: "Cheese Rolls", nameAr: "رقاق جبنة", desc: "Crispy pastry filled with Lebanese cheese blend", descAr: "رقاق مقرمش محشو بجبنة لبنانية", price: 5.00, photo: "/menu-images/cheese-rolls.jpg", category: "hot-mezze", available: true },
  { id: 10, name: "Meat Sambousek", nameAr: "سمبوسك باللحم", desc: "Fried pastry filled with spiced ground meat", descAr: "سمبوسك مقلي محشو باللحم المفروم المتبل", price: 5.50, badge: "Popular", photo: "photo-1601050690597-df0568f70950", category: "hot-mezze", available: true },
  { id: 11, name: "Chicken Wings", nameAr: "أجنحة الدجاج", desc: "Grilled wings with garlic sauce & lemon", descAr: "أجنحة مشوية مع صوص الثوم والليمون", price: 6.00, badge: "New", photo: "photo-1527477396000-e27163b481c2", category: "hot-mezze", available: true },
  { id: 12, name: "Hummus with Meat", nameAr: "حمص باللحمة", desc: "Creamy hummus topped with spiced meat & pine nuts", descAr: "حمص كريمي مع اللحم المفروم والصنوبر", price: 7.00, badge: "Popular", photo: "/menu-images/hummus-with-meat.jpg", category: "hot-mezze", available: true },
  // Salads
  { id: 13, name: "Fattoush", nameAr: "فتوش", desc: "Fresh vegetables with crispy bread & sumac dressing", descAr: "خضار طازجة مع خبز مقرمش وتتبيلة السماق", price: 5.00, badge: "Popular", photo: "/menu-images/fattoush.jpg", category: "salads", available: true },
  { id: 14, name: "Tabbouleh", nameAr: "تبولة", desc: "Fine bulgur with parsley, mint & lemon", descAr: "برغل ناعم مع البقدونس والنعنع والليمون", price: 5.50, badge: "Popular", photo: "/menu-images/tabbouleh.jpg", category: "salads", available: true },
  { id: 15, name: "Rocca Salad", nameAr: "سلطة الجرجير", desc: "Peppery rocca with cherry tomatoes & parmesan", descAr: "جرجير حار مع طماطم كرزية وبارميزان", price: 6.00, photo: "/menu-images/rocca-salad.jpg", category: "salads", available: true },
  { id: 16, name: "Caesar Salad", nameAr: "سلطة سيزر", desc: "Romaine, croutons, caesar dressing & parmesan", descAr: "خس روماني وقطع خبز وصوص سيزر وبارميزان", price: 7.50, photo: "photo-1550304943-4f24f54ddde9", category: "salads", available: true },
  // Manakish
  { id: 17, name: "Zaatar Mini", nameAr: "معجنات زعتر صغيرة", desc: "Wild thyme with olive oil on thin crispy dough", descAr: "زعتر بري مع زيت الزيتون على عجينة رقيقة مقرمشة", price: 1.00, badge: "Popular", photo: "/menu-images/zaatar-mini.jpg", category: "manakish", available: true },
  { id: 18, name: "Cheese Mini", nameAr: "معجنات جبنة صغيرة", desc: "Melted Lebanese cheese blend on golden dough", descAr: "جبنة لبنانية ذائبة على عجينة ذهبية", price: 2.00, photo: "/menu-images/cheese-mini.jpg", category: "manakish", available: true },
  { id: 19, name: "Keshek Mini", nameAr: "معجنات كشك صغيرة", desc: "Fermented dairy & herb spread on golden dough", descAr: "كشك مخمر مع الأعشاب على عجينة ذهبية", price: 2.00, badge: "New", photo: "/menu-images/keshek-mini.jpg", category: "manakish", available: true },
  { id: 20, name: "Lahm Bi Ajin Mini", nameAr: "لحم بعجين صغيرة", desc: "Spiced minced meat with tomato on thin crust", descAr: "لحم مفروم متبل مع طماطم على عجينة رقيقة", price: 2.50, badge: "Popular", photo: "/menu-images/lahm-bi-ajin-mini.jpg", category: "manakish", available: true },
  { id: 21, name: "Mixed Mini Pieces", nameAr: "مشكل معجنات صغيرة", desc: "Assortment of all manakish flavors", descAr: "تشكيلة من جميع أنواع المناقيش", price: 9.00, photo: "/menu-images/mixed-mini-pieces.jpg", category: "manakish", available: true },
  // Sandwiches
  { id: 22, name: "Chicken Shawarma", nameAr: "شاورما دجاج", desc: "Marinated grilled chicken, garlic sauce & pickles", descAr: "دجاج متبل مشوي مع توم وخيار مخلل", price: 4.00, badge: "Popular", photo: "/menu-images/chicken-shawarma.jpg", category: "sandwiches", available: true },
  { id: 23, name: "Beef Shawarma", nameAr: "شاورما لحم", desc: "Sliced beef with tahini & fresh vegetables", descAr: "لحم مقطع مع طحينية وخضار طازجة", price: 4.50, badge: "Popular", photo: "/menu-images/beef-shawarma.jpg", category: "sandwiches", available: true },
  { id: 24, name: "Tawouk Sandwich", nameAr: "ساندويش تاووق", desc: "Chicken cubes with garlic & pickled veggies", descAr: "مكعبات دجاج مع توم وخضار مخللة", price: 5.00, photo: "/menu-images/tawouk-sandwich.jpg", category: "sandwiches", available: true },
  { id: 25, name: "Kafta Sandwich", nameAr: "ساندويش كفتة", desc: "Spiced ground meat with herbs & tomato", descAr: "لحم مفروم متبل مع أعشاب طازجة وطماطم", price: 5.50, photo: "/menu-images/kafta-sandwich.png", category: "sandwiches", available: true },
  { id: 26, name: "Crispy Chicken Sandwich", nameAr: "ساندويش دجاج مقرمش", desc: "Fried chicken breast with coleslaw & sauce", descAr: "صدر دجاج مقلي مع كولسلو وصوص خاص", price: 6.00, badge: "New", photo: "/menu-images/crispy-chicken-sandwich.jpg", category: "sandwiches", available: true },
  { id: 27, name: "Fajita Sandwich", nameAr: "ساندويش فاهيتا", desc: "Sizzling chicken with peppers, onions & spices", descAr: "دجاج ساخن مع فلفل وبصل وبهارات مكسيكية", price: 6.50, photo: "/menu-images/fajita-sandwich.jpg", category: "sandwiches", available: true },
  // Burgers
  { id: 28, name: "Classic Beef Burger", nameAr: "برغر لحم كلاسيكي", desc: "Beef patty, lettuce, tomato & house sauce", descAr: "باتي لحم مع خس وطماطم وصوص البيت", price: 7.00, photo: "/menu-images/classic-beef-burger.jpg", category: "burgers", available: true },
  { id: 29, name: "Cheese Burger", nameAr: "تشيزبرغر", desc: "Double cheddar with caramelized onions & pickle", descAr: "جبنة مزدوجة مع بصل مكرمل ومخلل", price: 8.00, badge: "Popular", photo: "/menu-images/cheese-burger.jpg", category: "burgers", available: true },
  { id: 30, name: "Mushroom Burger", nameAr: "برغر بالمشروم", desc: "Beef patty with sautéed mushrooms & Swiss cheese", descAr: "باتي لحم مع مشروم مقلي وجبنة سويسرية", price: 8.50, badge: "New", photo: "/menu-images/mushroom-burger.jpg", category: "burgers", available: true },
  { id: 31, name: "Crispy Chicken Burger", nameAr: "برغر دجاج مقرمش", desc: "Fried chicken, pickles, coleslaw & spicy mayo", descAr: "دجاج مقلي مع مخلل وكولسلو ومايونيز حار", price: 7.50, photo: "/menu-images/crispy-chicken-burger.jpg", category: "burgers", available: true },
  // Pizza
  { id: 32, name: "Margherita Pizza", nameAr: "بيتزا مرغريتا", desc: "San Marzano tomato, fresh mozzarella & basil", descAr: "طماطم سان مارزانو وموزاريلا طازجة وريحان", price: 8.00, photo: "/menu-images/margherita-pizza.jpg", category: "pizza", available: true },
  { id: 33, name: "Pepperoni Pizza", nameAr: "بيتزا بيبيروني", desc: "Loaded pepperoni with mozzarella & tomato sauce", descAr: "بيبيروني فاخر مع موزاريلا وصوص الطماطم", price: 10.00, badge: "Popular", photo: "/menu-images/pepperoni-pizza.jpg", category: "pizza", available: true },
  { id: 34, name: "Chicken BBQ Pizza", nameAr: "بيتزا دجاج BBQ", desc: "Grilled chicken, BBQ sauce, red onion & cilantro", descAr: "دجاج مشوي وصوص BBQ وبصل أحمر وكزبرة", price: 10.50, badge: "New", photo: "/menu-images/chicken-bbq-pizza.jpg", category: "pizza", available: true },
  { id: 35, name: "Vegetarian Pizza", nameAr: "بيتزا نباتية", desc: "Seasonal vegetables, olives & herb-infused sauce", descAr: "خضار موسمية وزيتون مع صوص الأعشاب", price: 9.00, photo: "/menu-images/vegetarian-pizza.jpg", category: "pizza", available: true },
  // Grills
  { id: 36, name: "Shish Tawouk Plate", nameAr: "طبق شيش طاووق", desc: "Marinated chicken skewers with garlic sauce & rice", descAr: "أسياخ دجاج متبلة مع توم وأرز", price: 10.00, badge: "Popular", photo: "/menu-images/shish-tawouk-plate.jpg", category: "grills", available: true },
  { id: 37, name: "Kafta Plate", nameAr: "طبق كفتة", desc: "Grilled spiced meat rolls with tomato & onion", descAr: "لفائف لحم متبل مشوي مع طماطم وبصل", price: 11.00, badge: "Popular", photo: "/menu-images/kafta-plate.jpg", category: "grills", available: true },
  { id: 38, name: "Mixed Grill Plate", nameAr: "مشاوي مشكلة", desc: "Kafta, tawouk, lamb chops & grilled vegetables", descAr: "كفتة وتاووق ورياش وخضار مشوية", price: 16.00, badge: "Popular", photo: "/menu-images/mixed-grill-plate.jpg", category: "grills", available: true },
  { id: 39, name: "Grilled Chicken Half", nameAr: "نصف دجاجة مشوي", desc: "Half chicken marinated with garlic & lemon", descAr: "نصف دجاجة مشوية مع ثوم وليمون", price: 12.00, photo: "/menu-images/grilledchickenhalf.jpg", category: "grills", available: true },
  { id: 40, name: "Lamb Chops", nameAr: "رياش ضأن", desc: "Tender marinated lamb chops with fresh herbs", descAr: "رياش ضأن طرية متبلة مع الأعشاب الطازجة", price: 18.00, badge: "New", photo: "/menu-images/lambchops.jpg", category: "grills", available: true },
  // Seafood
  { id: 41, name: "Grilled Fish", nameAr: "سمك مشوي", desc: "Fresh whole fish grilled with lemon & herbs", descAr: "سمكة طازجة مشوية مع الليمون والأعشاب", price: 18.00, photo: "/menu-images/grilledfish.jpg", category: "seafood", available: true },
  { id: 42, name: "Fried Calamari", nameAr: "كاليماري مقلي", desc: "Crispy calamari rings with tartar sauce", descAr: "حلقات كاليماري مقرمشة مع صوص التارتار", price: 12.00, badge: "Popular", photo: "/menu-images/fried-calamari.jpg", category: "seafood", available: true },
  { id: 43, name: "Shrimp Provencal", nameAr: "جمبري بروفنسال", desc: "Sautéed shrimp with garlic, tomato & white wine", descAr: "جمبري مقلي مع الثوم والطماطم والنبيذ الأبيض", price: 15.00, badge: "New", photo: "/menu-images/shrimpprovencal.jpg", category: "seafood", available: true },
  { id: 44, name: "Seafood Platter", nameAr: "طبق مأكولات بحرية", desc: "Mixed fish, calamari, shrimp & prawns for two", descAr: "تشكيلة سمك وكاليماري وجمبري للشخصين", price: 50.00, badge: "Popular", photo: "/menu-images/seafoodplatter.jpg", category: "seafood", available: true },
  // Pasta
  { id: 45, name: "Alfredo Pasta", nameAr: "باستا الفريدو", desc: "Creamy parmesan sauce with fettuccine", descAr: "صوص بارميزان كريمي مع فيتوتشيني", price: 9.00, photo: "/menu-images/alfredopasta.jpg", category: "pasta", available: true },
  { id: 46, name: "Pesto Chicken Pasta", nameAr: "باستا بيستو بالدجاج", desc: "Basil pesto, grilled chicken & cherry tomatoes", descAr: "بيستو ريحان مع دجاج مشوي وطماطم كرزية", price: 10.00, badge: "Popular", photo: "/menu-images/pestochickenpasta.jpg", category: "pasta", available: true },
  { id: 47, name: "Bolognese Pasta", nameAr: "باستا بولونيز", desc: "Slow-cooked beef ragù with pappardelle", descAr: "راغو لحم بقري على نار هادئة مع باباردال", price: 10.50, photo: "/menu-images/bolognesepasta.jpg", category: "pasta", available: true },
  { id: 48, name: "Seafood Pasta", nameAr: "باستا مأكولات بحرية", desc: "Mixed seafood in a rich tomato bisque sauce", descAr: "مأكولات بحرية مشكلة في صوص طماطم غني", price: 14.00, badge: "New", photo: "/menu-images/seafoodpasta.jpg", category: "pasta", available: true },
  // Desserts
  { id: 49, name: "Knefeh", nameAr: "كنافة", desc: "Warm cheese pastry with rose water syrup & pistachios", descAr: "كنافة دافئة بالقطر وماء الزهر والفستق", price: 5.00, badge: "Popular", photo: "/menu-images/knefeh.jpg", category: "desserts", available: true },
  { id: 50, name: "Chocolate Fondant", nameAr: "فوندان شوكولاتة", desc: "Warm molten chocolate cake with vanilla ice cream", descAr: "كيك شوكولاتة بقلب سائل مع آيس كريم فانيليا", price: 6.00, badge: "Popular", photo: "photo-1563805042-7684c019e1cb", category: "desserts", available: true },
  { id: 51, name: "Ice Cream Scoops", nameAr: "كرات آيس كريم", desc: "Three scoops of your choice with toppings", descAr: "ثلاث كرات من اختيارك مع الإضافات", price: 4.00, photo: "/menu-images/icrecreamscoops.jpg", category: "desserts", available: true },
  { id: 52, name: "Rice Pudding", nameAr: "أرز بالحليب", desc: "Traditional Lebanese rice pudding with rose water", descAr: "أرز بالحليب اللبناني التقليدي بماء الزهر", price: 4.50, photo: "/menu-images/ricepudding.jpg", category: "desserts", available: true },
  // Juices
  { id: 53, name: "Orange Juice", nameAr: "عصير برتقال", desc: "Freshly squeezed seasonal oranges", descAr: "برتقال طازج معصور على الطلب", price: 4.00, badge: "Popular", photo: "photo-1600271886742-f049cd451bba", category: "juices", available: true },
  { id: 54, name: "Lemonade", nameAr: "ليموناضة", desc: "Fresh lemon juice with sugar & mint leaves", descAr: "عصير ليمون طازج مع السكر وأوراق النعنع", price: 3.50, photo: "/menu-images/lemonade.jpg", category: "juices", available: true },
  { id: 55, name: "Minted Lemonade", nameAr: "ليموناضة بالنعنع", desc: "Zesty lemonade blended with fresh mint", descAr: "ليموناضة منعشة مع النعنع الطازج", price: 4.00, badge: "Popular", photo: "/menu-images/mintedlemonade.jpg", category: "juices", available: true },
  { id: 56, name: "Strawberry Juice", nameAr: "عصير فراولة", desc: "Blended fresh strawberries with a hint of cream", descAr: "فراولة طازجة مخفوقة مع قشطة خفيفة", price: 4.50, photo: "/menu-images/strawberryjuice.jpg", category: "juices", available: true },
  { id: 57, name: "Mango Juice", nameAr: "عصير منجو", desc: "Tropical mango blended with fresh lime", descAr: "منجو استوائي مخفوق مع الليمون الأخضر", price: 5.00, photo: "photo-1546173159-315724a31696", category: "juices", available: true },
  { id: 58, name: "Cocktail Juice", nameAr: "عصير كوكتيل", desc: "Seasonal fruit blend with tropical twist", descAr: "مزيج فواكه موسمية بلمسة استوائية", price: 5.50, photo: "/menu-images/cocktailjuice.jpg", category: "juices", available: true },
  // Soft Drinks
  { id: 59, name: "Water", nameAr: "ماء", desc: "Still mineral water 500ml", descAr: "مياه معدنية 500 مل", price: 1.00, photo: "photo-1548839140-29a749e1cf4d", category: "drinks", available: true },
  { id: 60, name: "Pepsi", nameAr: "بيبسي", desc: "Chilled Pepsi Cola 330ml", descAr: "بيبسي كولا مبردة 330 مل", price: 2.00, photo: "/menu-images/pepsi.jpg", category: "drinks", available: true },
  { id: 61, name: "7Up", nameAr: "سفن أب", desc: "Refreshing lemon & lime soda 330ml", descAr: "مشروب ليمون منعش 330 مل", price: 2.00, photo: "/menu-images/7up.jpg", category: "drinks", available: true },
  { id: 62, name: "Sparkling Water", nameAr: "مياه فوارة", desc: "Sparkling mineral water 330ml", descAr: "مياه معدنية فوارة 330 مل", price: 2.50, photo: "/menu-images/sparklingwater.jpg", category: "drinks", available: true },
  { id: 63, name: "Energy Drink", nameAr: "مشروب طاقة", desc: "Energizing boost drink 250ml", descAr: "مشروب طاقة منشط 250 مل", price: 4.00, badge: "New", photo: "/menu-images/energydrink.jpg", category: "drinks", available: true },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function img(photoId: string, w = 400, h = 300) {
  if (photoId.startsWith("/menu-images/")) return photoId;
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

function isDrinkItem(item: MenuItem) {
  return item.category === "juices" || item.category === "drinks";
}

function Badge({ type }: { type: "Popular" | "New" }) {
  return (
    <span
      className="font-poppins text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
      style={{ background: type === "Popular" ? "#C89B3C" : "#2E5E4E" }}
    >
      {type === "Popular" ? "★ Popular" : "✦ New"}
    </span>
  );
}

function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  const color = light ? "#fff" : "#2E5E4E";
  const textColor = light ? "text-white" : "text-foreground";
  const subColor = light ? "text-white/70" : "";
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-full p-1.5 shrink-0"
        style={{ background: light ? "rgba(255,255,255,0.15)" : "rgba(46,94,78,0.1)" }}
      >
        <CedarIcon size={compact ? 22 : 28} className="" style={{ color }} />
      </div>
      <div>
        <div
          className={`font-playfair font-bold leading-none ${textColor}`}
          style={{ fontSize: compact ? 16 : 19 }}
        >
          Arzé{" "}
          <span className="font-cairo" style={{ opacity: 0.75 }}>
            | أرزة
          </span>
        </div>
        {!compact && (
          <div
            className={`font-poppins text-xs font-medium tracking-wide mt-0.5 ${subColor}`}
            style={{ color: light ? "rgba(255,255,255,0.7)" : "#C89B3C" }}
          >
            Taste of Lebanon
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({
  onNavigate,
  lang,
}: {
  onNavigate: (s: Screen) => void;
  lang: Lang;
}) {
  const ar = lang === "ar";
  return (
    <div className="flex flex-col min-h-full" dir={ar ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative h-[61vh] min-h-[390px] overflow-hidden bg-primary">
        <img
          src={img("photo-1544025162-d76694265947", 800, 700)}
          alt="Lebanese mezze spread"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(25,50,42,.68) 0%, rgba(46,94,78,.22) 38%, rgba(40,27,21,.92) 100%)",
          }}
        />
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-8">
          <Logo light />
          <div className="flex items-center gap-2">
            <span
              className="font-poppins text-[11px] font-semibold px-3 py-1 rounded-full text-white border border-white/30"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
            >
              {ar ? "نكهة لبنان" : "EN | عربي"}
            </span>
          </div>
        </div>
        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-9">
          <div className="inline-flex items-center gap-2 font-poppins text-[10px] font-semibold uppercase tracking-[.22em] text-white/80 mb-3">
            <span className="h-px w-7 bg-[#C89B3C]" />
            {ar ? "مطعم لبناني" : "Lebanese Restaurant"}
          </div>
          <h1
            className="font-playfair text-white leading-tight mb-1"
            style={{ fontSize: 36 }}
          >
            {ar ? "نكهة لبنان الأصيلة" : "A Taste of Lebanon"}
          </h1>
          <p className="font-poppins text-white/75 text-sm leading-relaxed">
            {ar
              ? "اكتشف أصالة المطبخ اللبناني في كل لقمة"
              : "Authentic flavors, crafted with passion & heritage"}
          </p>
        </div>
      </section>

      {/* Info chips */}
      <div className="bg-primary flex items-center justify-center gap-4 py-3 px-4">
        <div className="flex items-center gap-1.5 text-white/80">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-poppins text-xs font-medium">{ar ? "مفتوح الآن" : "Open Now"}</span>
        </div>
        <div className="w-px h-3 bg-white/20" />
        <div className="flex items-center gap-1 text-white/80">
          <MapPin size={11} />
          <span className="font-poppins text-xs">{ar ? "صور، لبنان" : "Tyre, Lebanon"}</span>
        </div>
        <div className="w-px h-3 bg-white/20" />
        <div className="flex items-center gap-1 text-white/80">
          <UtensilsCrossed size={11} />
          <span className="font-poppins text-xs">{ar ? "داخلي / خارجي" : "Dine-in / Takeaway"}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-5 py-7 flex flex-col gap-5">
        {/* Brand welcome card */}
        <div
          className="flex items-center gap-4 rounded-2xl p-4 border"
          style={{ background: "#fff", borderColor: "#E6DED2" }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#2E5E4E", boxShadow: "0 8px 18px rgba(46,94,78,.18)" }}
          >
            <div className="font-playfair text-white font-bold text-lg">Arzé</div>
          </div>
          <div className="flex-1">
            <div className="font-playfair font-semibold text-foreground text-base leading-snug">
              {ar ? "قائمة رقمية" : "Digital Menu"}
            </div>
            <div className="font-poppins text-xs text-muted-foreground mt-0.5">
              {ar ? "امسح · تصفح · اطلب" : "Scan · Browse · Order"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Wifi size={14} className="text-primary" />
          </div>
        </div>

        {/* CTA Buttons */}
        <button
          onClick={() => onNavigate("menu")}
          className="w-full py-4 rounded-2xl font-poppins font-semibold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ background: "#2E5E4E", boxShadow: "0 8px 24px rgba(46,94,78,0.3)" }}
        >
          <UtensilsCrossed size={18} />
          {ar ? "عرض القائمة" : "View Menu"}
          <ArrowRight size={16} />
        </button>

        <a href="tel:1698" className="w-full py-4 rounded-2xl font-poppins font-semibold text-primary text-base flex items-center justify-center gap-2 border transition-all active:scale-95" style={{ background: "#fff", borderColor: "#D8CDBE", boxShadow: "0 4px 16px rgba(74,52,40,.06)" }}>
          <Phone size={18} />
          {ar ? "اتصل 1698" : "Call 1698"}
        </a>

        {/* Popular quick picks */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-playfair font-semibold text-foreground text-lg">
              {ar ? "الأكثر طلباً" : "Most Popular"}
            </h2>
            <button
              onClick={() => onNavigate("menu")}
              className="font-poppins text-xs font-medium flex items-center gap-1"
              style={{ color: "#C89B3C" }}
            >
              {ar ? "عرض الكل" : "See all"} <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {MENU.filter((m) => m.badge === "Popular").slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-36 rounded-2xl overflow-hidden border"
                style={{ background: "#fff", borderColor: "#E6DED2" }}
              >
                <div className={`w-36 h-24 overflow-hidden ${isDrinkItem(item) ? "bg-[#F8F4EC] p-2" : "bg-muted"}`}>
                  <img
                    src={img(item.photo, 144, 96)}
                    alt={item.name}
                    className={`w-full h-full ${isDrinkItem(item) ? "object-contain object-center" : "object-cover"}`}
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5">
                  <div className="font-poppins text-xs font-semibold text-foreground leading-snug">
                    {ar ? item.nameAr : item.name}
                  </div>
                  <div className="font-poppins text-xs font-bold mt-1" style={{ color: "#C89B3C" }}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MENU SCREEN ──────────────────────────────────────────────────────────────
function MenuScreen({
  lang,
  onLangToggle,
  onItemSelect,
  cart,
  onAddToCart,
}: {
  lang: Lang;
  onLangToggle: () => void;
  onItemSelect: (item: MenuItem) => void;
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
}) {
  const ar = lang === "ar";
  const [activeCat, setActiveCat] = useState("cold-mezze");
  const [search, setSearch] = useState("");
  const chipsRef = useRef<HTMLDivElement>(null);

  const filtered = MENU.filter((item) => {
    const catMatch = item.category === activeCat;
    const searchMatch =
      search.trim() === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.nameAr.includes(search);
    return catMatch && searchMatch;
  });

  const allSearched =
    search.trim() !== ""
      ? MENU.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.nameAr.includes(search)
        )
      : null;

  const displayItems = allSearched ?? filtered;

  useEffect(() => {
    const active = chipsRef.current?.querySelector(`[data-cat="${activeCat}"]`) as HTMLElement;
    active?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeCat]);

  return (
    <div className="flex flex-col h-full" dir={ar ? "rtl" : "ltr"}>
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-30 px-4 pt-5 pb-3"
        style={{ background: "#F8F4EC", boxShadow: "0 2px 16px rgba(74,52,40,0.07)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <Logo compact />
          <button
            onClick={onLangToggle}
            className="font-poppins text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
            style={{ borderColor: "#2E5E4E", color: "#2E5E4E", background: "rgba(46,94,78,0.06)" }}
          >
            {ar ? "EN" : "عربي"}
          </button>
        </div>
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3.5 py-3 rounded-2xl"
          style={{ background: "#fff", border: "1px solid #E6DED2", boxShadow: "0 4px 16px rgba(74,52,40,.05)" }}
        >
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            className="flex-1 bg-transparent font-poppins text-sm text-foreground placeholder-muted-foreground outline-none"
            placeholder={ar ? "ابحث عن طبقك المفضل…" : "Search your favorite dish…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            dir={ar ? "rtl" : "ltr"}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={13} className="text-muted-foreground" />
            </button>
          )}
        </div>
        {/* Category chips */}
        {!allSearched && (
          <div
            ref={chipsRef}
            className="flex gap-2 mt-3 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {CATEGORIES.map((cat) => {
              const active = cat.id === activeCat;
              return (
                <button
                  key={cat.id}
                  data-cat={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-poppins text-xs font-medium transition-all"
                  style={{
                    background: active ? "#2E5E4E" : "#fff",
                    color: active ? "#fff" : "#4A3428",
                    border: `1.5px solid ${active ? "#2E5E4E" : "#E6DED2"}`,
                    boxShadow: active ? "0 4px 12px rgba(46,94,78,0.2)" : "none",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                  {ar ? cat.nameAr : cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
        {allSearched && (
          <div className="font-poppins text-xs text-muted-foreground mb-3">
            {allSearched.length} {ar ? "نتيجة" : "results"} for "{search}"
          </div>
        )}
        {!allSearched && (
          <h2 className="font-playfair font-bold text-foreground text-xl mb-4">
            {ar
              ? CATEGORIES.find((c) => c.id === activeCat)?.nameAr
              : CATEGORIES.find((c) => c.id === activeCat)?.name}
          </h2>
        )}
        <div className="flex flex-col gap-3">
          {displayItems.map((item) => {
            const inCart = cart.find((c) => c.item.id === item.id);
            return (
              <div
                key={item.id}
                className="menu-card flex gap-3 rounded-2xl overflow-hidden border cursor-pointer transition-all active:scale-[0.98]"
                style={{ background: "#fff", borderColor: "#E6DED2", boxShadow: "0 5px 18px rgba(74,52,40,0.07)" }}
                onClick={() => onItemSelect(item)}
              >
                <div className={`w-28 h-28 shrink-0 overflow-hidden ${isDrinkItem(item) ? "bg-[#F8F4EC] p-2" : "bg-muted"}`}>
                  <img
                    src={img(item.photo, 112, 112)}
                    alt={ar ? item.nameAr : item.name}
                    className={`w-full h-full ${isDrinkItem(item) ? "object-contain object-center" : "object-cover"}`}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="font-poppins font-semibold text-sm text-foreground leading-snug">
                          {ar ? item.nameAr : item.name}
                        </div>
                      </div>
                      {item.badge && <Badge type={item.badge} />}
                    </div>
                    <p className="font-poppins text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {ar ? item.descAr : item.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-poppins font-bold text-base" style={{ color: "#C89B3C" }}>
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                      style={{
                        background: inCart ? "#C89B3C" : "#2E5E4E",
                        boxShadow: "0 4px 10px rgba(46,94,78,0.25)",
                      }}
                    >
                      {inCart ? (
                        <span className="font-poppins text-white text-xs font-bold">{inCart.qty}</span>
                      ) : (
                        <Plus size={15} className="text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {displayItems.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-poppins text-sm">{ar ? "لا توجد نتائج" : "No items found"}</div>
            </div>
          )}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── ITEM MODAL ───────────────────────────────────────────────────────────────
function ItemModal({
  item,
  lang,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  lang: Lang;
  onClose: () => void;
  onAdd: (item: MenuItem, qty: number, notes: string) => void;
}) {
  const ar = lang === "ar";
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(74,52,40,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 -8px 40px rgba(74,52,40,0.15)" }}
        onClick={(e) => e.stopPropagation()}
        dir={ar ? "rtl" : "ltr"}
      >
        {/* Image */}
        <div className={`relative h-52 overflow-hidden ${isDrinkItem(item) ? "bg-[#F8F4EC] p-4" : "bg-muted"}`}>
          <img
            src={img(item.photo, 500, 300)}
            alt={ar ? item.nameAr : item.name}
            className={`w-full h-full ${isDrinkItem(item) ? "object-contain object-center" : "object-cover"}`}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.5) 0%, transparent 50%)" }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}
          >
            <X size={16} className="text-foreground" />
          </button>
          {item.badge && (
            <div className="absolute top-4 left-4">
              <Badge type={item.badge} />
            </div>
          )}
        </div>
        {/* Content */}
        <div className="px-5 py-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="font-playfair font-bold text-foreground text-xl flex-1">
              {ar ? item.nameAr : item.name}
            </h2>
            <span className="font-poppins font-bold text-xl shrink-0" style={{ color: "#C89B3C" }}>
              ${item.price.toFixed(2)}
            </span>
          </div>
          <p className="font-poppins text-sm text-muted-foreground leading-relaxed mb-5">
            {ar ? item.descAr : item.desc}
          </p>

          {/* Qty stepper */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-poppins text-sm font-medium text-foreground">
              {ar ? "الكمية" : "Quantity"}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ borderColor: "#2E5E4E", color: "#2E5E4E" }}
              >
                <Minus size={14} />
              </button>
              <span className="font-poppins font-bold text-foreground text-lg w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ background: "#2E5E4E", color: "#fff" }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Notes */}
          <textarea
            className="w-full rounded-xl px-3.5 py-3 font-poppins text-sm text-foreground resize-none outline-none mb-5"
            style={{
              background: "#F0EBE3",
              border: "1px solid #E6DED2",
              minHeight: 72,
            }}
            placeholder={ar ? "تعليمات خاصة… (اختياري)" : "Special instructions… (optional)"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            dir={ar ? "rtl" : "ltr"}
          />

          {/* Add button */}
          <button
            onClick={() => {
              onAdd(item, qty, notes);
              onClose();
            }}
            className="w-full py-4 rounded-2xl font-poppins font-semibold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: "#2E5E4E", boxShadow: "0 8px 20px rgba(46,94,78,0.3)" }}
          >
            <ShoppingCart size={17} />
            {ar ? "أضف للطلب" : "Add to Order"} —{" "}
            <span style={{ color: "#C89B3C" }}>${(item.price * qty).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CART SCREEN ──────────────────────────────────────────────────────────────
function CartScreen({
  cart,
  lang,
  onUpdateQty,
  onRemove,
  onClear,
}: {
  cart: CartItem[];
  lang: Lang;
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
}) {
  const ar = lang === "ar";
  const subtotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const [ordered, setOrdered] = useState(false);

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 px-8" dir={ar ? "rtl" : "ltr"}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(46,94,78,0.12)" }}
        >
          <Check size={36} className="text-primary" />
        </div>
        <h2 className="font-playfair font-bold text-foreground text-2xl text-center">
          {ar ? "تم إرسال طلبك!" : "Order Sent!"}
        </h2>
        <p className="font-poppins text-sm text-muted-foreground text-center leading-relaxed">
          {ar
            ? "سيصلك طلبك قريباً. شكراً لزيارتك أرزة."
            : "Your order is being prepared. Thank you for dining with Arzé!"}
        </p>
        <button
          onClick={() => { setOrdered(false); onClear(); }}
          className="px-8 py-3 rounded-2xl font-poppins font-semibold text-white transition-all"
          style={{ background: "#2E5E4E" }}
        >
          {ar ? "طلب جديد" : "New Order"}
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-8" dir={ar ? "rtl" : "ltr"}>
        <div className="text-6xl">🛒</div>
        <h2 className="font-playfair font-bold text-foreground text-xl">
          {ar ? "السلة فارغة" : "Your cart is empty"}
        </h2>
        <p className="font-poppins text-sm text-muted-foreground text-center">
          {ar ? "أضف أطباقك المفضلة من القائمة" : "Add your favorite dishes from the menu"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" dir={ar ? "rtl" : "ltr"}>
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <h1 className="font-playfair font-bold text-foreground text-2xl">
          {ar ? "طلبك" : "Your Order"}
        </h1>
        <button
          onClick={onClear}
          className="font-poppins text-xs text-muted-foreground underline underline-offset-2"
        >
          {ar ? "مسح الكل" : "Clear all"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        {cart.map((ci) => (
          <div
            key={ci.item.id}
            className="flex gap-3 rounded-2xl p-3 border"
            style={{ background: "#fff", borderColor: "#E6DED2" }}
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
              <img
                src={img(ci.item.photo, 64, 64)}
                alt={ar ? ci.item.nameAr : ci.item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-poppins font-semibold text-sm text-foreground leading-snug">
                {ar ? ci.item.nameAr : ci.item.name}
              </div>
              {ci.notes && (
                <div className="font-poppins text-xs text-muted-foreground mt-0.5 italic line-clamp-1">
                  "{ci.notes}"
                </div>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQty(ci.item.id, -1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center"
                    style={{ borderColor: "#E6DED2" }}
                  >
                    <Minus size={11} className="text-foreground" />
                  </button>
                  <span className="font-poppins font-semibold text-sm text-foreground w-4 text-center">
                    {ci.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(ci.item.id, 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "#2E5E4E" }}
                  >
                    <Plus size={11} className="text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-poppins font-bold text-sm" style={{ color: "#C89B3C" }}>
                    ${(ci.item.price * ci.qty).toFixed(2)}
                  </span>
                  <button onClick={() => onRemove(ci.item.id)}>
                    <Trash2 size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary & Actions */}
      <div
        className="px-5 pt-4 pb-6 border-t"
        style={{ borderColor: "#E6DED2", background: "#fff" }}
      >
        <div className="flex justify-between mb-1">
          <span className="font-poppins text-sm text-muted-foreground">{ar ? "المجموع" : "Subtotal"}</span>
          <span className="font-poppins font-semibold text-sm text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="font-poppins text-sm text-muted-foreground">{ar ? "رسوم الخدمة" : "Service"}</span>
          <span className="font-poppins text-sm text-muted-foreground">{ar ? "تُضاف لاحقاً" : "Added at checkout"}</span>
        </div>
        <div className="flex justify-between mb-4 pt-2 border-t" style={{ borderColor: "#E6DED2" }}>
          <span className="font-playfair font-bold text-foreground">{ar ? "الإجمالي" : "Total"}</span>
          <span className="font-playfair font-bold text-foreground text-lg">${subtotal.toFixed(2)}</span>
        </div>

        <div className="mb-4 rounded-xl border p-3 text-center font-poppins text-xs leading-relaxed text-muted-foreground" style={{ borderColor: "#E6DED2", background: "#F8F4EC" }}>
          {ar ? "هذه السلة لحساب المجموع فقط. للطلب، اتصل على 1698 أو اطلب داخل المطعم." : "This cart is for total calculation only. To order, please call 1698 or order inside the restaurant."}
        </div>
        <a href="tel:1698" className="w-full py-4 rounded-2xl font-poppins font-semibold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95" style={{ background: "#2E5E4E", boxShadow: "0 8px 20px rgba(46,94,78,0.3)" }}>
          <Phone size={17} />{ar ? "اطلب عبر الهاتف: 1698" : "Order by Phone: 1698"}
        </a>
      </div>
    </div>
  );
}

// ─── INFO SCREEN ──────────────────────────────────────────────────────────────
function InfoScreen({ lang }: { lang: Lang }) {
  const ar = lang === "ar";
  const hours = [{ day: ar ? "مفتوح يومياً" : "Open daily", time: "8:00 AM – 2:00 AM" }];
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }} dir={ar ? "rtl" : "ltr"}>
      {/* Hero */}
      <div className="relative h-48 bg-primary overflow-hidden">
        <img
          src={img("photo-1517248135467-4c7edcad34c4", 500, 300)}
          alt="Arzé restaurant interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(46,94,78,0.4) 0%, rgba(46,94,78,0.75) 100%)" }} />
        <div className="absolute bottom-5 left-5 right-5">
          <Logo light />
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* About */}
        <div>
          <h2 className="font-playfair font-bold text-foreground text-xl mb-2">
            {ar ? "عن أرزة" : "About Arzé"}
          </h2>
          <p className="font-poppins text-sm text-muted-foreground leading-relaxed">
            {ar
              ? "أرزة مطعم لبناني أصيل في مدينة صور، يقدم أشهى الأطباق اللبنانية التقليدية بلمسة عصرية. نحن نؤمن بأن الطعام الجيد يجمع الناس ويحكي قصص الموروث الثقافي اللبناني الغني."
              : "Arzé is an authentic Lebanese restaurant in Tyre, serving beloved traditional dishes with a modern touch. We believe great food connects people and tells the story of Lebanon's rich culinary heritage."}
          </p>
        </div>

        {/* Hours */}
        <div
          className="rounded-2xl border p-4"
          style={{ background: "#fff", borderColor: "#E6DED2" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock size={15} className="text-primary" />
            <h3 className="font-poppins font-semibold text-foreground text-sm">
              {ar ? "ساعات العمل" : "Opening Hours"}
            </h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {hours.map((h, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-poppins text-sm text-foreground">{h.day}</span>
                <span className="font-poppins text-sm font-semibold" style={{ color: "#2E5E4E" }}>
                  {h.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div
          className="rounded-2xl border p-4 flex gap-3 items-start"
          style={{ background: "#fff", borderColor: "#E6DED2" }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(46,94,78,0.1)" }}>
            <MapPin size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-poppins font-semibold text-sm text-foreground">
              {ar ? "الموقع" : "Location"}
            </div>
            <div className="font-poppins text-sm text-muted-foreground mt-0.5">
              {ar ? "شارع الرئيسي، صور، لبنان" : "Main Street, Tyre, South Lebanon"}
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Phone size={18} />, label: ar ? "اتصل 1698" : "Call 1698", color: "#2E5E4E" },
            { icon: <MessageSquare size={18} />, label: "WhatsApp", color: "#25D366" },
            { icon: <Navigation size={18} />, label: ar ? "عرض الخريطة" : "View on Maps", color: "#C89B3C" },
          ].map((btn) => (
            <button
              key={btn.label}
              className="flex flex-col items-center gap-1.5 py-4 rounded-2xl font-poppins text-xs font-semibold text-white transition-all active:scale-95"
              style={{ background: btn.color, boxShadow: `0 4px 16px ${btn.color}44` }}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* Social */}
        <div className="flex items-center justify-center gap-5">
          {[
            { icon: <Instagram size={20} />, label: "@arze.lb" },
            { icon: <Facebook size={20} />, label: "Arzé" },
            { icon: <Globe size={20} />, label: "arze.lb" },
          ].map((s) => (
            <button
              key={s.label}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              {s.icon}
              <span className="font-poppins text-[10px]">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN SCREEN ─────────────────────────────────────────────────────────────
function AdminScreen({ lang }: { lang: Lang }) {
  const ar = lang === "ar";
  const [items, setItems] = useState(MENU.slice(0, 8).map((m) => ({ ...m })));

  const stats = [
    { icon: <TrendingUp size={18} />, label: ar ? "الطلبات اليوم" : "Today's Orders", value: "47", color: "#2E5E4E" },
    { icon: <DollarSign size={18} />, label: ar ? "الإيرادات" : "Revenue", value: "$612", color: "#C89B3C" },
    { icon: <Package size={18} />, label: ar ? "الأطباق" : "Menu Items", value: `${MENU.length}`, color: "#758E67" },
    { icon: <Tag size={18} />, label: ar ? "الفئات" : "Categories", value: `${CATEGORIES.length}`, color: "#4A3428" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }} dir={ar ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4" style={{ background: "#2E5E4E" }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="font-playfair font-bold text-white text-xl">{ar ? "لوحة التحكم" : "Dashboard"}</div>
            <div className="font-poppins text-xs text-white/60 mt-0.5">{ar ? "إدارة قائمة أرزة" : "Arzé Menu Manager"}</div>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Settings size={18} className="text-white" />
          </div>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 border"
              style={{ background: "#fff", borderColor: "#E6DED2" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${s.color}18`, color: s.color }}
              >
                {s.icon}
              </div>
              <div className="font-playfair font-bold text-foreground text-2xl">{s.value}</div>
              <div className="font-poppins text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl border p-4"
          style={{ background: "#fff", borderColor: "#E6DED2" }}
        >
          <h3 className="font-poppins font-semibold text-foreground text-sm mb-3">
            {ar ? "إجراءات سريعة" : "Quick Actions"}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Plus size={14} />, label: ar ? "إضافة طبق" : "Add Item", color: "#2E5E4E" },
              { icon: <Upload size={14} />, label: ar ? "رفع صورة" : "Upload Image", color: "#758E67" },
              { icon: <Tag size={14} />, label: ar ? "إدارة الفئات" : "Categories", color: "#C89B3C" },
              { icon: <Clock size={14} />, label: ar ? "تحديث الأوقات" : "Update Hours", color: "#4A3428" },
            ].map((a) => (
              <button
                key={a.label}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-poppins text-xs font-semibold text-white transition-all active:scale-95"
                style={{ background: a.color }}
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Item Management */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-poppins font-semibold text-foreground text-sm">
              {ar ? "إدارة القائمة" : "Manage Menu Items"}
            </h3>
            <span className="font-poppins text-xs text-muted-foreground">
              {ar ? "تبديل التوفر / تعديل السعر" : "Toggle availability & edit price"}
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl p-3 border transition-all"
                style={{
                  background: "#fff",
                  borderColor: item.available ? "#E6DED2" : "#f0d0cc",
                  opacity: item.available ? 1 : 0.65,
                }}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                  <img
                    src={img(item.photo, 48, 48)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-poppins font-semibold text-xs text-foreground leading-snug">
                    {item.name}
                  </div>
                  <div className="font-poppins font-bold text-xs mt-0.5" style={{ color: "#C89B3C" }}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#F0EBE3", color: "#9B8A7A" }}
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() =>
                      setItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
                      )
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: item.available ? "rgba(46,94,78,0.12)" : "rgba(192,57,43,0.1)",
                      color: item.available ? "#2E5E4E" : "#C0392B",
                    }}
                  >
                    {item.available ? <Eye size={11} /> : <EyeOff size={11} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Items */}
        <div
          className="rounded-2xl border p-4"
          style={{ background: "#fff", borderColor: "#E6DED2" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={15} className="text-primary" />
            <h3 className="font-poppins font-semibold text-foreground text-sm">
              {ar ? "الأكثر طلباً" : "Popular Items"}
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {MENU.filter((m) => m.badge === "Popular").slice(0, 4).map((item, i) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="font-poppins font-bold text-xs text-muted-foreground w-4">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-poppins text-xs font-medium text-foreground">{item.name}</div>
                  <div
                    className="h-1.5 rounded-full mt-1 transition-all"
                    style={{
                      background: "#E6DED2",
                      width: "100%",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ background: "#C89B3C", width: `${90 - i * 15}%` }}
                    />
                  </div>
                </div>
                <span className="font-poppins text-xs font-bold" style={{ color: "#2E5E4E" }}>
                  {32 - i * 6} {ar ? "طلب" : "orders"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-4" />
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({
  screen,
  onNavigate,
  cartCount,
  lang,
}: {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  cartCount: number;
  lang: Lang;
}) {
  const ar = lang === "ar";
  const tabs = [
    { id: "home" as Screen, icon: <Home size={20} />, label: ar ? "الرئيسية" : "Home" },
    { id: "menu" as Screen, icon: <UtensilsCrossed size={20} />, label: ar ? "القائمة" : "Menu" },
    { id: "cart" as Screen, icon: <ShoppingCart size={20} />, label: ar ? "الطلب" : "Order" },
    { id: "info" as Screen, icon: <Info size={20} />, label: ar ? "معلومات" : "Info" },
  ];
  return (
    <div
      className="shrink-0 flex items-center border-t"
      style={{
        background: "#fff",
        borderColor: "#E6DED2",
        boxShadow: "0 -4px 20px rgba(74,52,40,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {tabs.map((tab) => {
        const active = screen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative transition-all"
            style={{ color: active ? "#2E5E4E" : "#9B8A7A" }}
          >
            <div className="relative">
              {tab.icon}
              {tab.id === "cart" && cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center font-poppins text-[9px] font-bold text-white"
                  style={{ background: "#C89B3C" }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span
              className="font-poppins leading-none"
              style={{ fontSize: 9, fontWeight: active ? 600 : 400 }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ background: "#2E5E4E" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function DesktopWebsite({ lang, onLangToggle, cart, onAddToCart, onItemSelect, onUpdateQty, onRemove }: {
  lang: Lang; onLangToggle: () => void; cart: CartItem[]; onAddToCart: (item: MenuItem) => void;
  onItemSelect: (item: MenuItem) => void; onUpdateQty: (id: number, delta: number) => void; onRemove: (id: number) => void;
}) {
  const ar = lang === "ar";
  const [activeCat, setActiveCat] = useState("cold-mezze");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const query = search.trim().toLowerCase();
  const items = MENU.filter((item) => query ? item.name.toLowerCase().includes(query) || item.nameAr.includes(search.trim()) : item.category === activeCat);
  const cartCount = cart.reduce((sum, entry) => sum + entry.qty, 0);
  const cartTotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="desktop-site min-h-screen bg-[#F8F4EC] text-[#4A3428]" dir={ar ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-40 border-b border-[#E6DED2] bg-[#F8F4EC]/95 backdrop-blur-xl">
        <div className="site-container flex h-20 items-center justify-between gap-8">
          <button onClick={() => scrollTo("home")} aria-label="Arzé home"><Logo /></button>
          <nav className="flex items-center gap-8 text-sm font-medium"><button onClick={() => scrollTo("home")}>Home</button><button onClick={() => scrollTo("menu")}>Menu</button><button onClick={() => scrollTo("about")}>About</button><button onClick={() => scrollTo("contact")}>Contact</button></nav>
          <div className="flex items-center gap-3"><button onClick={onLangToggle} className="rounded-full border border-[#D8CDBE] bg-white px-4 py-2 text-xs font-semibold text-[#2E5E4E]">{ar ? "EN" : "EN | عربي"}</button><button onClick={() => setCartOpen(true)} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#2E5E4E] text-white shadow-lg" aria-label="Open order summary"><ShoppingCart size={18} />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C89B3C] px-1 text-[10px] font-bold">{cartCount}</span>}</button></div>
        </div>
      </header>
      <main>
        <section id="home" className="relative overflow-hidden"><div className="cedar-pattern absolute inset-0 opacity-[.035]" /><div className="site-container relative grid min-h-[680px] grid-cols-2 items-center gap-16 py-20">
          <div className="max-w-xl"><div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.24em] text-[#758E67]"><span className="h-px w-10 bg-[#C89B3C]" />From Tyre, Lebanon</div><h1 className="font-playfair text-6xl font-bold leading-[1.05] text-[#2E5E4E]">Arzé <span className="font-cairo text-5xl text-[#4A3428]">| أرزة</span></h1><p className="mt-4 font-playfair text-3xl italic text-[#C89B3C]">Taste of Lebanon</p><h2 className="mt-7 max-w-lg font-playfair text-4xl font-semibold leading-tight">Experience authentic Lebanese cuisine from Tyre</h2><p className="mt-5 max-w-lg text-base leading-8 text-[#78675D]">A generous table of colourful mezze, charcoal-grilled favourites, and family recipes prepared with honest Lebanese hospitality.</p><p className="mt-4 text-sm font-semibold uppercase tracking-[.18em] text-[#758E67]">Scan. Browse. View prices.</p><div className="mt-9 flex gap-4"><button onClick={() => scrollTo("menu")} className="flex items-center gap-2 rounded-full bg-[#2E5E4E] px-7 py-3.5 font-semibold text-white shadow-xl">Explore Menu <ArrowRight size={17} /></button><a href="tel:1698" className="flex items-center gap-2 rounded-full border border-[#D8CDBE] bg-white px-7 py-3.5 font-semibold text-[#2E5E4E]"><Phone size={17} /> Call 1698</a></div></div>
          <div className="relative"><div className="absolute -left-8 -top-8 h-36 w-36 rounded-full border border-[#C89B3C]/30" /><div className="absolute -bottom-7 -right-7 h-48 w-48 rounded-full bg-[#758E67]/15" /><div className="relative overflow-hidden rounded-[2.5rem] border-[10px] border-white shadow-[0_30px_70px_rgba(74,52,40,.2)]"><img src={img("photo-1544025162-d76694265947", 900, 760)} alt="Lebanese mezze table" className="h-[540px] w-full object-cover" /><div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 p-4 shadow-xl"><div className="flex items-center gap-3"><CedarIcon size={30} className="text-[#2E5E4E]" /><div><strong className="block font-playfair text-lg">Made to share</strong><span className="text-xs text-[#78675D]">Fresh every day</span></div></div></div></div></div>
        </div></section>
        <section className="bg-[#2E5E4E] py-8 text-white"><div className="site-container grid grid-cols-3 divide-x divide-white/15">{[{ icon: <Globe />, title: "Bilingual menu", text: "Browse comfortably in English or Arabic" }, { icon: <Tag />, title: "Clear prices", text: "View prices and calculate your total" }, { icon: <Phone />, title: "Simple ordering", text: "Call 1698 or order inside the restaurant" }].map((feature) => <div key={feature.title} className="flex items-center justify-center gap-4 px-8"><span className="text-[#DDB65D]">{feature.icon}</span><div><strong className="font-playfair text-lg">{feature.title}</strong><p className="mt-1 text-xs text-white/65">{feature.text}</p></div></div>)}</div></section>
        <section id="menu" className="py-24"><div className="site-container"><div className="flex items-end justify-between gap-8"><div><span className="text-xs font-bold uppercase tracking-[.22em] text-[#C89B3C]">Our menu</span><h2 className="mt-3 font-playfair text-5xl font-bold text-[#2E5E4E]">A Lebanese table for everyone</h2><p className="mt-4 text-sm text-[#78675D]">Browse the menu and add your favourites to the table order.</p></div><div className="flex w-full max-w-sm items-center gap-3 rounded-full border border-[#E6DED2] bg-white px-5 py-3.5 shadow-sm"><Search size={17} className="text-[#758E67]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dishes…" className="w-full bg-transparent text-sm outline-none" />{search && <button onClick={() => setSearch("")}><X size={15} /></button>}</div></div>
          {!query && <div className="category-row mt-10 flex gap-2 overflow-x-auto pb-3">{CATEGORIES.map((category) => <button key={category.id} onClick={() => setActiveCat(category.id)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${activeCat === category.id ? "border-[#2E5E4E] bg-[#2E5E4E] text-white shadow-md" : "border-[#E6DED2] bg-white hover:border-[#C89B3C]"}`}>{category.name}</button>)}</div>}
          <div className="menu-grid mt-8 grid grid-cols-2 gap-5 xl:grid-cols-3">{items.map((item) => { const inCart = cart.find((entry) => entry.item.id === item.id); return <article key={item.id} onClick={() => onItemSelect(item)} className="menu-card group cursor-pointer overflow-hidden rounded-3xl border border-[#E6DED2] bg-white"><div className={`relative h-56 overflow-hidden ${isDrinkItem(item) ? "bg-[#F8F4EC] p-4" : ""}`}><img src={img(item.photo, 560, 360)} alt={item.name} className={`h-full w-full transition duration-500 ${isDrinkItem(item) ? "object-contain object-center" : "object-cover group-hover:scale-105"}`} loading="lazy" />{item.badge && <div className="absolute left-4 top-4"><Badge type={item.badge} /></div>}</div><div className="p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-playfair text-xl font-bold">{ar ? item.nameAr : item.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8A786C]">{ar ? item.descAr : item.desc}</p></div><span className="shrink-0 text-lg font-bold text-[#C89B3C]">${item.price.toFixed(2)}</span></div><div className="mt-5 flex items-center justify-between"><button className="text-xs font-semibold text-[#758E67]">View details</button><button onClick={(event) => { event.stopPropagation(); onAddToCart(item); }} className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#2E5E4E] px-3 text-white">{inCart ? <span className="text-xs font-bold">{inCart.qty}</span> : <Plus size={17} />}</button></div></div></article>; })}</div>{items.length === 0 && <div className="py-20 text-center text-[#8A786C]">No dishes matched your search.</div>}
        </div></section>
        <section id="about" className="bg-white py-24"><div className="site-container grid grid-cols-2 items-center gap-20"><div className="grid grid-cols-2 gap-4"><img src={img("photo-1504674900247-0877df9cc836", 500, 620)} alt="Lebanese dining" className="h-[430px] w-full rounded-[2rem] object-cover" /><img src={img("photo-1529692236671-f1f6cf9683ba", 500, 620)} alt="Fresh Lebanese food" className="mt-12 h-[430px] w-full rounded-[2rem] object-cover" /></div><div><span className="text-xs font-bold uppercase tracking-[.22em] text-[#C89B3C]">Our story</span><h2 className="mt-3 font-playfair text-5xl font-bold text-[#2E5E4E]">About Arzé</h2><p className="mt-6 text-base leading-8 text-[#78675D]">Named after Lebanon’s beloved cedar, Arzé brings the spirit of a shared Lebanese table to the coast of Tyre. Our menu celebrates familiar recipes, seasonal produce, and the simple joy of food made for gathering.</p><div className="mt-8 flex gap-10"><div><strong className="font-playfair text-3xl text-[#C89B3C]">13</strong><span className="block text-xs text-[#78675D]">Menu categories</span></div><div><strong className="font-playfair text-3xl text-[#C89B3C]">60+</strong><span className="block text-xs text-[#78675D]">Fresh dishes</span></div></div></div></div></section>
        <section id="contact" className="py-24"><div className="site-container grid grid-cols-[1.1fr_.9fr] overflow-hidden rounded-[2.5rem] bg-[#2E5E4E] text-white shadow-xl"><div className="p-14"><span className="text-xs font-bold uppercase tracking-[.22em] text-[#DDB65D]">Visit us</span><h2 className="mt-3 font-playfair text-4xl font-bold">Your table is waiting</h2><div className="mt-9 grid grid-cols-2 gap-8 text-sm"><div className="flex gap-3"><MapPin className="text-[#DDB65D]" /><div><strong>Location</strong><p className="mt-2 leading-6 text-white/65">Main Street, Tyre<br />South Lebanon</p></div></div><div className="flex gap-3"><Clock className="text-[#DDB65D]" /><div><strong>Opening hours</strong><p className="mt-2 leading-6 text-white/65">Open daily<br />8:00 AM – 2:00 AM</p></div></div><div className="flex gap-3"><Phone className="text-[#DDB65D]" /><div><strong>Order by phone</strong><p className="mt-2 text-white/65">1698</p></div></div></div></div><div className="relative min-h-[400px] bg-[#758E67]"><div className="absolute inset-5 flex items-center justify-center rounded-[2rem] border border-white/20"><div className="text-center"><MapPin size={40} className="mx-auto text-[#DDB65D]" /><strong className="mt-4 block font-playfair text-2xl">Main Street, Tyre</strong><span className="mt-2 block text-xs text-white/60">South Lebanon</span><button className="mt-5 rounded-full border border-white/30 px-5 py-2 text-xs font-semibold">View on Maps</button></div></div></div></div></section>
      </main>
      <footer className="bg-[#263F36] py-12 text-white"><div className="site-container flex items-center justify-between"><Logo light /><p className="text-center text-xs leading-6 text-white/50">© 2026 Arzé Restaurant, Tyre.<br /><span className="text-white/75">Made by Fatima Ghannam</span></p><div className="flex gap-3"><Instagram size={18} /><Facebook size={18} /></div></div></footer>
      {cartOpen && <div className="fixed inset-0 z-50 flex justify-end bg-[#1D2E28]/45 backdrop-blur-sm" onClick={() => setCartOpen(false)}><aside className="h-full w-full max-w-md overflow-y-auto bg-[#F8F4EC] p-7 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><div><span className="text-xs font-bold uppercase tracking-widest text-[#C89B3C]">Your selections</span><h2 className="font-playfair text-3xl font-bold text-[#2E5E4E]">Cart total</h2></div><button onClick={() => setCartOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white"><X size={18} /></button></div>{cart.length === 0 ? <div className="py-24 text-center"><ShoppingCart className="mx-auto text-[#C8BBAA]" size={38} /><p className="mt-4 text-sm text-[#8A786C]">Add dishes to calculate your total.</p></div> : <><div className="mt-8 space-y-3">{cart.map((entry) => <div key={entry.item.id} className="flex gap-3 rounded-2xl border border-[#E6DED2] bg-white p-3"><img src={img(entry.item.photo, 90, 90)} alt="" className="h-20 w-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><strong className="truncate text-sm">{entry.item.name}</strong><button onClick={() => onRemove(entry.item.id)}><Trash2 size={14} /></button></div><span className="mt-1 block text-xs font-bold text-[#C89B3C]">${(entry.item.price * entry.qty).toFixed(2)}</span><div className="mt-2 flex items-center gap-3"><button onClick={() => onUpdateQty(entry.item.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0EBE3]"><Minus size={13} /></button><span className="text-xs font-bold">{entry.qty}</span><button onClick={() => onUpdateQty(entry.item.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2E5E4E] text-white"><Plus size={13} /></button></div></div></div>)}</div><div className="mt-8 border-t border-[#E6DED2] pt-6"><div className="flex justify-between font-bold"><span>Total</span><span className="text-xl text-[#C89B3C]">${cartTotal.toFixed(2)}</span></div><p className="mt-5 rounded-xl bg-white p-3 text-center text-xs leading-5 text-[#78675D]">This cart is for total calculation only. To order, please call 1698 or order inside the restaurant.</p><a href="tel:1698" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#2E5E4E] py-4 font-semibold text-white"><Phone size={17} />Order by Phone: 1698</a></div></>}</aside></div>}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [lang, setLang] = useState<Lang>("en");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  function addToCart(item: MenuItem, qty = 1, notes = "") {
    setCart((prev) => {
      const exists = prev.find((c) => c.item.id === item.id);
      if (exists) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, qty: c.qty + qty, notes: notes || c.notes } : c
        );
      }
      return [...prev, { item, qty, notes }];
    });
  }

  function updateQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => (c.item.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  }

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const phoneContent = (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: "#F8F4EC",
        height: "100%",
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}
    >
      <div className="flex-1 overflow-hidden relative">
        {screen === "home" && (
          <div className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <HomeScreen onNavigate={setScreen} lang={lang} />
          </div>
        )}
        {screen === "menu" && (
          <div className="absolute inset-0 flex flex-col overflow-hidden">
            <MenuScreen
              lang={lang}
              onLangToggle={() => setLang((l) => (l === "en" ? "ar" : "en"))}
              onItemSelect={setSelectedItem}
              cart={cart}
              onAddToCart={(item) => addToCart(item)}
            />
          </div>
        )}
        {screen === "cart" && (
          <div className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <CartScreen
              cart={cart}
              lang={lang}
              onUpdateQty={updateQty}
              onRemove={(id) => setCart((p) => p.filter((c) => c.item.id !== id))}
              onClear={() => setCart([])}
            />
          </div>
        )}
        {screen === "info" && (
          <div className="absolute inset-0">
            <InfoScreen lang={lang} />
          </div>
        )}
      </div>
      <BottomNav screen={screen} onNavigate={setScreen} cartCount={cartCount} lang={lang} />

      {/* Item Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          lang={lang}
          onClose={() => setSelectedItem(null)}
          onAdd={(item, qty, notes) => {
            addToCart(item, qty, notes);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: full screen */}
      <div className="md:hidden w-full h-full">{phoneContent}</div>

      {/* Tablet and desktop: full responsive restaurant website */}
      <div className="hidden md:block">
        <DesktopWebsite
          lang={lang}
          onLangToggle={() => setLang((current) => current === "en" ? "ar" : "en")}
          cart={cart}
          onAddToCart={(item) => addToCart(item)}
          onItemSelect={setSelectedItem}
          onUpdateQty={updateQty}
          onRemove={(id) => setCart((current) => current.filter((entry) => entry.item.id !== id))}
        />
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            lang={lang}
            onClose={() => setSelectedItem(null)}
            onAdd={(item, qty, notes) => {
              addToCart(item, qty, notes);
              setSelectedItem(null);
            }}
          />
        )}
      </div>

      {/* Legacy showcase retained in source for reference, no longer rendered */}
      <div
        className="hidden items-center justify-center w-full h-full"
        style={{
          background: "linear-gradient(135deg, #2E5E4E 0%, #3d7a64 40%, #4A3428 100%)",
          minHeight: "100vh",
        }}
      >
        {/* Decorative Arabic pattern background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 0l3.09 9.51L42 6l-6 7.74L46 18l-10.15.22L39 28l-9-3 .5 9.5-8.5-5-8.5 5 .5-9.5-9 3 3.15-9.78L8 18l10-4.26L12 6l8.91 3.51z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="flex items-start gap-12 relative z-10">
          {/* Left copy */}
          <div className="text-white max-w-xs hidden lg:block pt-12">
            <div className="flex items-center gap-3 mb-6">
              <CedarIcon size={40} className="text-white opacity-80" />
              <div>
                <div className="font-playfair font-bold text-2xl">Arzé</div>
                <div className="font-cairo text-sm opacity-70">أرزة</div>
              </div>
            </div>
            <h1 className="font-playfair font-bold text-3xl leading-snug mb-4">
              Arzé | أرزة<br /><span style={{ color: "#DDB65D" }}>Taste of Lebanon</span>
            </h1>
            <p className="font-poppins text-sm opacity-70 leading-relaxed mb-6">
              Experience authentic Lebanese cuisine from Tyre. Scan, browse, and order at your own pace.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "63 menu items across 13 categories",
                "Arabic & English language support",
                "Cart total calculator",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(200,155,60,0.3)", color: "#C89B3C" }}
                  >
                    <Check size={11} />
                  </div>
                  <span className="font-poppins text-xs opacity-80">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone frame */}
          <div
            className="relative shrink-0"
            style={{
              width: 393,
              height: 852,
              background: "#1a1a1a",
              borderRadius: 50,
              padding: "12px 8px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 2px #2a2a2a",
            }}
          >
            {/* Notch */}
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
              style={{ width: 120, height: 32, background: "#1a1a1a", borderRadius: 20 }}
            >
              <div style={{ width: 12, height: 12, background: "#2a2a2a", borderRadius: "50%", marginRight: 6 }} />
              <div style={{ width: 60, height: 6, background: "#2a2a2a", borderRadius: 10 }} />
            </div>
            {/* Screen */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 42,
                overflow: "hidden",
                background: "#F8F4EC",
              }}
            >
              {phoneContent}
            </div>
            {/* Side buttons */}
            <div
              className="absolute"
              style={{ left: -3, top: 100, width: 3, height: 32, background: "#333", borderRadius: "4px 0 0 4px" }}
            />
            <div
              className="absolute"
              style={{ left: -3, top: 145, width: 3, height: 64, background: "#333", borderRadius: "4px 0 0 4px" }}
            />
            <div
              className="absolute"
              style={{ left: -3, top: 220, width: 3, height: 64, background: "#333", borderRadius: "4px 0 0 4px" }}
            />
            <div
              className="absolute"
              style={{ right: -3, top: 160, width: 3, height: 96, background: "#333", borderRadius: "0 4px 4px 0" }}
            />
          </div>

          {/* Right copy */}
          <div className="text-white max-w-xs hidden lg:block pt-12">
            <div className="font-poppins text-xs uppercase tracking-widest opacity-50 mb-4">
              Restaurant Features
            </div>
            <div className="flex flex-col gap-3">
              {[
                { icon: "🍽️", title: "Full Digital Menu", desc: "13 categories, 63+ dishes" },
                { icon: "🌐", title: "Bilingual", desc: "Arabic & English" },
                { icon: "🛒", title: "Total Calculator", desc: "Review selections and prices" },
                { icon: "☎", title: "Order by Phone", desc: "Call 1698 or visit us" },
                { icon: "📍", title: "Location & Hours", desc: "Tyre, Lebanon" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <span className="text-xl">{f.icon}</span>
                  <div>
                    <div className="font-poppins font-semibold text-sm">{f.title}</div>
                    <div className="font-poppins text-xs opacity-60">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
