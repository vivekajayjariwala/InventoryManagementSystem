import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { Inventory } from '../../../backend/models/inventory';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  reactiveForm: FormGroup; // Form group to hold the form controls and their values
  isEditMode: boolean = false; // Flag to indicate if the form is in edit mode
  editItem: Inventory; // The item being edited

  @Output() formSubmitted: EventEmitter<Inventory> = new EventEmitter<Inventory>(); // Event emitter for form submission

  constructor(
    private dialogRef: MatDialogRef<FormComponent>, // Reference to the dialog component
    private inventoryService: InventoryService, // Service for inventory operations
    private formBuilder: FormBuilder, // FormBuilder for creating the reactive form
    @Inject(MAT_DIALOG_DATA) public data: any // Injected data from the dialog component
  ) {
    if (this.data && this.data.mode === 'edit') { // Check if the form is in edit mode
      this.isEditMode = true;
      this.editItem = { ...this.data.item }; // Create a copy of the item being edited
      this.editItem.id = this.data.item._id; // Add this line to set the id property correctly
      this.editItem = this.inventoryService.stripItemFormat(this.editItem); // Strip the added string values
    }
  }

  ngOnInit() {
    this.reactiveForm = this.formBuilder.group({
      id: [null], // Form control for the ID
      itemName: ['', [
        Validators.required, // Required field validator
        Validators.minLength(1), // Minimum length validator
        Validators.maxLength(50), // Maximum length validator
        Validators.pattern(/^[A-Za-z0-9-' ]+$/) // Regular expression pattern validator
      ]],
      upcCode: ['', [
        Validators.pattern(/^\d{13}$/) // Regular expression pattern validator for UPC code format
      ]],
      description: [''], // Form control for the description
      onHand: [null, [
        Validators.required, // Required field validator
        Validators.min(0), // Minimum value validator
        Validators.max(999999), // Maximum value validator
        Validators.pattern(/^\d+(\.\d{1,2})?$/) // Regular expression pattern validator for decimal number format
      ]],
      costPrice: [null, [
        Validators.required, // Required field validator
        Validators.min(0), // Minimum value validator
        Validators.max(999999), // Maximum value validator
        Validators.pattern(/^\d+(\.\d{1,2})?$/) // Regular expression pattern validator for decimal number format
      ]],
      sellingPrice: [null, [
        Validators.required, // Required field validator
        Validators.min(0), // Minimum value validator
        Validators.max(999999), // Maximum value validator
        Validators.pattern(/^\d+(\.\d{1,2})?$/) // Regular expression pattern validator for decimal number format
      ]]
    }, { validators: this.costPriceValidator() }); // Additional validation using a custom validator

    if (this.isEditMode) {
      this.reactiveForm.patchValue(this.editItem); // Patch the form with the values of the item being edited
    }
  }

  onSubmit() {
    if (this.reactiveForm.valid) { // Check if the form is valid
      if (this.isEditMode) {
        this.inventoryService.updateInventory(this.reactiveForm.value).subscribe((res) => {
          this.formSubmitted.emit(res); // Emit the form submission event with the updated item
          this.inventoryService.itemUpdated.next(); // Notify the inventory service that an item has been updated
          this.dialogRef.close(); // Close the dialog
        });
      } else {
        this.inventoryService.postInventory(this.reactiveForm.value).subscribe((res) => {
          this.formSubmitted.emit(res); // Emit the form submission event with the new item
          this.dialogRef.close(); // Close the dialog
        });
      }
    }
  }

  closeForm() {
    this.dialogRef.close(); // Close the dialog
  }

  costPriceValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const costPrice = group.get('costPrice')?.value; // Get the value of the cost price form control
      const sellingPrice = group.get('sellingPrice')?.value; // Get the value of the selling price form control

      if (costPrice !== null && sellingPrice !== null && costPrice > sellingPrice) {
        group.get('costPrice')?.setErrors({ costPriceHigher: true }); // Set an error if the cost price is higher than the selling price
      } else {
        group.get('costPrice')?.setErrors(null); // Clear the error if the cost price is lower or equal to the selling price
      }

      return null;
    };
  }
}
