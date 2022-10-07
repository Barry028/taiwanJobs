document.addEventListener("DOMContentLoaded", function() {





  // let commentForm = document.querySelector('.comment-form');
  let commentList = document.querySelector('.t-panel-item-cnt');
  // let commentField = document.querySelector('.comment-field');
  // let charCounter = document.querySelector('.char-counter');
  // let submitButton = document.querySelector('.submit-button');
  // let nameInput = document.querySelector('.input-name');
  // let numberInput = document.querySelector('.input-number');

  var data;
  var counter;
  let del = document.querySelectorAll('.js-del');
  let edit = document.querySelectorAll('.js-edit');


  class Comment {
    constructor(id = 0,
      userName = 'user',
      useArea = '',
      usermale = 5,
      userAge = 0) {

      this.id = id;
      this.useArea = useArea;
      this.userName = userName;
      this.usermale = usermale;
      this.userAge = userAge;
    }

    render() {
      const pattern = `
    <div class="t-panel-item-cnt" data-id="${this.id}">
      <dl class="t-definition-list">
        <dt class="t-definition-term" hidden>
          真實姓名
        </dt>
        <dd class="t-definition-description ml-0">
          <h4 data-grad-under="primary">
            <big>${this.userName}</big>
          </h4>
          <h5 data-grad-under="primary" class="ml-2">Dai-Meng Wang</h5>
        </dd>
      </dl>
      <ul class="t-list-txts mb-4 mt-4">
        <li class="t-list-txts-item">
          <span id="text">123</span>
          ${this.useArea}
        </li>
        <li class="t-list-txts-item">
          ${this.usermale} <small>(待業中)</small>
        </li>
        <li class="t-list-txts-item">
          <strong>${this.userAge}<</strong> 歲
        </li>
      </ul>
      <dl class="t-definition-list">
        <dt class="t-definition-term">
          電子郵件
        </dt>
        <dd class="t-definition-description">
          <a href="mailto:barrylin0208@gmail.com" title="barrylin0208@gmail.com" data-hv-under="primary">barrylin0208@gmail.com</a>
        </dd>
      </dl>
      <dl class="t-definition-list">
        <dt class="t-definition-term">
          聯絡電話
        </dt>
        <dd class="t-definition-description">
          0988-888111
        </dd>
      </dl>
      <dl class="t-definition-list">
        <dt class="t-definition-term">
          兵役狀況
        </dt>
        <dd class="t-definition-description">
          役畢
        </dd>
      </dl>
      <dl class="t-definition-list">
        <dt class="t-definition-term">
          身障類別
        </dt>
        <dd class="t-definition-description">
          視覺障礙 (重度)
        </dd>
      </dl>
      <dl class="t-definition-list">
        <dt class="t-definition-term">
          個案區分
        </dt>
        <dd class="t-definition-description">
          工讀生、專案短期工作
        </dd>
      </dl>
      <dl class="t-definition-list">
        <dt class="t-definition-term">
          就服單位
        </dt>
        <dd class="t-definition-description">
          不公開
        </dd>
      </dl>
    </div>
          <div class = "js-del"></div>
          <div class = "js-edit"></div>
        </li>
    `;

      document.querySelector('.t-panel-item-cnt').innerHTML += pattern
      del = document.querySelectorAll('.js-del')
      edit = document.querySelectorAll('.js-edit')
      console.log(edit)
    }
  }



  /*    const xhr = new XMLHttpRequest();
      xhr.open('GET', 'data.json');
      xhr.send();
      xhr.addEventListener('readystatechange', () => {
        if (xhr.status === 200 && xhr.readyState == 4) {
          parseToHtml(xhr.response);
        } else return;
      });
     
      const parseToHtml = (obj) => {
        data = JSON.parse(obj);
        counter = data.length;
        // create new comment
        data.forEach(comment => {
          const c = new Comment(comment.id, comment.userName, comment.userCommentText, comment.userRating);
          c.render();
        });*/

  // remove comment
  del.forEach(element => {
    element.addEventListener('click', () => {
      const comment = element.parentElement;
      comment.parentElement.removeChild(comment);
      del = document.querySelectorAll('.js-del');
      edit = document.querySelectorAll('.js-edit');
    });
  });

  edit.forEach(element => {
    element.addEventListener('click', () => {
      console.log(element.parentElement.nextElementSibling)
      const comment = element.parentElement.nextElementSibling;
      const temp = `
      <form class="t-form-edit">
       <div class="t-form-group">
          <label class="mb-2 t-fw-500" for="userMail">帳　　號(電子郵件)</label>
          <div class="input-group">
            <input autocomplete="off" data-edit="true" class="t-form-control t-edit-input rounded--36" id="userMail" name="academic_info" placeholder="請輸入您的電子信箱" title="請輸入您的電子信箱" type="text" value="">
            <i class="svg-icon svg-icon-1hx" aria-hidden="true">
              <use xlink:href="#ic-mail"/>
            </i>
            <font class="t-tooltip t-tooltip--v1 t-tooltip-top-right">請輸入您的帳號(您的電子信箱)</font>
          </div>
        </div>
        <button class="t-edit-button" type="submit">儲存</button>
        <button class="t-edit-button" type="button">取消</button>
       </form>`;



      comment.innerHTML += temp;
      let text = comment.querySelector('[data-edit]');
      let input = comment.querySelector('.t-edit-input');
      input.value = text.textContent;
      const button = comment.parentElement.querySelector('.t-edit-button');

      button.addEventListener('click', function(evt) {
        evt.preventDefault();
        text.textContent = input.value;
        const form = document.querySelector('.t-form-edit');
        form.parentElement.removeChild(form);
        del = document.querySelectorAll('.js-del');
        edit = document.querySelectorAll('.js-edit');
      });



    });
  });



  // commentForm.addEventListener('submit', function(evt) {
  //   evt.preventDefault();
  //   counter++;
  //   const newComm = new Comment(counter, nameInput.value, commentField.value, numberInput.value);
  //   newComm.render();
  //   // console.log(newComm);
  //   commentField.value = '';
  //   nameInput.value = '';
  //   charCounter.textContent = 0;
  //   del = document.querySelectorAll('.js-del');
  //   edit = document.querySelectorAll('.js-edit');
  // });

  // commentField.addEventListener('input', function() {
  //   charCounter.textContent = commentField.value.length;

  //   if (commentField.value.length > 200) {
  //     commentField.classList.add('warning');
  //     submitButton.disabled = true;
  //   } else {
  //     commentForm.classList.remove('warning');
  //     commentField.disabled = false;
  //   }
  // });



});