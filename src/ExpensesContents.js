import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Transaction from "./model/Transaction";

function preventDefault(event) {
  event.preventDefault();
}

export default function ExpensesContents(props) {
  return (
    <React.Fragment>
      <Title>Single Expenses</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Account</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => {
            return (
              <TableRow key={row.date + row.name + "_transaction"}>
                <TableCell key={"date"} contentEditable={true} suppressContentEditableWarning={true} onBlur={e => {
                  const newDate = e.currentTarget.textContent;
                  props.editRowDate(row, newDate)
                }}>{row.date}</TableCell>
                <TableCell key={"name"}>{row.name}</TableCell>
                <TableCell key={"account"}>{row.account}</TableCell>
                <TableCell align="right" key={"amount"}>{`$${row.amount.toFixed(2)}`}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={() => props.addRow(new Transaction(crypto.randomUUID(), new Date().toLocaleDateString('en-CA'), "new", props.accounts[0].name, 0))} sx={{ mt: 3 }}>
        Add new expense
      </Link>
    </React.Fragment>
  );
}
