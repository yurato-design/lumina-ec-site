// ===============================
// ① URL から category を取得
// ===============================
const params = new URLSearchParams(location.search);
const category = params.get("category"); // bag / mug / interior


// ===============================
// ② カテゴリ名の日本語変換
// ===============================
const categoryNames = {
  bag: "バッグ",
  mug: "マグカップ",
  interior: "インテリア"
};

// 日本語カテゴリ名（存在しない場合は "商品一覧"）
const categoryJP = categoryNames[category] || "商品一覧";


// ===============================
// ③ パンくず・タイトルを書き換え
// ===============================
document.getElementById("breadcrumb_category").textContent = categoryJP;
document.getElementById("category_title").textContent = categoryJP;


// ===============================
// ④ カテゴリー画像の切り替え
// ===============================
const categoryImages = {
  bag: "images/cate_bag.jpg",
  mug: "images/cate_mug.jpg",
  interior: "images/cate_interior.jpg"
};

// デフォルト画像
const defaultImage = "images/cate_default.jpg";

// 画像を切り替え
document.getElementById("category_image").src =
  categoryImages[category] || defaultImage;


// ===============================
// ⑤ 商品一覧を表示する場所
// ===============================
const listContainer = document.getElementById("item_list");


// ===============================
// ⑥ products.json を読み込む
// ===============================
fetch("products.json")
  .then(res => res.json())
  .then(data => {

    // ===============================
    // ⑦ カテゴリに一致する商品だけ抽出
    // ===============================
    const filteredItems = data.filter(item => item.category === category);

    // 商品がない場合
    if (filteredItems.length === 0) {
      listContainer.innerHTML = "<p>商品がありません。</p>";
      return;
    }

    // ===============================
    // ⑧ ページネーションの準備
    // ===============================
    const itemsPerPage = 6; // 1ページ6件
    let currentPage = 1;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // 商品を表示する関数
    function renderItems() {
      listContainer.innerHTML = "";

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      const pageItems = filteredItems.slice(start, end);

      pageItems.forEach(item => {
        const html = `
          <div class="item">
            <a href="products.html?id=${item.id}">
              <img src="${item.images[0]}" alt="${item.name}">
              <p>${item.name}</p>
              <p>￥${item.price}（tax in）</p>
            </a>
          </div>
        `;
        listContainer.insertAdjacentHTML("beforeend", html);
      });
    }

    // 初回表示
    renderItems();


    // ===============================
    // ⑨ ページネーションの動作
    // ===============================
    document.getElementById("prev_page").addEventListener("click", e => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderItems();
      }
    });

    document.getElementById("next_page").addEventListener("click", e => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderItems();
      }
    });

  })
  .catch(err => {
    console.error("JSON読み込みエラー:", err);
    listContainer.innerHTML = "<p>商品データを読み込めませんでした。</p>";
  });