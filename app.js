//Дэлгэцтэй ажиллах контроллор
var uiController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addButton: ".add__btn",
    incomelist: ".income__list",
    expenselist: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var nodelistForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  var formatMoney = function(too, type) {
    too = "" + too;
    var x = too
      .split("")
      .reverse()
      .join("");

    var y = "";
    var count = 1;

    for (var i = 0; i < x.length; i++) {
      y = y + x[i];

      if (count % 3 === 0) y = y + ",";
      count++;
    }
    var z = y
      .split("")
      .reverse()
      .join("");

    if (z[0] === ",") z = z.substr(1, z.length - 1);

    if (type === "inc") z = "+ " + z;
    else z = "- " + z;
    return z;
  };

  return {
    displayDate: function() {
      var unuudur = new Date();
      document.querySelector(DOMStrings.dateLabel).textContent =
        unuudur.getFullYear() + " оны  " + unuudur.getMonth() + " сарын ";
    },
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    displayPercentages: function(allPercentages) {
      //Зарлагын Nodelist -г олох
      var elements = document.querySelectorAll(
        DOMStrings.expensePercentageLabel
      );

      nodelistForEach(elements, function(el, index) {
        el.textContent = allPercentages[index] + "%";
      });
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    clearFields: function() {
      var fields = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );
      //conver list to array
      // ---------------------------------------------------------------------
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(el, index, array) {
        el.value = "";
      });
      fieldsArr[0].focus();
      console.log(fieldsArr);
      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }
      // ----------------------------------------------------------------------
    },
    tusviigUzuuleh: function(tusuv) {
      var type;
      if (tusuv.tusuv > 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMStrings.tusuvLabel).textContent = formatMoney(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMStrings.expenseLabel).textContent = formatMoney(
        tusuv.totalExp,
        "exp"
      );

      if (tusuv.huvi !== 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          tusuv.huvi;
      }
    },

    deleteListItem: function(id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    addListItem: function(item, type) {
      //Орлого зарлагын элементийг агуулсан HTML-ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMStrings.incomelist;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button></div></div></div>';
      } else {
        list = DOMStrings.expenselist;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", formatMoney(item.value, type));

      //Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
      //Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
    },

    changeType: function() {
      var fields = document.querySelectorAll(
        DOMStrings.inputType +
          ", " +
          DOMStrings.inputDescription +
          ", " +
          DOMStrings.inputValue
      );

      nodelistForEach(fields, function(el) {
        el.classList.toggle("red-focus");
      });
      document.querySelector(DOMStrings.addButton).classList.toggle("red");
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
    this.percentage = -1;
  };
  Expense.prototype.calcPrecentage = function(totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.items[type].forEach(function(el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    items: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },
    tusuv: 0,
    huvi: 0
  };
  return {
    tusuvTootsooloh: function() {
      //Нийт орлогийн нийлбэрийг тооцоолно.
      calculateTotal("inc");
      //Нийт зарлагын нийлбэрийг тооцоолно.
      calculateTotal("exp");
      //Төсвийг шинээр тооцоолно
      data.tusuv = data.totals.inc - data.totals.exp;
      //Орлого зарлагын хувийг тооцоолно.
      if (data.totals.inc > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },
    tusviigAvah: function() {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    },
    deleteItem: function(type, id) {
      var ids = data.items[type].map(function(el) {
        return el.id;
      });
      console.log("ids bol " + ids);
      var index = ids.indexOf(id);
      console.log("index bol  " + index);
      if (index !== -1) {
        console.log("Ustgah gej bn ");
        data.items[type].splice(index, 1);
      }
    },
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
    calculatePercentages: function() {
      data.items.exp.forEach(function(el) {
        el.calcPrecentage(data.totals.inc);
      });
    },
    getPercentages: function() {
      var allPercentages = data.items.exp.map(function(el) {
        return el.getPercentage();
      });

      return allPercentages;
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
    if (input.description != "" && input.value != NaN) {
      //2. Олж авсан өгөгдлүүдээ санхүүгийн контроллорт дамжуулж тэнд хадгална.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );
      //3. Олж авсан өгөгдлүүдээ web дээрээ тохирох хэсэгт нь гаргана.
      uiController.addListItem(item, input.type);
      uiController.clearFields();

      //Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ.
      updateTusuv();
    } else {
      alert("Та тайлбар, дүн хэсгийг бөглөнө үү.");
    }
  };
  var updateTusuv = function() {
    //4. Төсвийг тооцоолно.
    financeController.tusuvTootsooloh();
    //5. Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана.
    var tusuv = financeController.tusviigAvah();
    //6. Төсвийн тооцоог дэлгэцэнд гаргана.
    uiController.tusviigUzuuleh(tusuv);
    //7. Хувийг тооцоолно.
    financeController.calculatePercentages();
    //8. Хувийг хүлээж авна.
    var allPercentages = financeController.getPercentages();
    //9. Эдгээр хувийг дэлгэцэнд гаргана.
    uiController.displayPercentages(allPercentages);
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
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);
    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function(event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-", -1);
          var type = arr[0];
          var itemId = parseInt(arr[1]);

          console.log(type + "-" + itemId);

          // 1. Санхүүгийн модуле type, id -г ашиглаад устгах.
          financeController.deleteItem(type, itemId);
          // 2. Дэлгэц дээрээс энэ элэмэнт ийг устгана.
          uiController.deleteListItem(id);
          // 3. Үлдэгдэл тооцоог шинэчилж харуулна.
          updateTusuv();
        }
      });
  };
  return {
    init: function() {
      console.log("Application started");
      uiController.displayDate();
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0
      });
      setUpEventListeners();
    }
  };
})(uiController, financeController);

appController.init();
