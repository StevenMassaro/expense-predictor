export default class Transaction {
  constructor(id, date, name, account, amount, type = "individual") {
    this.id = id;
    this.date = date;
    this.name = name;
    this.account = account;
    this.amount = amount;
    this.type = type;
  }
};
