document.getElementById("bankStatment").addEventListener("change", async (e)=>{
    var BankTransactions = await e.target.files[0].text();
    let Payments = CreditVerification(BankTransactions);
    var Main = document.getElementsByClassName("Continer")[0]
    for(const Payment of Payments) {
        let Tag = document.createElement("div")
        Tag.className="Payment_Slot"
        let DueDate = document.createElement("span")
        DueDate.className = "Due_Date"
        let Amount = document.createElement("span")
        DueDate.className = "Amount"
        DueDate.innerHTML = new Date(Payment.date).toLocaleDateString()
        Amount.innerHTML = Payment.amount
        Tag.appendChild(DueDate)
        Tag.appendChild(Amount)
        Main.appendChild(Tag)
    }

});