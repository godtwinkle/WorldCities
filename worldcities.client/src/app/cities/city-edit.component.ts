import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { City } from './city';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Country } from '../countries/country';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrl: './city-edit.component.scss'
})
export class CityEditComponent implements OnInit {
  title?: string;
  form!: FormGroup;
  city?: City;
  id?: number;
  countries?: Country[];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lon: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required)
    },null,this.isDupeCity());
    this.loadData()
  }
  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;
      var url = environment.baseUrl + 'api/Cities/IsDupeCity';

      return this.http.post<boolean>(url, city).pipe(map(result=> {
        return(result?{ isDupeCity:true }: null);
      }))
    }
  }

  loadData() {
    this.loadCountries()
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    var id = idParam ? +idParam : 0;
    if (this.id) {
      var url = environment.baseUrl + 'api/Cities' + this.id;
      this.http.get<City>(url).subscribe({
        next: (result) => {
          this.city = result;
          this.title = "Chỉnh sửa - " + this.city.name;
          this.form.patchValue(this.city);
        }, error: (error) => console.error(error)
      });
    } else {
      this.title = "Tạo mới thành phố"
    }
    
  }
  loadCountries() {
    var url = environment.baseUrl + 'api/Countries'
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "name");
    this.http.get<any>(url, { params }).subscribe({
      next: (result) => {
        this.countries = result.data;
      }, error: (error) => console.error(error)
    })
    }
  onSubmit() {
    var city = (this.id) ? this.city : <City>{};
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;
      if (this.id) {
        var url = environment.baseUrl + 'api/Cities' + city.id;
        this.http.put<City>(url, city).subscribe({
          next: (result) => {
            console.log("Thành phố với id là " + city!.id + " đã được cập nhật");
            this.router.navigate(['/cities']);
          }, error: (error) => console.error(error)
        });
      } else {
        var url = environment.baseUrl + 'api/Cities';
        this.http.post<City>(url, city).subscribe({
          next: (result) => {
            console.log("Thành phố với id là " + result.id + " đã được tạo mới");
            this.router.navigate(['/cities']);
          }, error: (error) => console.error(error)
        });
      }
    }
  }
}
