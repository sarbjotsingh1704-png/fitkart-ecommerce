import featureTee from '../assets/product-feature-1.jpg';
import featureHoodie from '../assets/product-feature-2.jpg';
import featureShirt from '../assets/product-feature-3.jpg';
import featurePolo from '../assets/product-feature-4.jpg';
const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;
const IMGS = ['1521572163474-6864f9cf17ab','1503342217505-b0a15ec3261c','1434389677669-e08b4cac3105','1542291026-7eec264c27ff','1491553895911-0055eca6402d','1523275335684-37898b6baf30','1572635196237-14b3f281503f','1553062407-98eeb64c6a62','1512436991641-6745cdb1723f','1583743814966-8936f5b7be1a'];
const C = { Navy:'#1A365D', Black:'#111827', White:'#F3F4F6', Olive:'#6B705C', Sand:'#D6C6A8', Red:'#C0392B', Grey:'#9CA3AF', Tan:'#B08968', Blue:'#3B82F6', Rose:'#E8A2A2' };
const SZ = { c: ['S','M','L','XL','XXL'], s: ['6','7','8','9','10','11'], a: ['One Size'] };
const mk = (id, name, category, price, mrp, rating, reviews, cols, k, i, flags = {}) => ({
  id, name, category, price, mrp, rating, reviews, sizes: SZ[k], kind: k === 'c' ? 'clothing' : k === 's' ? 'footwear' : 'accessory',
  colors: cols.map((n) => ({ name: n, hex: C[n] })),
  images: [0, 1, 2].map((o) => u(IMGS[(i + o) % IMGS.length])),
  description: `${name} is designed for everyday comfort with a clean, modern cut that pairs easily with the rest of your wardrobe.`,
  material: k === 'c' ? '100% combed cotton, 220 GSM' : k === 's' ? 'Breathable mesh upper, EVA midsole, rubber outsole' : 'Premium blended materials with durable finish',
  stock: 4 + ((id * 7) % 36), added: id, popularity: reviews, ...flags,
});
export const products = [
  mk(1,'Essential Crew Tee','men',799,999,4.5,412,['White','Navy','Black'],'c',0,{bestSeller:true}),
  mk(2,'Heritage Fleece Hoodie','men',2199,2999,4.6,288,['Grey','Navy','Olive'],'c',1,{trending:true}),
  mk(3,'Tapered Chino Pants','men',1799,2299,4.3,164,['Sand','Olive','Navy'],'c',2,{isNew:true}),
  mk(4,'Oxford Button-Down Shirt','men',1499,1999,4.4,201,['White','Blue'],'c',9,{bestSeller:true}),
  mk(5,'Linen Wrap Dress','women',2499,3299,4.7,356,['Rose','Sand','Navy'],'c',8,{trending:true,isNew:true}),
  mk(6,'Ribbed Knit Top','women',999,1399,4.2,187,['Black','White','Rose'],'c',9,{bestSeller:true}),
  mk(7,'High-Rise Straight Jeans','women',2299,2999,4.5,320,['Blue','Black'],'c',2,{trending:true}),
  mk(8,'Oversized Cotton Shirt','women',1599,1999,4.3,142,['White','Sand'],'c',3,{isNew:true}),
  mk(9,'Court Classic Sneakers','shoes',3499,4499,4.6,540,['White','Black'],'s',4,{bestSeller:true,trending:true}),
  mk(10,'Aero Run Trainers','shoes',3999,5499,4.7,611,['Red','Grey','Navy'],'s',3,{trending:true}),
  mk(11,'City Knit Slip-Ons','shoes',2799,3499,4.1,98,['Grey','Black'],'s',4,{isNew:true}),
  mk(12,'Trail Hiker Sneakers','shoes',4299,5299,4.4,173,['Olive','Tan'],'s',3,{}),
  mk(13,'Minimal Analog Watch','accessories',2999,3999,4.5,230,['Black','Tan'],'a',5,{bestSeller:true}),
  mk(14,'Aviator Sunglasses','accessories',1299,1799,4.2,119,['Black','Tan'],'a',6,{trending:true}),
  mk(15,'Everyday Canvas Backpack','accessories',1899,2499,4.6,402,['Olive','Black','Navy'],'a',7,{bestSeller:true,isNew:true}),
  mk(16,'Woven Leather Belt','accessories',999,1299,4.0,76,['Tan','Black'],'a',5,{}),
];
export const CATEGORIES = [{ id:'men', label:'Men' },{ id:'women', label:'Women' },{ id:'shoes', label:'Sneakers' },{ id:'accessories', label:'Accessories' }];
export const reviews = [
  { name:'Aarav S.', rating:5, text:'FitMatch picked M and it was spot on. Quality feels premium for the price.' },
  { name:'Meera K.', rating:4, text:'Lovely fabric and fast delivery. Colour matched the photos.' },
  { name:'Rohan P.', rating:5, text:'Finally sneakers in the right size on the first try.' },
];

// Local editorial photos used for the featured products shown in the Shop reference.
products[0].images[0] = featureTee;
products[1].images[0] = featureHoodie;
products[3].images[0] = featureShirt;
products.push({ ...products[0], id:17, name:'Classic Polo T-Shirt', category:'men', price:899, mrp:1099, rating:4.6, reviews:356, colors:[{name:'Olive',hex:'#556B2F'},{name:'Navy',hex:'#1A365D'},{name:'Black',hex:'#111827'}], images:[featurePolo, ...products[0].images.slice(1)], description:'A versatile polo T-shirt with a clean collar and comfortable everyday fit.' });
