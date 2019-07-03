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

  //Gets out HTML elements
  $newImg.find('h2').text(this.title);
  $newImg.find('img').attr({
    'src': this.image_url,
    'alt': this.keyword
  });
  $newImg.find('p').text(this.description);

  $('main').append($newImg);

};

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

Images.getAllImagesFromFile();
