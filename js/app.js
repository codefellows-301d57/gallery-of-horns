'use strict';
/*global $  Handlebars*/

//Globals
const allImagesArr = [];
const keywordArr = ['Filter by Keyword'];
const hornsArr = ['Filter by Number of Horns'];
const sortByArr = ['Sort by', 'title', 'horns'];
let sortedImgArr = [];
const idGetter = ['#section-template', '#option-template'];
const optArr = [
  ['.keywordFilter', keywordArr],
  ['.imgFilter', hornsArr],
  ['.sortFilter', sortByArr]
];

const Images = function(image_url, title, description, keyword, horns){
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allImagesArr.push(this);
};

Images.prototype.renderImgs = function() {
  htmlSetter(idGetter[0], '.content-placeholder', allImagesArr);
};

const htmlSetter = (templateId, htmlClass, arr) => {
  let templateScript = $(templateId).html();
  let template = Handlebars.compile(templateScript);
  let compiledHTML = template(arr);
  $(htmlClass).html(compiledHTML);
};

const sorter = selection => {
  sortedImgArr = allImagesArr.sort((a,b) => {
    if(a[selection] < b[selection]) return -1;
    if(a[selection] > b[selection]) return 1;
    return 0;
  });
  sortedImgArr.forEach(titleSort => titleSort.renderImgs());
};

const initializer = imageJSON => {
  imageJSON.forEach(hornImage => {
    new Images(hornImage.image_url, hornImage.title, hornImage.description, hornImage.keyword, hornImage.horns);
    if(!keywordArr.includes(hornImage.keyword)){
      keywordArr.push(hornImage.keyword);
    }
    if(!hornsArr.includes(hornImage.horns)){
      hornsArr.push(hornImage.horns);
    }
  });
  optArr.forEach(value => htmlSetter(idGetter[1], value[0], value[1]));
  allImagesArr.forEach(hornImage => hornImage.renderImgs());
};

const hider = () => {
  $('section').hide();
  $('h2').hide();
  $('img').hide();
  $('p').hide();
};

const shower = tag => {
  $(`section${tag}`).show();
  $(`h2${tag}`).show();
  $(`img${tag}`).show();
  $(`p${tag}`).show();
};

const defaulter = (dDown1, dDown2) => {
  $(optArr[dDown1][0])[0].selectedIndex = 'default';
  $(optArr[dDown2][0])[0].selectedIndex = 'default';
};

//Filters by Keyword
$('select[class="keywordFilter"]').on('change', function(){
  let $selection = $(this).val();
  hider();
  shower(`[alt="${$selection}"]`);
  defaulter(1,2);
});

//Filters by Number of Horns
$('select[class="imgFilter"]').on('change', function(){
  let $selection = $(this).val();
  hider();
  shower(`[data-flavor="${$selection}"]`);
  defaulter(0,2);
});

$('select[class="sortFilter"]').on('change', function(){
  let $selection = $(this).val();
  $('main').empty();
  sorter($selection);
  $('section').show();
  $('h2').show();
  $('img').show();
  $('p').show();
  defaulter(0,1);
})

$('button[name="resetButton"]').click(function(){
  location.reload();
});

//Renders images to DOM
Images.getAllImagesFromFile = (fileName) => {
  const filePath = `${fileName}`;
  const fileType = 'json';
  $.get(filePath, fileType).then(initializer);
};

$('button[class="page-1"]').click(function(){
  allImagesArr.length = 0;
  $('main').empty();
  Images.getAllImagesFromFile('data/page-1.json')
});

$('button[class="page-2"]').click(function(){
  allImagesArr.length = 0;
  $('main').empty();
  Images.getAllImagesFromFile('data/page-2.json')
});
