let index = 0;   // 意味：今どの画像を表示しているかを表す番号を入れておく変数。最初は0（＝1枚目の画像）からスタートする。
const slides = document.querySelectorAll(".slide");   // 意味：HTMLの中からクラス名が「.slide」の要素を全部まとめて取得している。これでslidesという変数に、画像のリスト（配列っぽいもの）が入る。
const dots = document.querySelectorAll(".dot");   // 意味：クラス名「.dot」の要素（下の丸いインジケーター）を全部まとめて取得している。これでdotsに丸いポインターたちのリストが入る。
const slidesContainer = document.querySelector(".slides");   //意味：HTML の中から .slides というクラスを持つ要素を1つ取得している。横スライド方式では画像をまとめている親（.slides）を横に動かすので取得する必要がある。

// スライドを表示する関数
function showSlide(i) {   // 意味：「i番目のスライドを表示する」ための関数を定義している。iには「何番目を表示したいか」が入ってくる。
  const slideWidth = slides[0].clientWidth;   // 意味：スライド1枚の横幅を取得している。横スライドは「何px動かすか」が重要。例えば1枚の幅が 600px なら、1枚目 → 0px, 2枚目 → -600px, 3枚目 → -1200pxというふうに動かす必要がある。そのために「1枚の幅」を取得している。
  slidesContainer.style.transform = `translateX(${-i * slideWidth}px)`;   // 意味：.slides 全体を 左に i 枚分だけ動かす。i = 0 → translateX(0px) → 1枚目が表示, i = 1 → translateX(-600px) → 2枚目が表示, i = 2 → translateX(-1200px) → 3枚目が表示。なぜマイナス？＝左に動かすため。
  
  // ドットの active 切り替え（※コピーの4枚目には active を付けない）
  dots.forEach((dot, idx) => {   // 意味：全てのドット（●）に対して順番に処理をする。・dot → 今処理しているドット,・idx → そのドットが何番目か（0,1,2…）
    dot.classList.toggle("active", idx === (i % (slides.length - 1)));   //意味：同じ番号のドットにも active をつけたり外したりしている。表示中の画像に対応するドット → active つき（色が変わる）。それ以外 → active なし。これで「今どの画像が表示されているか」をドットでも表現している。コピーの4枚目に来たときは「ドットは1枚目の active に戻す」必要がある。そのために、i % (slides.length - 1)を使っている。
  });   // 意味：forEach の終わりと、showSlide 関数の終わり。ここまでで「画像とドットの表示状態を切り替える処理」が1セット。
}

// 自動再生（無限ループ対応）
setInterval(() => {   // 意味：一定時間ごとに自動で処理を繰り返すための関数。中に書いた処理を、指定した時間ごとに実行してくれる。
  index++;   // （index = (index + 1) % slides.length をやめた理由）→% slides.length を使うと「瞬間的に0に戻る」から3 → 0 に一瞬で戻る動きをする。これが「3枚目 → 2 → 1 → 0 と見えてしまう」原因。
             // 無限ループスライダーでは「自然に戻す」必要があるので「index++;」で普通に進めるだけにして、最後のコピーに来たら- 一瞬だけ transition を切って、- index = 0 に戻す。という「自然なループ処理」を入れる。
  showSlide(index);   // 意味：さっき定義した showSlide 関数を呼び出して、今の index 番の画像＆ドットを表示状態にする。

  // ★ 最後のコピー（index = 3）に来たら瞬間的に1枚目へ戻す
  if (index === slides.length - 1) {
    setTimeout(() => {
      slidesContainer.style.transition = "none"; // アニメーションを一瞬切る
      index = 0; // 本物の1枚目へ戻す
      showSlide(index);

      // 少し待って transition を元に戻す
      setTimeout(() => {
        slidesContainer.style.transition = "transform 0.5s ease";
      }, 20);
    }, 500); // ← CSS の transition と同じ時間にする
  }

}, 3000);   // 意味：setInterval の「何ミリ秒ごとに実行するか」の指定。3000 は 3000ミリ秒＝3秒。→ 3秒ごとに画像が切り替わる。

// ドットをクリックしたらその画像へ移動
dots.forEach((dot, i) => {   // 意味:全てのドットに対して、1つずつ処理をする。dot → 今処理しているドット。i → そのドットが何番目か（0,1,2,...）
  dot.addEventListener("click", () => {   // 意味:そのドットがクリックされたときに実行する処理を登録している。「このドットがクリックされたら、こう動いてね」という命令。
    index = i;   // 意味:クリックされたドットの番号 i を、今の表示番号 index にセットしている。→ 「このドットに対応する画像を表示したい」という意味。
    showSlide(index);   // 意味:クリックされたドットに対応する画像を表示する。画像とドットの active が両方切り替わる。
  });   // 意味:addEventListener と forEach の終わり。これで「全てのドットにクリックイベントがついた」状態になる。
});

// 前へボタン
document.querySelector(".prev").addEventListener("click", () => {
  index--;

  // マイナスになったら「最後の本物のスライド」へ
  if (index < 0) {
    slidesContainer.style.transition = "none";
    index = slides.length - 2; // 3枚目へ
    showSlide(index);

    setTimeout(() => {
      slidesContainer.style.transition = "transform 0.5s ease";
    }, 20);
  }

  showSlide(index);
});


// 次へボタン
document.querySelector(".next").addEventListener("click", () => {
  index++;
  showSlide(index);

  // ★ 最後のコピーに来たら瞬間的に戻す
  if (index === slides.length - 1) {
    setTimeout(() => {
      slidesContainer.style.transition = "none";
      index = 0;
      showSlide(index);

      setTimeout(() => {
        slidesContainer.style.transition = "transform 0.5s ease";
      }, 20);
    }, 500);
  }
});


// スワイプ対応
let startX = 0;
let endX = 0;

slidesContainer.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

slidesContainer.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const diff = endX - startX;

  if (Math.abs(diff) < 50) return;   // 小さい動きは無視

  if (diff > 0) {
    // 右スワイプ（前へ）
    index--;
    if (index < 0) {
      slidesContainer.style.transition = "none";
      index = slides.length - 2;
      showSlide(index);
      setTimeout(() => {
        slidesContainer.style.transition = "transform 0.5s ease";
      }, 20);
    }
  } else {
      // 左スワイプ（次へ）
    index++;
  }

  showSlide(index);

    // ★ コピーに来たら戻す
  if (index === slides.length - 1) {
    setTimeout(() => {
      slidesContainer.style.transition = "none";
      index = 0;
      showSlide(index);
      setTimeout(() => {
        slidesContainer.style.transition = "transform 0.5s ease";
      }, 20);
    }, 500);
  }
  
}

// 初期表示
showSlide(index);

// 画面サイズが変わった時に位置を再計算
window.addEventListener("resize", () => {
  showSlide(index);
});
