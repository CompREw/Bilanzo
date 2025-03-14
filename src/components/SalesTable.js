"use client";






import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function SalesTable({ sales, deleteSale, categories }) {
  return (
    <div className="relative z-[1] overflow-auto sales-table-container">

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount (INR)</TableHead>
          <TableHead>Original Currency</TableHead>
          <TableHead>Category</TableHead> {/* New Category Column */}
          <TableHead>Type</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sales.map((sale) => {
          // Find the category for the current sale
          const category = categories.find((cat) => cat.id === sale.category);

          return (
            <TableRow key={sale.id}>
              <TableCell>{sale.date}</TableCell>
              <TableCell>{sale.description}</TableCell>
              <TableCell className="font-semibold text-green-600 dark:text-green-400">
                {/* Format the sale amount in INR */}
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sale.amount)}
              </TableCell>

              <TableCell>
                {/* Format the original amount based on currency */}
                {sale.originalCurrency === "USD"
                  ? `USD ${sale.originalAmount}`
                  : `INR ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sale.originalAmount)}`}
              </TableCell>

              <TableCell>
                {/* Show category, or 'No category' if it doesn't exist */}
                {category ? (
                  <span
                    style={{
                      backgroundColor: category.color,
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {category.name}
                  </span>
                ) : (
                  <span>No category</span>
                )}
              </TableCell>

              <TableCell>{sale.type}</TableCell>

              <TableCell>
                {/* Delete button */}
                <Button variant="destructive" onClick={() => deleteSale(sale.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}
