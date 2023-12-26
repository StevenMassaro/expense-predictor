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
  let sum = props.accounts.map(a => a.startingBalance).reduce((prev, next) => prev + next);
  return (
    <React.Fragment>
      <Title>Upcoming Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Account</TableCell>
              {props.accounts.map(a => {
                  return <>
                      <TableCell key={a.name}>{a.name}</TableCell>
                      <TableCell align="right" key={a.name+"_startingbalance"}>${a.startingBalance}</TableCell>
                  </>
              })}
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.buildTransactions().map((row) => {
            sum += row.amount;
            return (
                <TableRow key={row.date + row.name + "_transaction"}>
                  <TableCell key={"date"}>{new Date(Date.parse(row.date)).toDateString()}</TableCell>
                  <TableCell key={"name"}>{row.name}</TableCell>
                  <TableCell key={"account"}>{row.account}</TableCell>
                    {props.accounts.map(a => {
                        if (a.name === row.account) {
                            a.runningBalance += row.amount;
                        }
                        let balance = (a.startingBalance + a.runningBalance).toFixed(2);
                        // todo improve the reliability of matching the account here
                        if (a.name === row.account) {
                            return <>
                                <TableCell align="right" key={a.name + "_amount"}>{row.amount.toFixed(2)}</TableCell>
                                <TableCell align="right" key={a.name + "_balance"}>{balance}</TableCell>
                            </>
                        } else {
                            return <>
                                <TableCell align="right" key={a.name + "_amount"}>0.00</TableCell>
                                <TableCell align="right" key={a.name + "_balance"}>{balance}</TableCell>
                            </>
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
