/*javaScriptはHTMLで読み込むのが正解
【<script src="js/menu.js"></script>】
これを</body>の直前に書く*/

// スマホメニュー開閉
const menuBtn = document.getElementById("menu_btn");
const spMenu = document.getElementById("sp_menu");

if (menuBtn && spMenu) {
  menuBtn.addEventListener("click", () => {
    spMenu.classList.toggle("open");
  });
}


// ▼ カートの個数バッジを更新する処理
function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ▼ 数量の合計を計算
  let count = cart.reduce((sum, item) => sum + item.qty, 0);

  // ▼ バッジに反映
  const badge = document.getElementById("cart_count");

  if (badge) {
    badge.textContent = count > 0 ? count : "";
  }
}

// ▼ ページ読み込み時に実行
updateCartBadge();

// ▼ ドロップダウン開閉
document.querySelectorAll('.dropdown_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    content.classList.toggle('dropdown_open');
  });
});