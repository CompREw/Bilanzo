"use client";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function SalesTable({ sales, deleteSale }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount (INR)</TableHead>
          <TableHead>Original Currency</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{sale.date}</TableCell>
            <TableCell>{sale.description}</TableCell>
            <TableCell className="font-semibold text-green-600 dark:text-green-400">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sale.amount)}
            </TableCell>
            <TableCell>
              {sale.originalCurrency === "USD"
                ? `USD ${sale.originalAmount}`
                : `INR ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sale.originalAmount)}`}
            </TableCell>
            <TableCell>{sale.type}</TableCell>
            <TableCell>
              <Button variant="destructive" onClick={() => deleteSale(sale.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
