import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {NgForm} from '@angular/forms';
import {
  Http,
  URLSearchParams,
  RequestOptions,
  Request,
  RequestMethod,
  Headers
} from "@angular/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import {ToasterService, ToasterConfig} from 'angular2-toaster';
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'surveyApp';
  public radioGroupForm: FormGroup;
  authToken: string;
  config: ToasterConfig = 
    new ToasterConfig({positionClass: 'toast-bottom-center'});

  constructor(private http: Http,
              private formBuilder: FormBuilder,
              private toasterService: ToasterService,
              private router: Router) {}
  
  ngOnInit() {
    // this.getauthtoken().subscribe((response:any) => {
    //   console.log("response", response);
    // });
    this.radioGroupForm = this.formBuilder.group({
      'question1': 'no',
      'question2': 'yes',
      'question3': 'yes',
    });
    

   
  }

  onSubmit(formData) {       
   this.submitFeeback(formData).subscribe((response:any) => {
  });
  }

  submitFeeback(formData){
    return  this.post('url', formData).pipe(map(res=>{
      if(true){
        this.toasterService.pop('success', 'Feedback Sent', 'Your Feedback has been successfully sent');       
        console.log("formData", formData)        
        this.radioGroupForm.reset();
      }
      else {
        //  this.toasterService.pop('warning', 'Feedback Failed', 'Your Feedback has not been submitted');
        this.radioGroupForm.reset();
      }
    }     
    ))
  }

  getauthtoken(){

    return this.get("https://clientworksdevint.lpl.com/clientmanagementrest/api/box/getusertoken?username=vigilius.booke").pipe(map(res=>{
      console.log("res", res);
      if(res && res.status === "success"){
         this.authToken = res.data.userToken;
        
      }
      else {
        //Feedback failed
        this.radioGroupForm.reset();
      }
    }))
  }
  
  post(
    url: string,
    formData?: any,
    withCredentials = true,
    additionalHeaders = {},
    jsonOutput = false
  ): Observable<any> {
    let tempHeaders = {
      "Content-type": "application/json"
    };    
    let headers = new Headers(tempHeaders);
    let options = new RequestOptions({
      headers: headers,
      withCredentials: withCredentials
    });
    let body = JSON.stringify(formData);
    if (!jsonOutput) {
      return this.http
        .post(url, body, options)
        .pipe(map(response => response.json()));
    } else {
      return this.http.post(url, body, options).pipe(map(response => response));
    }
  }

  get(
    url: string,
    formData?: any,
    withCredentials = true,
    additionalHeaders = {},
    jsonOutput = false
  ): Observable<any> {
    let tempHeaders = {
      "Content-type": "application/json"
    };    
    let headers = new Headers(tempHeaders);
    let options = new RequestOptions({
      headers: headers,
      withCredentials: true
    });
    let body = JSON.stringify(formData);
    if (!jsonOutput) {
      return this.http
        .get(url, options)
        .pipe(map(response => response.json()));
    } else {
      return this.http.get(url, options).pipe(map(response => response));
    }
  }

  addScriptFiletoPage(urltoLoad, callBack = function(a = false) {}) {
    let node = document.createElement("script");
    node.src = urltoLoad;
    node.type = "text/javascript";
    node.onload = function() {
      callBack(true);
    };
    node.async = true;
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
  }
}
