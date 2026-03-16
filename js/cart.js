// ▼ localStorage からカート情報を取得
//   形式は [{ id: 1, qty: 1 }, { id: 3, qty: 2 }]
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ▼ 「カートページかどうか」を判定
const cartArea = document.querySelector(".cart_items");

// ▼ カートページ以外なら、ここで終了（バグ防止）
if (!cartArea) {
  // 何もしないで終了
} else {

  // ▼ カートが空ならメッセージ表示して終了
  if (cart.length === 0) {
    cartArea.innerHTML = "<p>カートは空です。</p>";
  } else {

    // ▼ 商品データ（products.json）を読み込む
    fetch("products.json")
      .then(res => res.json())
      .then(data => {

        let total = 0; // 合計金額

        // ▼ カート内の商品を1つずつ処理
        cart.forEach((item, index) => {

          // item.id に一致する商品データを取得
          const product = data.find(p => p.id == item.id);

          if (product) {
            // ▼ 商品1つ分のHTMLブロックを作成
            const div = document.createElement("div");
            div.classList.add("cart_item");

            div.innerHTML = `
              <img src="${product.images[0]}" alt="">
              <p>${product.name}</p>
              <p>¥${product.price}（tax in）</p>

              <!-- 数量ボタン -->
              <div class="qty_box">
                <button class="qty_minus" data-index="${index}">−</button>
                <span>${item.qty}</span>
                <button class="qty_plus" data-index="${index}">＋</button>
              </div>

              <!-- 削除ボタン -->
              <button class="delete_btn" data-index="${index}">削除</button>
            `;

            cartArea.appendChild(div);

            // ▼ 合計金額に「価格 × 数量」を加算
            total += Number(product.price) * item.qty;
          }
        });

        // ▼ 合計金額を画面に反映
        document.getElementById("total_price").textContent = total.toLocaleString();

        // ▼ 数量＋ボタンの処理
        document.querySelectorAll(".qty_plus").forEach(btn => {
          btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            cart[index].qty++; // 数量を1増やす
            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload(); // 画面を更新
          });
        });

        // ▼ 数量−ボタンの処理
        document.querySelectorAll(".qty_minus").forEach(btn => {
          btn.addEventListener("click", () => {
            const index = btn.dataset.index;

            // 数量が1より大きいときだけ減らす
            if (cart[index].qty > 1) {
              cart[index].qty--;
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload();
          });
        });

        // ▼ 削除ボタンの処理
        document.querySelectorAll(".delete_btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const index = btn.dataset.index;

            // カート配列から該当商品を削除
            cart.splice(index, 1);

            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload();
          });
        });

      });
  }
}

// ▼ カートを空にするボタン
const clearBtn = document.getElementById("clear_cart_btn");

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    // localStorage の cart を削除
    localStorage.removeItem("cart");

    // ページをリロード
    location.reload();
  });
}