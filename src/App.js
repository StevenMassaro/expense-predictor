import logo from './logo.svg';
import './App.css';
import Dashboard from "./Dashboard";
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recurring: [
        this.recurringTransaction(
            0,
            "monthly",
            1,
            "Mortgage",
            "Joint savings",
            ***REMOVED***
        ),
        this.recurringTransaction(
            0,
            "monthly",
            1,
            "Salary",
            "Joint savings",
            ***REMOVED***
        ),
        this.recurringTransaction(
            0,
            "monthly",
            15,
            "Salary",
            "Joint savings",
            ***REMOVED***
        )
      ],
      rows: [
        this.transaction(
            0,
            new Date(2023, 1, 5),
            'Structural engineer',
            'Personal checking',
            ***REMOVED***,
        ),
        this.transaction(
            1,
            new Date(2023, 1, 13),
            'Close on house',
            'Joint savings',
            ***REMOVED***,
        ),
      ],
      accounts: [
        this.account(
            "Joint savings",
            ***REMOVED***,
            new Date(2023, 1, 2)
        ),
        this.account(
            "Personal checking",
            ***REMOVED***,
            new Date(2023, 1, 2)
        )
      ]
    }
  }

  transaction(id, date, name, account, amount, type = "individual") {
    let dateString = date.toISOString()
    return { id, date: dateString, name, account, amount, type };
  }

  recurringTransaction(id, schedule, scheduleDay, name, account, amount) {
    return { id, schedule, scheduleDay, name, account, amount };
  }

  account(name, startingBalance, asOfDate) {
    let asOfDateString = asOfDate.toString()
    return { name, startingBalance, asOfDate: asOfDateString, runningBalance: 0 };
  }

  buildTransactions = () => {
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

    transactions.sort((t1, t2) => {
      // todo - parsing dates here is probably an inefficient way of doing this comparison
      return Date.parse(t1.date) - Date.parse(t2.date)
    })

    this.state.accounts.forEach(a => {
      a.runningBalance = 0;
    })

    return transactions;
  };

  _addRecurringTransaction(transactions, year, i, recur, monthCount) {
    transactions.push(this.transaction(
        0,
        new Date(year, i, recur.scheduleDay),
        recur.name,
        recur.account,
        recur.amount,
        "recurring"
    ))
    monthCount++;
    return monthCount;
  }

  exportJson = () => {
    let data = {
      rows: this.state.rows,
      accounts: this.state.accounts,
      recurring: this.state.recurring
    }
    const dataStr = JSON.stringify(data)
    console.log(dataStr)

    // todo - improve this file download logic

    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'export.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  importJson = () => {
    const input = document.createElement('input');
    input.type = 'file';

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
        const parsed = JSON.parse(content)
        console.log(parsed)
        this.setState({
          accounts: parsed.accounts,
          rows: parsed.rows,
          recurring: parsed.recurring
        })
      }

    }

    input.click();
  }


  render() {
    return (<Dashboard
        accounts={this.state.accounts}
        buildTransactions={this.buildTransactions}
        exportJson={this.exportJson}
        importJson={this.importJson}
    />)
  }
}

export default App;
