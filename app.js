//Дэлгэцтэй ажиллах контроллор
var uiController = (function() {})();
//Санхүүтэй ажиллах контроллор
var financeController = (function() {})();
//Програм холбогч контроллор
var appController = (function(uiController, financeController) {
  var controlAddItem = function() {
    console.log("itemadd");
    //1. Оруулах өгөгдлийг дэлгэцээс олж авна.

    //2. Олж авсан өгөгдлүүдээ санхүүгийн контроллорт дамжуулж тэнд хадгална.

    //3. Олж авсан өгөгдлүүдээ web дээрээ тохирох хэсэгт нь гаргана.

    //4. Төсвийг тооцоолно.

    //5. Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана.
  };
  document.querySelector(".add__btn").addEventListener("click", function() {
    controlAddItem();
  });
  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      controlAddItem();
    }
  });
})(uiController, financeController);
