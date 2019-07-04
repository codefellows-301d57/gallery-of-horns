'use strict';
/*global $ */

//Globals
const allImagesArr = [];
const keywordArr = [];
const hornsArr = [];
const sortByArr = ['title', 'horns'];
let sortedImgArr = [];

const Images = function(image_url, title, description, keyword, horns){
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allImagesArr.push(this);
};

Images.prototype.renderImgs = function() {
  const $newImg = $('<section></section>').attr({'alt': this.keyword, 'name': this.title, 'data-flavor': this.horns});
  const imgTemplateHtml = $('#photo-template').html();

  //Inserts html into the element / Returns the $newImg jquery Obj
  $newImg.html(imgTemplateHtml);
  // $newImg.html();

  //Gets our HTML elements
  $newImg.find('h2').text(this.title);
  $newImg.find('h2').attr({
    'alt': this.keyword,
    'name': this.title,
    'data-flavor': this.horns
  });
  $newImg.find('img').attr({
    'src': this.image_url,
    'alt': this.keyword,
    'data-flavor': this.horns
  });
  $newImg.find('p').text(this.description);
  $newImg.find('p').attr({
    'alt': this.keyword,
    'data-flavor': this.horns
  });

  $('main').append($newImg);
};

const sorter = () => {
  sortedImgArr = allImagesArr.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
  sortedImgArr.forEach(titleSort => {
    // titleSort.renderImgs();
    console.log(titleSort);
  })
};

const optionMaker = (idName, arr) => {
  $.each(arr, (index, text) => {
    $(idName).append(
      $('<option></option>').html(text).attr('value', text)
    );
  });
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

  allImagesArr.forEach(hornImage => {
    hornImage.renderImgs();
  });

  optionMaker('#keywordFilter', keywordArr);
  optionMaker('#imgFilter', hornsArr);
  optionMaker('#sortFilter', sortByArr);
}

//Filters by Keyword
$('select[name="keywordFilter"]').on('change', function(){
  let $selection = $(this).val();
  $('section').hide();
  $('h2').hide();
  $('img').hide();
  $('p').hide();

  $(`section[alt="${$selection}"]`).show();
  $(`h2[alt="${$selection}"]`).show();
  $(`img[alt="${$selection}"]`).show();
  $(`p[alt="${$selection}"]`).show();
});

//Filters by Number of Horns
$('select[name="imgFilter"]').on('change', function(){
  let $selection = $(this).val();
  $('section').hide();
  $('h2').hide();
  $('img').hide();
  $('p').hide();

  $(`section[data-flavor="${$selection}"]`).show();
  $(`h2[data-flavor="${$selection}"]`).show();
  $(`img[data-flavor="${$selection}"]`).show();
  $(`p[data-flavor="${$selection}"]`).show();
});

$('select[name="sortFilter"]').on('change', function(){
  let $selection = $(this).val();
  console.log($selection);
  if($selection === 'title'){
    sorter();
    $('section').hide();
    $('h2').hide();
    $('img').hide();
    $('p').hide();

    $('section').show();
    $('h2').show();
    $('img').show();
    $('p').show();
  }
})

$('button[name="resetButton"]').click(function(){
  location.reload();
});

//Renders Img to DOM
Images.getAllImagesFromFile = function(){
  const filePath = 'data/page-1.json';
  const fileType = 'json';

  $.get(filePath, fileType).then(initializer);
};

// Hide empty section within main
$('#photo-template').hide();

Images.getAllImagesFromFile();
