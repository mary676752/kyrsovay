/** Pure helpers for the MarkupFlow interface. No DOM or network access. */
export const CATEGORIES = Object.freeze(['all', 'layout', 'forms', 'navigation']);
export const INITIAL = Object.freeze([
  {id: 1, title:'Сетка карточек', category:'layout', description:'Адаптивная сетка CSS Grid'},
  {id: 2, title:'Форма обратной связи', category:'forms', description:'Доступные поля формы HTML'},
  {id: 3, title:'Верхнее меню', category:'navigation', description:'Навигация с якорными ссылками'},
  {id: 4, title:'Галерея работ', category:'layout', description:'Карточки с Flexbox'},
  {id: 5, title:'Поиск материалов', category:'forms', description:'Поле поиска и проверка ввода'},
  {id: 6, title:'Меню разделов', category:'navigation', description:'Семантический элемент nav'}
]);
export function normalize(value) {
  return String(value ?? '').trim().toLocaleLowerCase('ru');
}
export function validateItem(input) {
  if (!input || typeof input !== 'object') return {ok:false, error:'Нет данных'};
  const title=String(input.title??'').trim();
  const description=String(input.description??'').trim();
  if (title.length<3 || title.length>60) return {ok:false,error:'Название: от 3 до 60 символов'};
  if (description.length<8 || description.length>240) return {ok:false,error:'Описание: от 8 до 240 символов'};
  if (!CATEGORIES.slice(1).includes(input.category)) return {ok:false,error:'Неверная категория'};
  return {ok:true,item:{title,description,category:input.category}};
}
export function filterItems(items, search='', category='all') {
  const term=normalize(search);
  if (!CATEGORIES.includes(category)) throw new RangeError('Неизвестная категория');
  return items.filter(item => (category==='all'||item.category===category) &&
    normalize(item.title+' '+item.description).includes(term));
}
export function nextId(items) {
  return Math.max(0,...items.map(x=>Number(x.id)||0))+1;
}
export function addItem(items, input) {
  const checked=validateItem(input);
  if (!checked.ok) return checked;
  return {ok:true,items:[...items,{id:nextId(items),...checked.item}]};
}
export function parseStored(raw) {
  if (!raw) return [...INITIAL];
  try {
    const parsed=JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...INITIAL];
    const valid=parsed.filter(x=> Number.isInteger(x.id) && x.id>0 && validateItem(x).ok);
    return valid.length ? valid.map(x=>({id:x.id,...validateItem(x).item})) : [...INITIAL];
  } catch {return [...INITIAL];}
}
export function countByCategory(items) {
  return Object.fromEntries(CATEGORIES.slice(1).map(cat=>[cat,items.filter(x=>x.category===cat).length]));
}
