import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from '../services/inventory.service';
import { Inventory } from '../../../backend/models/inventory';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  displayedColumns = ['id', 'itemName', 'upcCode', 'description', 'onHand', 'costPrice', 'sellingPrice', 'buttons']; // Define the columns to be displayed in the table

  dataSource!: MatTableDataSource<Inventory>; // Create a data source for the table using MatTableDataSource

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Access MatPaginator using ViewChild decorator
  @ViewChild(MatSort) sort!: MatSort; // Access MatSort using ViewChild decorator
  private unsubscribe$ = new Subject<void>(); // Create a Subject to unsubscribe from observables

  constructor(private inventoryService: InventoryService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Inventory>([]); // Initialize the data source for the table
  }

  ngOnInit() {
    this.refreshInventoryList(); // Refresh the inventory list

    this.inventoryService.itemAdded.subscribe(() => {
      this.refreshInventoryList(); // Refresh the inventory list when an item is added
    });

    this.inventoryService.itemUpdated.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.refreshInventoryList(); // Refresh the inventory list when an item is updated
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(); // Unsubscribe from observables
    this.unsubscribe$.complete();
  }

  refreshInventoryList() {
    this.inventoryService.getInventoryList().subscribe((res: Inventory[]) => {
      this.dataSource.data = res.map((item, index) => ({
        ...item,
        id: index.toString()
      })); // Fetch the inventory list and assign it to the data source for the table
      this.dataSource.paginator = this.paginator; // Assign the paginator to the data source
      this.dataSource.sort = this.sort; // Assign the sort to the data source
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value; // Get the filter value from user input
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Apply filtering to the data source

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Go to the first page of the paginator
    }
  }

  onEdit(row: any) {
    const dialogRef = this.dialog.open(FormComponent, {
      data: { mode: 'edit', item: row },
      width: '500px',
    }); // Open the dialog for editing an item

    dialogRef.afterClosed().subscribe((result: Inventory) => {
      if (result) {
        this.inventoryService.updateInventory(result).subscribe(() => {
          const index = this.dataSource.data.findIndex((item) => item.id === result.id); // Find the index of the edited item in the data source
          if (index !== -1) {
            this.dataSource.data[index] = result; // Update the item in the data source
            this.dataSource._updateChangeSubscription(); // Trigger table re-render
          }
        });
      }
    });
  }

  onDelete(row: any) {
    this.inventoryService.deleteInventory(row._id).subscribe(() => {
      const index = this.dataSource.data.findIndex((item) => item._id === row._id); // Find the index of the deleted item in the data source
      if (index !== -1) {
        this.dataSource.data.splice(index, 1); // Remove the item from the data source
        this.dataSource._updateChangeSubscription(); // Trigger table re-render
      }
    });
  }
}
