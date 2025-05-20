
export default function UndoableCheckboxCell({tx} ) {

    function markPaid(id: number) {
        console.log("paid " + id);
        // send api call
        // refresh list
    }

    return (
        <td className="p-3 text-center">
            <input type="checkbox" id="paid-checkbox" onClick={() => markPaid(tx.id)}/>
        </td>
    )
}