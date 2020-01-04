class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
   
  // submit budget form method
  submitBudget() {
     if(this.budgetInput.value === '' || this.budgetInput.value < 0){
       this.showError(this.budgetFeedback);
     }else{
       this.budgetAmount.textContent = this.budgetInput.value;
       this.budgetInput.value = '';
       this.showBalance();
     }
  }

  // Displaying the balance
  showBalance() {
     let total = parseInt(this.budgetAmount.textContent) - this.expenseValue();
     this.balanceAmount.textContent = total;
     
     this.balanceAmount.classList.remove("showGreen", "showRed");
     if (total > 0){       
       this.balanceAmount.classList.add("showGreen");
     }else if(total < 0){
       this.balanceAmount.classList.add("showRed");
     }else{
       this.balanceAmount.classList.add("showBlack"); 
     }

  }

  //Submitting the expense
  submitExpense() {
    if(this.expenseInput.value === "" || this.amountInput.value === "" || this.amountInput.value < 0){
      this.showError(this.expenseFeedback);
    }else{
    
      let expenseList = {
        id: this.itemID,
        title: this.expenseInput.value,
        amount: parseInt(this.amountInput.value),
      }
      this.itemID++;

      this.expenseInput.value = "";
      this.amountInput.value = "";

      this.itemList.push(expenseList); 
      this.addExpense(expenseList);

    }
  }

  // Adding expenses to UI
  addExpense(expenseList){
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `    
    <div class="expense-item d-flex justify-content-between align-items-baseline">
      <h6 class="expense-title mb-0 text-uppercase list-item">- ${expenseList.title}</h6>
      <h5 class="expense-amount mb-0 list-item">$ ${expenseList.amount}</h5>
        <div class="expense-icons list-item">
          <a href="#" class="edit-icon mx-2" data-id="${expenseList.id}">
            <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expenseList.id}">
            <i class="fas fa-trash"></i>
          </a>
        </div>
    </div>`;

    this.expenseList.appendChild(div);
    this.showBalance();
    
  }

  // Displaying the expense
  expenseValue(){
    let expense = 0;
    
    if(this.itemList.length > 0){
      expense = this.itemList.reduce(function(amount, object){
        amount += object.amount;
        return amount;
      }, 0);
    }
    
    this.expenseAmount.textContent = expense;
    return expense;
  }


  // edit expense
  editExpense(element){
     let expense = this.deleteExpense(element); 
    
     this.expenseInput.value = expense[0].title;
     this.amountInput.value = expense[0].amount;

     this.showBalance();
  }

  // delete expense
  deleteExpense(element){
    let id = parseInt(element.dataset.id);
     let parent = element.parentElement.parentElement.parentElement;
     
     this.expenseList.removeChild(parent);

     let expense = this.itemList.filter(function(item){
       return item.id === id;
     });

     this.itemList = this.itemList.filter(function(item){
       return item.id !== id;
     })
     
     this.showBalance();
     return expense
  }

  // Error handling
  showError(value){
    value.classList.add("showItem");
    value.innerHTML = `<p> Value can't be negative or empty </p>`;
    const that = this;
    setTimeout(function(){
      value.classList.remove("showItem");
    }, 4000);
  }
  

}
 
function eventListeners(){
    const budgetForm = document.getElementById("budget-form");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    // class instance
    const ui = new UI();
    
    // when submitting budget form
    budgetForm.addEventListener("submit", function(event){
        event.preventDefault();
        ui.submitBudget();
    });

    // when submitting expense form
    expenseForm.addEventListener("submit", function(event){
       event.preventDefault(); 
       ui.submitExpense();
    });

    // when clicking to expense list
    expenseList.addEventListener("click", function(event){
       if(event.target.parentElement.classList.contains('edit-icon')){
         ui.editExpense(event.target.parentElement);

       }else if(event.target.parentElement.classList.contains('delete-icon')){
         ui.deleteExpense(event.target.parentElement);

       }
    });


}

document.addEventListener("DOMContentLoaded", function(){
   eventListeners();
});