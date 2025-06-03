export interface SingleTransaction {
    id: number;
    name: string;
    amount: number;
    date: string;
    paid: boolean;
    createdAt: string; // ISO date string
    /**
     * This field should be used for transmitting data to the server, and it should contain the ID of the account.
     */
    account: string;
    /**
     * This field contains the name of the account when retrieving a list of transactions from
     */
    accountName: string;
}
