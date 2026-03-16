document.addEventListener("DOMContentLoaded", function () {

  const btn = document.getElementById("search_btn");
  const input = document.getElementById("search_input");

  btn.addEventListener("click", function () {
    const keyword = input.value.trim();
    console.log("keyword:", keyword);

    const url = `list.html?keyword=${encodeURIComponent(keyword)}`;
    console.log("遷移先URL:", url);

    if (keyword !== "") {
      window.location.href = url;
    } else {
      console.log("キーワードが空なので遷移しません");
    }
  });

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      btn.click();
    }
  });

});