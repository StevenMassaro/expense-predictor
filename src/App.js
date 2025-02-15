import './App.css';
import Dashboard from "./Dashboard";
import React, { Component } from 'react';
import Transaction from "./model/Transaction";
import {Utils} from "./Utils"

var _ = require('lodash');

class App extends Component {
  storedExpensesLocalStorageKey = "stored-expenses";
  constructor(props) {
    super(props);
    this.state = {
      recurring: [

      ],
      rows: [

      ],
      accounts: [

      ],
      removedTransactions: [

      ],
      desiredMonths: 12
    }
  }

  recurringTransaction(id, schedule, scheduleDay, name, account, amount) {
    return { id, schedule, scheduleDay, name, account, amount };
  }

  account(name, startingBalance, asOfDate) {
    let asOfDateString = asOfDate.toString()
    return { name, startingBalance, asOfDate: asOfDateString };
  }

  componentDidMount() {
    this.buildTransactions()
  }

  buildTransactions = () => {
    if (_.isEmpty(this.state.rows) && _.isEmpty(this.state.recurring) && _.isEmpty(this.state.accounts)) {
      let jsonString = localStorage.getItem(this.storedExpensesLocalStorageKey);
      if (jsonString) {
        this.setStateFromJsonString(jsonString, () => this._generateTransactionsFromScopeAndPutInScope())
      }
    } else {
      this._generateTransactionsFromScopeAndPutInScope()
    }
  };

  _generateTransactionsFromScopeAndPutInScope() {
    let transactions = []
    transactions = transactions.concat(this.state.rows);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    this.state.recurring.forEach(recur => {
      if (recur.schedule === "monthly") {
        // fill for the rest of this year
        let monthCount = 1;
        for (let month = currentMonth; month < 12; month++) {
          monthCount = this._addRecurringTransaction(transactions, currentYear, month, recur, monthCount);
        }

        // fill for all the future years desired
        let nextYear = currentYear + 1;
        for (let i = 0; i < this.state.desiredMonths/12; i++) {
          for (let month = 0; month < 12; month++) {
            monthCount = this._addRecurringTransaction(transactions, nextYear, month, recur, monthCount);
          }
          nextYear++;
        }
      } else if (recur.schedule === "annually") {
        // subtracting one here because the human enters months as 1-12, but javascript uses 0-11
        let scheduleMonth = recur.scheduleMonth - 1;
        let intendedYear = currentYear;
        if (currentMonth > scheduleMonth) {
          intendedYear++;
        }
        for (let year = intendedYear; year <= ((this.state.desiredMonths / 12 ) + currentYear); year++) {
          this._addRecurringTransaction(transactions, year, scheduleMonth, recur, null)
        }
      }
    })

    if (this.state.removedTransactions) {
      transactions = transactions.filter(t => {
        return _.isUndefined(this.state.removedTransactions.find(rt => {
          return _.isEqual(rt, t);
        }))
      })
    }

    transactions.sort((t1, t2) => {
      // todo - parsing dates here is probably an inefficient way of doing this comparison
      return Date.parse(t1.date) - Date.parse(t2.date)
    })

    this.setState({generatedTransactions: transactions})
  }

  /**
   * @param month the month that the transaction should appear in, note that January is 0 and December is 11
   * @private
   */
  _addRecurringTransaction(transactions, year, month, recur, monthCount) {
    const todayDate = new Date().getDate();
    if (recur.scheduleDay < todayDate && monthCount ===1) {
      console.log("should skip bc of already happened this month")
    } else {
      transactions.push(new Transaction(
          0,
          Utils.formatDate(new Date(year, month, recur.scheduleDay)),
          recur.name,
          recur.account,
          recur.amount,
          "recurring"
      ))
    }
    monthCount++;
    return monthCount;
  }

  exportJson = () => {
    const dataStr = this.jsonifyState(true);

    // todo - improve this file download logic

    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = `expense-predictor-exported-${new Date().toISOString()}.json`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  jsonifyState(prettyPrint = false) {
    let data = {
      rows: this.state.rows,
      accounts: this.state.accounts,
      recurring: this.state.recurring,
      removedTransactions: this.state.removedTransactions
    }

    if (prettyPrint) {
      return JSON.stringify(data, null, 4)
    }
    return JSON.stringify(data)
  }

  importJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {

      // getting a hold of the file reference
      const file = e.target.files[0];

      // setting up the reader
      const reader = new FileReader();
      reader.readAsText(file,'UTF-8');

      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
        const content = readerEvent.target.result; // this is the content!
        console.log( content );
        this.setStateFromJsonString(content, () => this.updateLocalStorage());
      }

    }

