// Lule Balkan Kitchen: THE MENU. Edit this file to change dishes, prices and photos; the page builds the menu tabs
// and the takeaway list from it. Nothing else needs to change.
//
// Each category: id (one word), name { en, sq }, items [...]
// Each item:
//   name  { en, sq }   dish name in both languages
//   desc  { en, sq }   one short line
//   price             number in euros, e.g. 6 or 2.5   (the prices below are SAMPLE prices, demo data)
//   image             'img/<file>'  [TODO: replace each placeholder with a real photo of the dish, ~480 px square, under 60 KB]
//   takeaway          true = it also shows in the takeaway / delivery order list
//   veg               true = vegetarian badge

export const MENU = [
  { id: 'starters', name: { en: 'Starters', sq: 'Antipasta' }, items: [
    { name: { en: 'Spinach byrek', sq: 'Byrek me spinaq' }, desc: { en: 'Flaky hand-rolled pastry, spinach and gjizë curd.', sq: 'Petë e hapur me dorë, spinaq dhe gjizë.' }, price: 6, image: 'img/dish-starter.svg', takeaway: true, veg: true },
    { name: { en: 'Peppers with gjizë', sq: 'Speca me gjizë' }, desc: { en: 'Roasted peppers filled with curd cheese and herbs.', sq: 'Speca të pjekur të mbushur me gjizë dhe erëza.' }, price: 7, image: 'img/dish-starter.svg', veg: true },
    { name: { en: 'Meze board', sq: 'Pjatë meze' }, desc: { en: 'Olives, white cheese, pickles and warm bread for two.', sq: 'Ullinj, djathë i bardhë, turshi dhe bukë e ngrohtë për dy.' }, price: 12, image: 'img/dish-starter.svg', veg: true },
  ] },
  { id: 'mains', name: { en: 'Mains', sq: 'Pjata kryesore' }, items: [
    { name: { en: 'Tavë kosi', sq: 'Tavë kosi' }, desc: { en: 'Lamb baked in yoghurt and egg in a clay dish.', sq: 'Mish qengji i pjekur me kos dhe vezë në tavë balte.' }, price: 16, image: 'img/dish-main.svg', takeaway: true },
    { name: { en: 'Grilled qofte', sq: 'Qofte të skarës' }, desc: { en: 'Charcoal meatballs, raw onion, bread and ajvar.', sq: 'Qofte në qymyr, qepë e freskët, bukë dhe ajvar.' }, price: 13, image: 'img/dish-main.svg', takeaway: true },
    { name: { en: 'Fërgesë', sq: 'Fërgesë' }, desc: { en: 'Peppers, tomato and gjizë baked until bubbling.', sq: 'Speca, domate dhe gjizë të pjekura deri sa të ziejnë.' }, price: 12, image: 'img/dish-main.svg', takeaway: true, veg: true },
    { name: { en: 'Mixed grill for two', sq: 'Skarë e përzier për dy' }, desc: { en: 'Qofte, lamb, chicken and village sausage.', sq: 'Qofte, qengj, pulë dhe sallam fshati.' }, price: 32, image: 'img/dish-main.svg' },
  ] },
  { id: 'desserts', name: { en: 'Desserts', sq: 'Ëmbëlsira' }, items: [
    { name: { en: 'Baklava', sq: 'Bakllava' }, desc: { en: 'Walnut layers in honey syrup.', sq: 'Shtresa me arra në shurup mjalti.' }, price: 6, image: 'img/dish-dessert.svg', takeaway: true, veg: true },
    { name: { en: 'Trileçe', sq: 'Trileçe' }, desc: { en: 'Three-milk sponge with caramel.', sq: 'Pandispanjë me tre lloj qumështi dhe karamel.' }, price: 6, image: 'img/dish-dessert.svg', takeaway: true, veg: true },
    { name: { en: 'Kadaif', sq: 'Kadaif' }, desc: { en: 'Crisp pastry threads, walnuts and syrup.', sq: 'Fije brumi krokante, arra dhe shurup.' }, price: 6, image: 'img/dish-dessert.svg', veg: true },
  ] },
  { id: 'drinks', name: { en: 'Drinks', sq: 'Pije' }, items: [
    { name: { en: 'Mountain tea', sq: 'Çaj mali' }, desc: { en: 'Wild sideritis tea with honey on the side.', sq: 'Çaj mali me mjaltë anash.' }, price: 3, image: 'img/dish-drink.svg', veg: true },
    { name: { en: 'Dhallë', sq: 'Dhallë' }, desc: { en: 'Cold salted yoghurt drink.', sq: 'Pije e ftohtë kosi me pak kripë.' }, price: 3, image: 'img/dish-drink.svg', takeaway: true, veg: true },
    { name: { en: 'Albanian coffee', sq: 'Kafe turke' }, desc: { en: 'Small, strong and slow, with a glass of water.', sq: 'E vogël, e fortë dhe e ngadaltë, me një gotë ujë.' }, price: 2.5, image: 'img/dish-drink.svg', veg: true },
  ] },
]
