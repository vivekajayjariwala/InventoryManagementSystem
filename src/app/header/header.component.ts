import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormComponent } from "../form/form.component";
import { InventoryService } from "../services/inventory.service";
import { Inventory } from '../../../backend/models/inventory'; // Update the path based on the actual location of the 'Inventory' type

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private dialog: MatDialog, private inventoryService: InventoryService) {} // Injecting the MatDialog service and the InventoryService

  openForm() {
    const dialogConfig = new MatDialogConfig(); // Creating a configuration object for the dialog
    dialogConfig.autoFocus = true; // Setting autoFocus to true to focus the first form field
    const dialogRef = this.dialog.open(FormComponent, dialogConfig); // Opening the dialog and storing the reference to it

    dialogRef.afterClosed().subscribe((result: Inventory) => { // Subscribing to the dialog's afterClosed event
      if (result) { // Checking if a result is available (form submitted)
        this.inventoryService.postInventory(result).subscribe(() => {
          this.inventoryService.itemAdded.next(); // Emitting the event to notify that an item has been added
        });
      }
    });
  }
}
