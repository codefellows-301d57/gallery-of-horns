'use strict';
/*global $ */

//Globals
const allImagesArr = [];

const Images = function(image_url, title, description, keyword, horns){
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allImagesArr.push(this);
};

Images.prototype.renderImgs = function (){
  const $newImg = $('<section></section>');
  const imgTemplateHtml = $('#photo-template').html();

  //Inserts html into the element / Returns the $newImg jquery Obj
  $newImg.html(imgTemplateHtml);

  //Gets our HTML elements
  $newImg.find('h2').text(this.title);
  $newImg.find('h2').attr({
    'alt': this.keyword,
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

//Renders Img to DOM
Images.getAllImagesFromFile = function(){
  const filePath = '/data/page-1.json';
  const fileType = 'json';

  $.get(filePath, fileType).then(imageJSON => {
    imageJSON.forEach(hornImage => {
      new Images(hornImage.image_url, hornImage.title, hornImage.description, hornImage.keyword, hornImage.horns);
    });

    allImagesArr.forEach(hornImage => {
      hornImage.renderImgs();
    });
  });
};

//Filters by Keyword
$('select[name="keywordFilter"]').on('change', function(){
  let $selection = $(this).val();
  $('h2').hide();
  $('img').hide();
  $('p').hide();

  $(`h2[alt="${$selection}"]`).show();
  $(`img[alt="${$selection}"]`).show();
  $(`p[alt="${$selection}"]`).show();
});

//Filters by Number of Horns
$('select[name="imgFilter"]').on('change', function(){
  let $selection = $(this).val();
  $('h2').hide();
  $('img').hide();
  $('p').hide();

  $(`h2[data-flavor="${$selection}"]`).show();
  $(`img[data-flavor="${$selection}"]`).show();
  $(`p[data-flavor="${$selection}"]`).show();
});

Images.getAllImagesFromFile();
