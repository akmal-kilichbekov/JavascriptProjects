// show cart on click to cart Info
(function () {
  const cartInfo = document.getElementById("cart-info");
  const cart = document.getElementById("cart");

  cartInfo.addEventListener("click", function () {
    cart.classList.toggle("show-cart");
  });

})();

// adding items to cart

(function () {
  const cardBtn = document.querySelectorAll(".store-item-icon");

  cardBtn.forEach(function (btn) {
    btn.addEventListener("click", function (event) {

      if (event.target.parentElement.classList.contains("store-item-icon")) {
        let path = event.target.parentElement.previousElementSibling.src;
        let pos = path.indexOf("img") + 3;
        let partPath = path.slice(pos);

        const item = {};
        item.img = `img-cart${partPath}`;
        item.name = event.target.parentElement.parentElement.nextElementSibling.children[0].children[0].textContent;
        let priceStr = event.target.parentElement.parentElement.nextElementSibling.children[0].children[1].textContent;
        item.price = priceStr.slice(1).trim();

        const cardItem = document.createElement('div');
        cardItem.classList.add(
          "cart-item",
          "d-flex",
          "justify-content-between",
          "text-capitalize",
          "my-3"
        );

        cardItem.innerHTML =  `<img src="${item.img}" class="img-fluid rounded-circle" id="item-img" alt="">
                               <div class="item-text">
                                  <p id="cart-item-title" class="font-weight-bold mb-0">${item.name}</p>
                                  <span>$</span>
                                  <span id="cart-item-price" class="cart-item-price" class="mb-0">${item.price}</span>
                               </div>
                               <a href="#" id='cart-item-remove' class="cart-item-remove">
                                  <i class="fas fa-trash"></i>
                               </a>`;

        const cart = document.getElementById("cart");     
        const total = document.querySelector(".cart-total-container");
        cart.insertBefore(cardItem, total);

        showTotal();
      }
    });
  });


  function showTotal(){
    const total = [];
    const items = document.querySelectorAll(".cart-item-price");
     
    items.forEach(function(item){
      total.push(parseFloat(item.textContent))
    });
    
    const sumMoney = total.reduce((total, item) => {
       total += item;
       return total;
    });

    const totalMoney = sumMoney.toFixed(2);
    document.getElementById("cart-total").textContent = totalMoney;
    document.querySelector(".item-total").textContent = totalMoney;
    document.getElementById("item-count").textContent = total.length;   

  }

})()