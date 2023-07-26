import { Injectable } from '@angular/core'; // Import the Injectable decorator from the Angular core package
import { HttpClient } from "@angular/common/http"; // Import the HttpClient module from the Angular common/http package
import { Observable, BehaviorSubject, switchMap } from "rxjs"; // Import necessary observables and operators from the RxJS library
import { Subject } from "rxjs"; // Import the Subject class from RxJS
import { Inventory } from "../../../backend/models/inventory"; // Import the Inventory model

@Injectable({
  providedIn: 'root' // Specify that the service should be provided at the root level
})
export class InventoryService {

  inventoryItems: Inventory[]; // Create an array to store inventory items
  readonly baseURL = 'http://localhost:3000/inventories'; // Set the base URL for API requests
  itemAdded: Subject<void> = new Subject<void>(); // Create a Subject to notify when an item is added
  itemUpdated: Subject<void> = new Subject<void>(); // Create a Subject to notify when an item is updated

  constructor(private http: HttpClient) {
    this.inventoryItems = []; // Initialize the inventory items array
  }


  // Define the method to post an inventory item to the server and return an Observable of any type
  postInventory(item: Inventory): Observable<any> {

    const newItem = this.formatItem(item); // Format the item before sending it to the server

    return this.http.post(this.baseURL, newItem).pipe(
      switchMap(() => { // Use switchMap to switch to a new Observable after the item is posted successfully

        this.itemAdded.next(); // Emit the event to notify that an item was added

        return this.getInventoryList(); // Return the updated inventory list by calling the getInventoryList method
      })
    );
  }

  // Define the method to format an inventory item before displaying or sending it
  formatItem(item: Inventory): Inventory {

    const formattedItem: Inventory = {
      ...item,
      description: item.description + ' g', // Append ' g' to the description
      onHand: item.onHand + ' units', // Append ' units' to the onHand value
      costPrice: '$ ' + (+item.costPrice).toFixed(2), // Format the costPrice as a currency value
      sellingPrice: '$ ' + (+item.sellingPrice).toFixed(2) // Format the sellingPrice as a currency value
    };

    return formattedItem; // Return the formatted item
  }

  stripItemFormat(item: Inventory): Inventory {
    const strippedItem: Inventory = {
      ...item,
      description: item.description.replace(' g', ''), // Remove ' g' from the description
      onHand: +item.onHand.replace(' units', ''), // Remove ' units' from the onHand value and convert to number
      costPrice: +(item.costPrice.replace('$ ', '')), // Remove '$ ' from the costPrice and convert to number
      sellingPrice: +(item.sellingPrice.replace('$ ', '')) // Remove '$ ' from the sellingPrice and convert to number
    };
    return strippedItem; // Return the stripped item
  }

  getInventoryList(): Observable<Inventory[]> {
    // Define the method to retrieve the inventory list from the server and return an Observable of type Inventory[]

    return this.http.get<Inventory[]>(this.baseURL); // Make a GET request to the baseURL and specify the expected type as Inventory[]
  }

  updateInventory(item: Inventory): Observable<any> {
    console.log('Update Item:', item); // Log the item being updated
    const updatedItem = this.formatItem(item); // Format the updated item
    const url = `${this.baseURL}/${item.id}`; // Construct the URL for the specific item using its itemId

    return this.http.put(url, updatedItem); // Make a PUT request to update the item
  }


  deleteInventory(itemId: string): Observable<any> {
    // Define the method to delete an inventory item from the server and return an Observable of any type

    const url = `${this.baseURL}/${itemId}`; // Construct the URL for the specific item using its itemId

    return this.http.delete(url); // Make a DELETE request to the URL
  }

}
