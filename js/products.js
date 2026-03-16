// =======================================
// ① URL から商品IDを取得
// =======================================
const params = new URLSearchParams(location.search);
const productId = Number(params.get("id"));


// =======================================
// ② JSON を読み込む
// =======================================
fetch("products.json")
  .then(res => res.json())
  .then(data => {

    // 対象の商品を取得
    const product = data.find(p => p.id === productId);

    if (!product) {
      document.querySelector(".product_detail").innerHTML =
        "<p>商品が見つかりません。</p>";
      return;
    }

    // =======================================
    // ③ 商品情報を画面に表示
    // =======================================
    document.querySelector(".product_title").textContent = product.name;
    document.querySelector(".product_price").textContent = `￥${product.price}（tax in）`;
    document.querySelector(".product_description").textContent = product.description;

    // メイン画像
    const mainImage = document.querySelector(".main_image img");
    mainImage.src = product.images[0];

    // サムネイル生成
    const thumbsContainer = document.querySelector(".thumb_list");
    thumbsContainer.innerHTML = "";

    product.images.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.classList.add("thumb");
      if (index === 0) thumb.classList.add("active");
      thumbsContainer.appendChild(thumb);
    });

    // =======================================
    // ④ サムネイル切り替え（太郎のコードを統合）
    // =======================================
    const thumbs = document.querySelectorAll(".thumb");

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainImage.src = thumb.src;

        thumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });


    // =======================================
    // ⑤ カートに入れる処理
    // =======================================
    document.getElementById("add_to_cart").addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(item => item.id === product.id);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id: product.id, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("カートに追加しました！");
    });


    // =======================================
    // ⑥ 最近見た商品を保存
    // =======================================
    function saveRecentItem(id) {
      let recent = JSON.parse(localStorage.getItem("recent_items")) || [];

      // 重複削除
      recent = recent.filter(itemId => itemId !== id);

      // 先頭に追加
      recent.unshift(id);

      // 最大6件
      if (recent.length > 6) {
        recent.pop();
      }

      localStorage.setItem("recent_items", JSON.stringify(recent));
    }

    // 商品ページを開いたら保存
    saveRecentItem(product.id);


    // =======================================
    // ⑦ 最近見た商品を表示
    // =======================================
    function renderRecentItems(allProducts) {
      const recentList = document.getElementById("recent_list");
      const recent = JSON.parse(localStorage.getItem("recent_items")) || [];

      if (recent.length === 0) {
        recentList.innerHTML = "<p>最近見た商品はありません。</p>";
        return;
      }

      recent.forEach(id => {
        const item = allProducts.find(p => p.id === id);
        if (!item) return;

        const html = `
          <div class="item">
            <a href="products.html?id=${item.id}">
              <img src="${item.images[0]}" alt="${item.name}">
              <p>${item.name}</p>
            </a>
          </div>
        `;
        recentList.insertAdjacentHTML("beforeend", html);
      });
    }

    // 表示実行
    renderRecentItems(data);

  })
  .catch(err => {
    console.error("JSON読み込みエラー:", err);
  });