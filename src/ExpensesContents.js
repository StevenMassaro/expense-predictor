import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Transaction from "./model/Transaction";
import {DeleteOutline} from "@mui/icons-material";
import _ from "lodash";
import {MenuItem, Select} from "@mui/material";
import {Utils} from "./Utils"

function preventDefault(event) {
  event.preventDefault();
}

export default function ExpensesContents(props) {
  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Account</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.sort((t1, t2) => {
            // todo - parsing dates here is probably an inefficient way of doing this comparison
            return Date.parse(t1.date) - Date.parse(t2.date)
          }).map((row) => {
            return (
              <TableRow key={row.date + row.name + row.id + "_transaction"}>
                <TableCell key={row.date + row.name + row.id + "delete"} onClick={() => props.deleteRow(row)}><DeleteOutline fontSize={"small"}/></TableCell>
                <TableCell key={"date"} contentEditable={true} suppressContentEditableWarning={true} onBlur={e => {
                  const newDate = e.currentTarget.innerText;
                  props.editRowDate(row, newDate)
                }}>{row.date}</TableCell>
                <TableCell key={"name"} contentEditable={true} suppressContentEditableWarning={true} onBlur={e => {
                  const newName = e.currentTarget.innerText;
                  props.editRowName(row, newName)
                }}>{row.name}</TableCell>
                <TableCell key={"account"}>
                  <Select
                      labelId="account"
                      id="account-select"
                      value={row.account}
                      label="Account"
                      onChange={e => props.editAccount(row, e.target.value)}
                  >
                    {props.accounts.map(a => <MenuItem value={a.name}>{a.name}</MenuItem>)}
                  </Select>
                </TableCell>
                <TableCell align="right" key={row.date + row.name + "_amount"} contentEditable={true} suppressContentEditableWarning={true} onBlur={e => {
                  const newAmount = Number(e.currentTarget.innerText.replace(",", "").replace("$", ""))
                  props.editRowAmount(row, newAmount)
                }}>{`$${!_.isNull(row.amount) && row.amount.toFixed(2)}`}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
        {props.showAddNewExpenseButton && <Link color="primary" href="#" onClick={() => props.addRow(new Transaction(crypto.randomUUID(), Utils.formatDate(new Date()), "new", props.accounts[0].name, 0))} sx={{ mt: 3 }}>
            Add new expense
        </Link>}
    </React.Fragment>
  );
}