    input.click();
  }

  setStateFromJsonString(jsonString, callback) {
    const parsed = JSON.parse(jsonString)
    console.log(parsed)
    this.setState({
      accounts: parsed.accounts,
      rows: parsed.rows.map(row => _.assign(new Transaction(), row)),
      recurring: parsed.recurring,
      removedTransactions: parsed.removedTransactions.map(row => _.assign(new Transaction(), row)) || []
    }, callback)
  }

  updateLocalStorage() {
    localStorage.setItem(this.storedExpensesLocalStorageKey, this.jsonifyState())
    this._generateTransactionsFromScopeAndPutInScope()
  }

  addRemovedTransaction = (transaction) => {
    this.setState({
      removedTransactions: [...this.state.removedTransactions, transaction]
    }, () => this.updateLocalStorage())
  }

  addRow = (row) => {
    this.setState({
      rows: [...this.state.rows, row]
    }, () => this.updateLocalStorage())
  }

  deleteRow = (row) => {
    this.setState({
      rows: this.state.rows.filter( pt => {
        if (!_.isEqual(pt, row)) {
          return true;
        } else {
          console.log("Deleted row " + JSON.stringify(row))
        }
      })
    }, this.updateLocalStorage)
  }

  /**
   * Update the starting balance of the associated account and delete the row.
   */
  mergeRow = (row) => {
    const matchingAccountObject = row.findMatchingAccountObject(this.state.accounts);
    this.editStartingBalance(matchingAccountObject, matchingAccountObject.startingBalance + row.amount)
    this.deleteRow(row)
  }

  editDate = (transaction, newDate) => {
      this.setState((prevState) => {
          return prevState.rows.map(pt => {
              if (_.isEqual(pt, transaction)) {
                  pt.date = newDate;
              }
              return pt;
          })
      }, this.updateLocalStorage)
  }

  editRowDate = (row, newDate) => {
      this.setState((prevState) => {
          return prevState.rows.map(pt => {
              if (_.isEqual(pt, row)) {
                  pt.date = newDate;
              }
              return pt;
          })
      }, this.updateLocalStorage)
  }

  editAmount = (transaction, newAmount, isRecurring = false) => {
    if (!isRecurring) {
      this.editRowAmount(transaction, newAmount)
    } else {
      this.setState((prevState) => {
        let transactions = prevState.recurring;
        return transactions.map(pt => {
          // Because we use transaction objects for recurringTransactions in buildTransactions, we need to omit some
          // properties from the objects before doing the equality comparison (we're comparing transaction to
          // recurringTransaction objects which are slightly different)
          if (_.isEqual(
              _.omit(pt, ['schedule', 'scheduleDay']),
              _.omit(transaction, ['date', 'type']))) {
            pt.amount = newAmount;
          }
          return pt;
        })
      }, this.updateLocalStorage)
    }
  }


  editRowAmount = (row, newAmount) => {
    this.setState((prevState) => {
      return prevState.rows.map(pt => {
        if (_.isEqual(pt, row)) {
          pt.amount = newAmount;
        }
        return pt;
      })
    }, this.updateLocalStorage)
  }

  editRowName = (row, newName) => {
    this.setState((prevState) => {
      return prevState.rows.map(pt => {
        if (_.isEqual(pt, row)) {
          pt.name = newName;
        }
        return pt;
      })
    }, this.updateLocalStorage)
  }

  editAccount = (row, newAccount) => {
    this.setState((prevState) => {
      return prevState.rows.map(pt => {
        if (_.isEqual(pt, row)) {
          pt.account = newAccount;
        }
        return pt;
      })
    }, this.updateLocalStorage)
  }

  editStartingBalance = (account, newStartingBalance) => {
    this.setState((prevState) => {
      return prevState.accounts.map(pa => {
        if (_.isEqual(pa, account)) {
          pa.startingBalance = newStartingBalance;
          pa.asOfDate = Utils.formatDate(new Date())
        }
        return pa;
      })
    }, this.updateLocalStorage)
  }

  increaseDesiredMonths = (increaseBy) => {
    this.setState({
      desiredMonths: this.state.desiredMonths + increaseBy
    }, this._generateTransactionsFromScopeAndPutInScope)
  }

  render() {
    return (<Dashboard
        accounts={this.state.accounts}
        rows={this.state.rows}
        removedTransactions={this.state.removedTransactions}
        addRow={this.addRow}
        deleteRow={this.deleteRow}
        generatedTransactions={this.state.generatedTransactions}
        exportJson={this.exportJson}
        importJson={this.importJson}
        addRemovedTransaction={this.addRemovedTransaction}
        editDate={this.editDate}
        editRowDate={this.editRowDate}
        editRowAmount={this.editRowAmount}
        editRowName={this.editRowName}
        editAmount={this.editAmount}
        editStartingBalance={this.editStartingBalance}
        increaseDesiredMonths={this.increaseDesiredMonths}
        editAccount={this.editAccount}
        mergeRow={this.mergeRow}
    />)
  }
}

export default App;
