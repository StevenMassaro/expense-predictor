import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import _ from "lodash";

function preventDefault(event) {
  event.preventDefault();
}

export default function DashboardContents(props) {
    // todo sum should be calculated elsewhere
  let sum = props.accounts.map(a => a.startingBalance).reduce((prev, next) => prev + next, 0);
  let runningBalances = new Map()
  props.accounts.forEach(a => {
    runningBalances.set(a.name, 0)
  })
  const showAccountColumn = false;

  function getKey(row, a, uniqueString) {
    return row.date + row.name + row.id + (a == null ? "" : a.name) + uniqueString;
  }

  return (
    <React.Fragment>
      <Title>Upcoming Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            {showAccountColumn && <TableCell>Account</TableCell>}
              {props.accounts.map(a => {
                  return <React.Fragment key={a.name + "_frag"}>
                      <TableCell key={a.name} title={"Starting balance updated " + a.asOfDate}>{a.name}</TableCell>
                      <TableCell align="right" key={a.name+"_startingbalance"} title={"Starting balance updated " + a.asOfDate} contentEditable={true} suppressContentEditableWarning={true} onBlur={e => {
                          const newStartingBalance = Number(e.currentTarget.innerText.replace(",", "").replace("$", ""));
                          props.editStartingBalance(a, newStartingBalance)
                      }}>${a.startingBalance}</TableCell>
                  </React.Fragment>
              })}
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.generatedTransactions && props.generatedTransactions.map((row) => {
            sum += row.amount;
            return (
                <TableRow key={getKey(row, null, "_transaction")}>
                  <TableCell key={"remove"}><input type="checkbox" id="complete-transaction" onClick={x => {
                      props.addRemovedTransaction(row)
                  }}/></TableCell>
                  <TableCell key={getKey(row, null, "date")} contentEditable={row.type !== "recurring"} suppressContentEditableWarning={true} onBlur={e => {
                      const newDate = e.currentTarget.innerText;
                      props.editDate(row, newDate)
                  }}>{row.date}</TableCell>
                  <TableCell key={getKey(row, null, "name")}>{row.name}</TableCell>
                  {showAccountColumn && <TableCell key={"account"}>{row.account}</TableCell>}
                    {props.accounts.map(a => {
                        if (a.name === row.account) {
                          runningBalances.set(a.name, runningBalances.get(a.name) + row.amount)
                        }
                        let balance = (a.startingBalance + runningBalances.get(a.name)).toFixed(2);
                        // todo improve the reliability of matching the account here
                        if (a.name === row.account) {
                            return <React.Fragment key={getKey(row, a, "_frag")}>
                                <TableCell align="right" key={row.date + row.name +a.name + "_amount"} contentEditable={true} suppressContentEditableWarning={true} onBlur={e => {
                                    const newAmount = Number(e.currentTarget.innerText.replace(",", "").replace("$", ""))
                                    props.editAmount(row, newAmount, row.type === "recurring")
                                }}>{!_.isNull(row.amount) && row.amount.toFixed(2)}</TableCell>
                                <TableCell align="right" key={row.date + row.name +a.name + "_balance"} style={{color: balance <= 0 ? "red" : "black"}}>{balance}</TableCell>
                            </React.Fragment>
                        } else {
                            return <React.Fragment key={getKey(row, a, "_frag")}>
                                <TableCell align="right" key={row.date + row.name +a.name + "_amount"}>0.00</TableCell>
                                <TableCell align="right" key={row.date + row.name +a.name + "_balance"}>{balance}</TableCell>
                            </React.Fragment>
                        }
                    })}
                  <TableCell align="right" key={getKey(row, null, "sum")}>{`$${sum.toFixed(2)}`}</TableCell>
                </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={() => props.increaseDesiredMonths(12)} sx={{ mt: 3 }}>
        Predict one more year
      </Link>
    </React.Fragment>
  );
}
