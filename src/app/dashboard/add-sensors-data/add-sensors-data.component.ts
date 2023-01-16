import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-add-sensors-data',
  templateUrl: './add-sensors-data.component.html',
  styleUrls: ['./add-sensors-data.component.scss']
})
export class AddSensorsDataComponent implements OnInit {

  constructor(public storeService: StoreService, private formBuilder: UntypedFormBuilder, public backendService: BackendService, public snackBar: MatSnackBar, public router: Router) { }
  public sensorenDataForm: any;
  public showAddTask: boolean = false;
  loading = false;

  ngOnInit(): void {
    this.sensorenDataForm = this.formBuilder.group({
      sensorId: [0, [ Validators.required ] ],
      temperature: ['', [ Validators.required ] ],
      humidity: ['', [ Validators.required ] ],
      date:  [null, [ Validators.required ] ]
    })
  }

  async onSubmit() {
    if(this.sensorenDataForm?.valid) {
      await this.backendService.addSensorsData(this.sensorenDataForm.value);
      this.sensorenDataForm.reset();
      this.snackBar.open("✅ Added measurement");
      this.reload(true);
    } else {
      this.snackBar.open("⚠️ Please fill in all mandatory fields (marked with *)");
    }
  }

  reload(self:boolean,urlToNavigateTo ?:string){
   const url=self ? this.router.url :urlToNavigateTo;
   this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
     this.router.navigate([`/${url}`])
   })
 }

  toggleAddTask() {
    this.showAddTask = !this.showAddTask;
  }

}
