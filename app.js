//Дэлгэцтэй ажиллах контроллор
var uiController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addButton: ".add__btn"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    addListItem: function(item, type) {
      //Орлого зарлагын элементийг агуулсан HTML-ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = ".income__list";
        html =
          '<div class="item clearfix id="income-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button></div></div></div>';
      } else {
        list = ".expenses__list";
        html =
          '<div class="item clearfix id="expense-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button></div></div></div>';
      }
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.descriptions);
      html = html.replace("$$VALUE$$", item.value);

      //Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
      //Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
    }
  };
})();

//Санхүүтэй ажиллах контроллор
var financeController = (function() {
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var data = {
    items: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    }
  };
  return {
    addItem: function(type, desc, val) {
      var item, id;

      //identification
      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },
    seeData: function() {
      return data;
    }
  };
})();
//Програм холбогч контроллор
var appController = (function(uiController, financeController) {
  var controlAddItem = function() {
    //1. Оруулах өгөгдлийг дэлгэцээс олж авна.
    var input = uiController.getInput();
    //2. Олж авсан өгөгдлүүдээ санхүүгийн контроллорт дамжуулж тэнд хадгална.
    var item = financeController.addItem(
      input.type,
      input.description,
      input.value
    );
    //3. Олж авсан өгөгдлүүдээ web дээрээ тохирох хэсэгт нь гаргана.
    uiController.addListItem(item, input.type);
    //4. Төсвийг тооцоолно.

    //5. Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана.
  };
  var setUpEventListeners = function() {
    var DOM = uiController.getDOMStrings();

    document.querySelector(DOM.addButton).addEventListener("click", function() {
      controlAddItem();
    });
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        controlAddItem();
      }
    });
  };
  return {
    init: function() {
      console.log("Application started");
      setUpEventListeners();
    }
  };
})(uiController, financeController);

appController.init();
