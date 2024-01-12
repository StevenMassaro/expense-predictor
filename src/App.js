import logo from './logo.svg';
import './App.css';
import Dashboard from "./Dashboard";
import React, { Component } from 'react';
import Transaction from "./model/Transaction";
import document from "react";
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

      ]
    }
  }

  recurringTransaction(id, schedule, scheduleDay, name, account, amount) {
    return { id, schedule, scheduleDay, name, account, amount };
  }

  account(name, startingBalance, asOfDate) {
    let asOfDateString = asOfDate.toString()
    return { name, startingBalance, asOfDate: asOfDateString, runningBalance: 0 };
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
    let desiredFutureMonths = 12;

    this.state.recurring.forEach(recur => {
      if (recur.schedule === "monthly") {
        let monthCount = 1;
        const month = today.getMonth();
        for (let i = month; i < 12; i++) {
          monthCount = this._addRecurringTransaction(transactions, today.getFullYear(), i, recur, monthCount);
        }
        if (monthCount < desiredFutureMonths) {
          let nextYear = today.getFullYear() + 1;
          for (let i = 0; i <= desiredFutureMonths - monthCount; i++) {
            this._addRecurringTransaction(transactions, nextYear, i, recur, monthCount);
          }
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

    this.state.accounts.forEach(a => {
      a.runningBalance = 0;
    })
    this.setState({generatedTransactions: transactions})
  }

  _addRecurringTransaction(transactions, year, i, recur, monthCount) {
    const todayDate = new Date().getDate();
    if (recur.scheduleDay < todayDate && monthCount ===1) {
      console.log("should skip bc of already happened this month")
    } else {
      transactions.push(new Transaction(
          0,
          new Date(year, i, recur.scheduleDay).toLocaleDateString('en-CA'),
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
    const dataStr = this.jsonifyState();

    // todo - improve this file download logic

    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'export.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  jsonifyState() {
    let data = {
      rows: this.state.rows,
      accounts: this.state.accounts,
      recurring: this.state.recurring,
      removedTransactions: this.state.removedTransactions
    }

    data.accounts.forEach(a => {
      delete a.runningBalance;
    });

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
      rows: parsed.rows,
      recurring: parsed.recurring,
      removedTransactions: parsed.removedTransactions || []
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
    this.setState((prevState) => {
      let transactions = isRecurring ? prevState.recurring : prevState.rows;
      return transactions.map(pt => {
        // Because we use transaction objects for recurringTransactions in buildTransactions, we need to omit some
        // properties from the objects before doing the equality comparison (we're comparing transaction to
        // recurringTransaction objects which are slightly different)
        if (_.isEqual(
            _.omit(pt, ['schedule', 'scheduleDay']),
            isRecurring ? _.omit(transaction, ['date', 'type']) : transaction)) {
          pt.amount = newAmount;
        }
        return pt;
      })
    }, this.updateLocalStorage)
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

  editStartingBalance = (account, newStartingBalance) => {
    this.setState((prevState) => {
      return prevState.accounts.map(pa => {
        if (_.isEqual(pa, account)) {
          pa.startingBalance = newStartingBalance;
          pa.asOfDate = new Date().toLocaleDateString('en-CA')
        }
        return pa;
      })
    }, this.updateLocalStorage)
  }

  render() {
    return (<Dashboard
        accounts={this.state.accounts}
        rows={this.state.rows}
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
    />)
  }
}

export default App;
