import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders(props) {
    // todo sum should be calculated elsewhere
  let sum = props.accounts.map(a => a.startingBalance).reduce((prev, next) => prev + next, 0);
  return (
    <React.Fragment>
      <Title>Upcoming Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Account</TableCell>
              {props.accounts.map(a => {
                  return <React.Fragment key={a.name + "_frag"}>
                      <TableCell key={a.name}>{a.name}</TableCell>
                      <TableCell align="right" key={a.name+"_startingbalance"}>${a.startingBalance}</TableCell>
                  </React.Fragment>
              })}
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.buildTransactions().map((row) => {
            sum += row.amount;
            return (
                <TableRow key={row.date + row.name + "_transaction"}>
                  <TableCell key={"remove"}><input type="checkbox" id="complete-transaction" onClick={x => {
                      props.addRemovedTransaction(row)
                  }}/></TableCell>
                  <TableCell key={"date"}>{
                      row.type === "recurring" ?
                          new Date(Date.parse(row.date)).toDateString() :
                          <input type="date" id="start" value={row.date} onChange={e => {
                              const newDate = e.target.value;
                              props.editDate(row, newDate)
                          }}/>}
                  </TableCell>
                  <TableCell key={"name"}>{row.name}</TableCell>
                  <TableCell key={"account"}>{row.account}</TableCell>
                    {props.accounts.map(a => {
                        if (a.name === row.account) {
                            a.runningBalance += row.amount;
                        }
                        let balance = (a.startingBalance + a.runningBalance).toFixed(2);
                        // todo improve the reliability of matching the account here
                        if (a.name === row.account) {
                            return <React.Fragment key={row.date + row.name + a.name + "_frag"}>
                                <TableCell align="right" key={row.date + row.name +a.name + "_amount"} contentEditable={true} onBlur={e => {
                                    const newAmount = Number(e.currentTarget.textContent)
                                    props.editAmount(row, newAmount, row.type === "recurring")
                                }}>{row.amount.toFixed(2)}</TableCell>
                                <TableCell align="right" key={row.date + row.name +a.name + "_balance"}>{balance}</TableCell>
                            </React.Fragment>
                        } else {
                            return <React.Fragment key={row.date + row.name + a.name + "_frag"}>
                                <TableCell align="right" key={row.date + row.name +a.name + "_amount"}>0.00</TableCell>
                                <TableCell align="right" key={row.date + row.name +a.name + "_balance"}>{balance}</TableCell>
                            </React.Fragment>
                        }
                    })}
                  <TableCell align="right" key={"sum"}>{`$${sum.toFixed(2)}`}</TableCell>
                </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
