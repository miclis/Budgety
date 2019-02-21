// BUDGET CONTROLLER
var budgetController = (function() {
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function(type, desc, val) {
			var newItem, ID;

			// Create new ID - always last existing ID from a specified type + 1
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Create new item based on 'inc' or 'exp' type
			if (type === "exp") {
				newItem = new Expense(ID, desc, val);
			} else if (type === "inc") {
				newItem = new Income(ID, desc, val);
			}

			// Push it into the data structure
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},
		testing: function() {
			console.log(data);
		}
	};
})();

// UI CONTROLLER
var UIController = (function() {
	var DOMstrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputValue: ".add__value",
		inputBtn: ".add__btn",
		incomeContainer: ".income__list",
		expensesContainer: ".expenses__list"
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			var html, newHtml, element;
			// Create HTML string with placeholder text

			if (type === "inc") {
				element = DOMstrings.incomeContainer;
				html =
					'<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === "exp") {
				element = DOMstrings.expensesContainer;
				html =
					'<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace placeholder text with some actual data
			console.log(html);

			newHtml = html
				.replace("%id%", obj.id)
				.replace("%description%", obj.description)
				.replace("%value%", obj.value);

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
		},

		clearFields: function() {
			var fields, fieldsArray;

			fields = document.querySelectorAll(
				DOMstrings.inputDescription + ", " + DOMstrings.inputValue
			);

			fieldsArray = Array.prototype.slice.call(fields);

			fieldsArray.forEach(element => {
				element.value = "";
			});

			fieldsArray[0].focus();
		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
	// Event listeners
	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

		document.addEventListener("keypress", function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};

	var updateBudget = function() {
		// 1. Calculate the budget
		// 2. Return the budget
		// 3. Display the budget on the UI
	};

	var ctrlAddItem = function() {
		var input, newIteml;

		// 1. Get the field input data
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetController.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			// 3.1. Clear the fields
			UICtrl.clearFields();

			// 4. Calculate and update the budget
			updateBudget();
		}
	};

	return {
		init: function() {
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();
