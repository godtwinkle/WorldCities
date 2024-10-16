import { HttpClient } from "@angular/common/http";
import { Inject } from "@angular/core";
import { Observable, tap } from "rxjs";
import { LoginRequest } from "./login-request";
import { LoginResult } from "./login-result";
import { environment } from "../../environments/environment.development";

@Inject({
  providedIn: 'root'
})

export class AuthService {
  constructor(protected http: HttpClient) {
  }
  public tokenKey: string = "token";
  isAuthenticated(): boolean {
    return this.getToken() != null;
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }
  login(item: LoginRequest): Observable<LoginResult> {
    var url = environment.baseUrl + "api/Account/Login"
    return this.http.post<LoginResult>(url, item).pipe(tap(loginResult => {
      if (loginResult.success && loginResult.token) {
        localStorage.setItem(this.tokenKey, loginResult.token)
      }
    }))
  }
}
