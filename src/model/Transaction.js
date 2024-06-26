export default class Transaction {
  id;
  date;
  name;
  account;
  amount;
  type;

  constructor(id, date, name, account, amount, type = "individual") {
    this.id = id;
    this.date = date;
    this.name = name;
    this.account = account;
    this.amount = amount;
    this.type = type;
  }

  /**
   * Find the associated account object with this transaction.
   * @param accounts all of the accounts in the system
   * @returns {*} the account, if found, null otherwise
   */
  findMatchingAccountObject(accounts) {
    // todo improve the reliability of matching the account here
    return accounts.find(a => a.name === this.account)
  }
};
