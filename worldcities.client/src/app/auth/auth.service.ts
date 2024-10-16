import { HttpClient } from "@angular/common/http";
import { Inject } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { LoginRequest } from "./login-request";
import { LoginResult } from "./login-result";
import { environment } from "../../environments/environment.development";

@Inject({
  providedIn: 'root'
})

export class AuthService {
  constructor(protected http: HttpClient) {
  }
  private tokenKey: string = "token";

  private _authStatus = new BehaviorSubject<boolean>(false);
  public authStatus = this._authStatus.asObservable()
  isAuthenticated(): boolean {
    return this.getToken() != null;
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }
  init(): void {
    if (this.isAuthenticated()) {
      this.setAuthStatus(true)
    }
  }
  logout() {
    localStorage.removeItem(this.tokenKey)
    this.setAuthStatus(false)
  }
  private setAuthStatus(isAuthenticated: boolean): void {
    this._authStatus.next(isAuthenticated)
  }

  login(item: LoginRequest): Observable<LoginResult> {
    var url = environment.baseUrl + "api/Account/Login"
    return this.http.post<LoginResult>(url, item).pipe(tap(loginResult => {
      if (loginResult.success && loginResult.token) {
        localStorage.setItem(this.tokenKey, loginResult.token)
        this.setAuthStatus(true)
      }
    }))
  }
}
