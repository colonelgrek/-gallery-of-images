'use strict';

class ImgList {
  constructor(selector, numPage) {
    this.selector = selector;
    this.arrImg = [];
    this.numPage = numPage;
    this._getPicture()
      .then(obj => {
        this.arrImg = [...obj];
        this.init();
      })
  }

  _getPicture() {
    return fetch(`https://picsum.photos/v2/list?page=${this.numPage}&limit=11`)
            .then(response => response.json())
  }

  init() {
    let gallery = document.querySelector(this.selector);
    let layout = `<ul class="gallery__list">`;

    for (let i = 0; i < this.arrImg.length; i++) {
      layout += this.renderItem(this.arrImg[i], i+1);
    }
    layout += `</ul>`;
    gallery.insertAdjacentHTML('beforeend', layout);

    let images = document.querySelectorAll('.gallery__item-small');
    images.forEach((image) => {
      image.addEventListener('click', (event) => {
        gallery.insertAdjacentHTML('afterend', this.renderLightBox(event.target.getAttribute('id'), event.target.getAttribute('data-author')));
        this.likes();
        this.comments();
        this.remover();
      })
    })
  }

  renderItem(item, i) {
    return `<li class = "gallery__item-small gallery__item_${i}">
      <img class = "gallery__img" src = "https://picsum.photos/id/${item.id}/400" alt = "picture with id ${item.id}" width ="100" id = "${item.id}" data-author = "${item.author}">
      </li>`
  }

  renderLightBox(id, author) {
    return `<section class="picture">
      <h2 class="visually-hidden">picture</h2>
      <div class="picture__wrap">
        <img class="picture__img" src="https://picsum.photos/id/${id}/1000" alt="picture with id ${id}">
        <div class="picture__likes-author">
          <button class="picture__likes likes" type="button">
            <span class="likes__number">71</span></button>
          <p class="picture__author">Author: ${author}</p>
        </div>
        <div class="picture__comments comments">
          <h2 class="comments__title">Comments</h2>
          <ol class="comments__list">
          </ol>
          <form action="#" method="post" class="comments__form">
            <div class="comments__inner">
              <input type="text" class="comments__input" id="comments__input" required>
              <label class="comments__input-label" for="comments__input">Your comment</label>
            </div>
            <button class="comments__button" type="submit">submit</button>
          </form>
        </div>
      </div>
    </section>`
  }

  remover() {
    let picture = document.querySelector('.picture');
    let pictureImg = document.querySelector('.picture__img');
    pictureImg.addEventListener('click', () => {
      picture.remove();
    })
  }

  likes() {
    let likesBtn = document.querySelector('.likes');

    likesBtn.addEventListener("click", () => {
      if (likesBtn.classList.contains('like__active')) {
        likesBtn.lastChild.textContent--;
      } else {
        likesBtn.lastChild.textContent++;
      }
      likesBtn.classList.toggle('like__active');
    })
    let commentForm = document.querySelector('.comments__form');
    let commentList = document.querySelector('.comments__list');
    let commentField = document.querySelector('.comments__field');

    commentForm.onsubmit = function (event) {
      event.preventDefault();

      let newComment = document.createElement('li');
      newComment.classList.add('comments__item');
      newComment.textContent = commentField.value;
      commentField.value = '';
      commentList.append(newComment);
    };
  }

  comments() {
    let commentForm = document.querySelector('.comments__form');
    let commentList = document.querySelector('.comments__list');
    let commentField = document.querySelector('.comments__input');

    commentForm.onsubmit = function (event) {
      event.preventDefault();

      let newComment = document.createElement('li');
      newComment.classList.add('comments__item');
      newComment.textContent = commentField.value;
      commentField.value = '';
      commentList.append(newComment);
    };
  }
}

let initialGallery = new ImgList('.gallery', 0);
let numPage = 1;
let nextGallery = [];

let moreBtn = document.querySelector('.more');
moreBtn.addEventListener('click', ()=> {
  numPage++;
  nextGallery.push( new ImgList('.gallery', numPage) );
});