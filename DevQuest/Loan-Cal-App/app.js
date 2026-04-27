document.getElementById('loan-form').addEventListener('submit', function(e) {
    document.getElementById('results').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
  setTimeout(calculate, 2000);
  e.preventDefault();
});

function calculate(e) {
    const amount=document.getElementById('loan_amount')
    const interestRate=document.getElementById('interest_rate')
    const loanTerm=document.getElementById('loan_term')
    const monthlyPayment =document.getElementById('monthly_payment')
    const totalPayment =document.getElementById('total_payment')
    const totalInterest =document.getElementById('total_interest')

    const principal = parseFloat(amount.value);
    console.log(principal);

    const calculatedInterest = parseFloat(interestRate.value) / 100 / 12;
    console.log(calculatedInterest);

    const calculatedPayments = parseFloat(loanTerm.value) * 12;
    console.log(calculatedPayments);

    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);
    if(isFinite(monthly)){
        monthlyPayment.value = monthly.toFixed(2);
        totalPayment.value = (monthly * calculatedPayments).toFixed(2);
        totalInterest.value = (monthly * calculatedPayments - principal).toFixed(2);

        document.getElementById('results').style.display = 'block';
        document.getElementById('loading').style.display = 'none';

    }else{
     showAlert("please enter a number");
         
    }
    e.preventDefault();

}

function showAlert(message){
   const errorDiv = document.createElement("div");

   errorDiv.className = "alert alert-danger";
   errorDiv.appendChild(document.createTextNode(message));
   const card = document.querySelector(".card");
   card.insertBefore(errorDiv, card.firstChild);
    setTimeout(() => {
        document.querySelector(".alert").remove();
    }, 3000);
}