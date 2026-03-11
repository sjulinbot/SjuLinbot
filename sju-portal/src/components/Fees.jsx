import React from 'react';
import './Fees.css';

const Fees = ({ data }) => {
    const feeData = data || [];

    const feesList = feeData.map(fee => ({ ...fee, balanceFee: 0 }));

    const totals = feesList.reduce((acc, curr) => {
        return {
            totalFee: acc.totalFee + curr.totalFee,
            remittedFee: acc.remittedFee + curr.remittedFee,
            pendingFine: acc.pendingFine + curr.pendingFine,
            fineRemitted: acc.fineRemitted + curr.fineRemitted,
            balanceFee: 0
        };
    }, { totalFee: 0, remittedFee: 0, pendingFine: 0, fineRemitted: 0, balanceFee: 0 });

    return (
        <div className="fees-container">


            {/* Header */}
            <div className="fees-header">
                <h2>PAY FEE</h2>
                <div className="wallet-amount">
                    Total Wallet Amount: <span>0</span>
                </div>
            </div>

            {/* Table */}
            <div className="fees-table-container">
                <table className="fees-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>SEMESTER</th>
                            <th>TOTAL FEE</th>
                            <th>REMITTED FEE</th>
                            <th>PENDING FINE</th>
                            <th>FINE REMITTED</th>
                            <th>BALANCE FEE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feesList.map((fee, index) => (
                            <tr key={fee.id}>
                                <td>{index + 1}</td>
                                <td className="semester-cell">{fee.semester}<span className="red-asterisk">*</span></td>
                                <td>{fee.totalFee.toFixed(2)}</td>
                                <td>{fee.remittedFee.toFixed(2)}</td>
                                <td>{fee.pendingFine.toFixed(2)}</td>
                                <td>{fee.fineRemitted.toFixed(2)}</td>
                                <td>{fee.balanceFee.toFixed(2)}</td>
                                <td>
                                    <button className="pay-btn">{fee.action}</button>
                                </td>
                            </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="total-row">
                            <td>Total</td>
                            <td>-</td>
                            <td>{totals.totalFee.toFixed(2)}</td>
                            <td>{totals.remittedFee.toFixed(2)}</td>
                            <td>{totals.pendingFine.toFixed(2)}</td>
                            <td>{totals.fineRemitted.toFixed(2)}</td>
                            <td>{totals.balanceFee.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Fees;
