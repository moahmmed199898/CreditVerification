(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CreditVerification = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var USBankGetData = function (BankData) {
        var data = BankData;
        var Transaction = data.split("\n");
        var detailedTransaction = [];
        var Outputs = [];
        for (var _i = 0, Transaction_1 = Transaction; _i < Transaction_1.length; _i++) {
            var item = Transaction_1[_i];
            detailedTransaction.push(item.split(","));
        }
        for (var i = 1; i < detailedTransaction.length - 1; i++) {
            var output = {};
            detailedTransaction[i].splice(1, 3);
            output.amount = parseFloat(JSON.parse(detailedTransaction[i][1]));
            output.date = Date.parse(detailedTransaction[i][0]);
            Outputs.push(output);
        }
        return Outputs;
    };
    exports.default = USBankGetData;
});

},{}],2:[function(require,module,exports){
module.exports = require("./index.ts").default;
},{"./index.ts":3}],3:[function(require,module,exports){
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./DataGetter", "./verify"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataGetter_1 = __importDefault(require("./DataGetter"));
    var verify_1 = __importDefault(require("./verify"));
    var CreditVerification = function (BankCreditCardTransaction) {
        var transactions = DataGetter_1.default(BankCreditCardTransaction);
        var withdraws = [];
        var deposits = [];
        var Output = [];
        for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
            var transaction = transactions_1[_i];
            if (transaction.amount > 0) {
                deposits.push(transaction);
            }
            else {
                withdraws.push(transaction);
            }
        }
        for (var _a = 0, withdraws_1 = withdraws; _a < withdraws_1.length; _a++) {
            var Payment = withdraws_1[_a];
            var payment = verify_1.default(Payment, deposits);
            if (payment !== undefined) {
                if (payment.UpdatedDeposits) {
                    deposits = payment.Data;
                }
                else {
                    Output.push(payment.Data);
                }
            }
        }
        var total = 0;
        for (var _b = 0, Output_1 = Output; _b < Output_1.length; _b++) {
            var trans = Output_1[_b];
            total += trans.amount;
        }
        console.log(JSON.stringify(Output));
        console.log(JSON.stringify(total));
        return Output;
    };
    exports.default = CreditVerification;
});

},{"./DataGetter":1,"./verify":4}],4:[function(require,module,exports){
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Verify = function (Payment, Deposits) {
        var MonthAfterPayment = Payment.date + (86400000 * 28);
        for (var i = 0; i < Deposits.length; i++) {
            var Deposit = Deposits[i];
            if (Deposit.date >= Payment.date && Deposit.date <= MonthAfterPayment) {
                if (Deposit.amount >= Payment.amount * -1) {
                    Deposits[i].amount = Deposit.amount + Payment.amount;
                    return {
                        UpdatedDeposits: true,
                        Data: Deposits
                    };
                }
                else {
                    Payment.amount = Payment.amount + Deposit.amount;
                    Deposits[i].amount = 0;
                }
            }
        }
        if (parseFloat(Payment.amount.toFixed(2)) < 0) {
            var JsonOutputFile = {
                date: MonthAfterPayment,
                amount: parseFloat(Payment.amount.toFixed(2))
            };
            return {
                UpdatedDeposits: false,
                Data: JsonOutputFile
            };
        }
    };
    exports.default = Verify;
});

},{}]},{},[2])(2)
});
