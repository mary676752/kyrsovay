import {INITIAL,parseStored,filterItems,addItem} from './utils.js';
const KEY='markupflow-items-v1';
const $=id=>document.getElementById(id);
let items=parseStored(localStorage.getItem(KEY));
const names={layout:'Макет',forms:'Формы',navigation:'Навигация'};
function card(item){
  const article=document.createElement('article');article.className='card';
  const badge=document.createElement('span');badge.className='tag';badge.textContent=names[item.category];
  const heading=document.createElement('h3');heading.textContent=item.title;
  const description=document.createElement('p');description.textContent=item.description;
  article.append(badge,heading,description);return article;
}
function render(){
  const visible=filterItems(items,$('search').value,$('category').value);
  $('cards').replaceChildren(...visible.map(card));
  $('counter').textContent=`Показано ${visible.length} из ${items.length}`;
  $('empty').hidden=visible.length!==0;
}
$('search').addEventListener('input',render);
$('category').addEventListener('change',render);
$('add-form').addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.currentTarget).entries());
  const result=addItem(items,data);
  if(!result.ok){$('form-status').textContent=result.error;return;}
  items=result.items;
  try{localStorage.setItem(KEY,JSON.stringify(items));$('form-status').textContent='Компонент добавлен';}
  catch{$('form-status').textContent='Компонент добавлен, но не сохранён в браузере';}
  event.currentTarget.reset();$('search').value='';$('category').value='all';render();
});
render();
