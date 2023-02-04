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
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.buildTransactions().map((row) => {
            sum += row.amount;
            return (
                <TableRow key={row.id}>
                  <TableCell>{new Date(Date.parse(row.date)).toDateString()}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.account}</TableCell>
                  <TableCell>{`$${row.amount}`}</TableCell>
                  <TableCell align="right">{`$${sum.toFixed(2)}`}</TableCell>
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
