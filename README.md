# Demonstration of Proof-of-Possession at the Application Layer

This implementation is made with the sole purpose of better understanding how DPoP would work alongside JWT access tokens, in an application. I intentionally avoided to use HTTP servers to keep things simple.

References:
- https://auth0.com/blog/identity-unlocked-explained-episode-1/
- https://curity.io/resources/learn/dpop-overview/
- https://darutk.medium.com/illustrated-dpop-oauth-access-token-security-enhancement-801680d761ff


## Run it
- `npm install`
- `npm run start`


## Example output

_Tip: you can use [jwt.io](https://jwt.io) to inspect the JWT tokens_

**Client <-> Authorization Server**

```json
{
  "request": {
    "headers": {
      "X-Client-DPoP-Token": "eyJhbGciOiJFUzI1NiJ9.eyJ0eXAiOiJkcG9wK2p3dCIsImp0aSI6ImE3MWQ5Mjc1LTE3OTktNDVmYS1iY2UzLWYxM2UwMzgwMDc2NSIsImp3ayI6eyJrdHkiOiJFQyIsIngiOiJSRFBVWTZTd3VqTGExelRyQjhocW5lbW5ZbmZTNFotWlktajl0WGYtUHJ3IiwieSI6ImZVcFg4bGdsWkJNWVdnc2diWUVnNWREaTJuMlh0OXZPZzdKWm15WGszeVUiLCJjcnYiOiJQLTI1NiJ9LCJodHUiOiJodHRwczovL2F1dGhvcml6YXRpb24uc2VydmVyL3JlcXVlc3RfYWNjZXNzX3Rva2VuIiwiaHRtIjoiUE9TVCIsImlhdCI6MTY4Mjg1ODc4MywiZXhwIjoxNjgyODU4ODQzLCJldWEiOiJUVzk2YVd4c1lTODFMakFnS0ZkcGJtUnZkM01nVGxRZ01UQXVNRHNnVjJsdU5qUTdJSGcyTkNrZ1FYQndiR1ZYWldKTGFYUXZOVE0zTGpNMklDaExTRlJOVEN3Z2JHbHJaU0JIWldOcmJ5a2dRMmh5YjIxbEx6UXlMakF1TWpNeE1TNHhNelVnVTJGbVlYSnBMelV6Tnk0ek5pQkZaR2RsTHpFeUxqSTBOZz09In0.hGebN502TGpj5j-W7SxgNtmwi0i2U1WrsGgvewXdpsrfJMPVG_dzYpo0tCNxOAu3k2vxxUanOweLsKILbFVFAw"
    }
  },
  "response": {
    "access_token": "eyJhbGciOiJFUzI1NiJ9.eyJ0eXAiOiJkcG9wK2p3dCIsImp0aSI6IjY5ZmQwM2JmLTk1NDUtNDM5My1iYzJjLTIwZDUwMTEwZmQxOSIsImlzcyI6Imh0dHBzOi8vYXV0aG9yaXphdGlvbi5zZXJ2ZXIiLCJhdWQiOiJodHRwczovL3Jlc291cmNlLnNlcnZlciIsInN1YiI6InVzZXJfY2ZlOTNhYjYxMGVlODQwMSIsImlhdCI6MTY4Mjg1ODc4MywiZXhwIjoxNjgyODYyMzgzLCJjbmYiOnsiandrIjoiZXlKcmRIa2lPaUpGUXlJc0luZ2lPaUpTUkZCVldUWlRkM1ZxVEdFeGVsUnlRamhvY1c1bGJXNVpibVpUTkZvdFdsa3RhamwwV0dZdFVISjNJaXdpZVNJNkltWlZjRmc0Ykdkc1drSk5XVmRuYzJkaVdVVm5OV1JFYVRKdU1saDBPWFpQWnpkS1dtMTVXR3N6ZVZVaUxDSmpjbllpT2lKUUxUSTFOaUo5In0sInNjb3BlcyI6InJlYWQuYWN0aXZpdGllcyBhdWRpdC5zdGF0ZSJ9.f0o897lKiDhHKo_1vsn2mFNhcFjdx3Jt_ofwfBpWPqeaW2_k-r_ZbjunjznD-AkeNi3KCEtHaD7NSekMdBDxzQ",
    "token_type": "DPoP"
  }
}
```

**Client <-> Resource Server**

```json
{
  "request": {
    "headers": {
      "Authorization": "DPoP eyJhbGciOiJFUzI1NiJ9.eyJ0eXAiOiJkcG9wK2p3dCIsImp0aSI6IjY5ZmQwM2JmLTk1NDUtNDM5My1iYzJjLTIwZDUwMTEwZmQxOSIsImlzcyI6Imh0dHBzOi8vYXV0aG9yaXphdGlvbi5zZXJ2ZXIiLCJhdWQiOiJodHRwczovL3Jlc291cmNlLnNlcnZlciIsInN1YiI6InVzZXJfY2ZlOTNhYjYxMGVlODQwMSIsImlhdCI6MTY4Mjg1ODc4MywiZXhwIjoxNjgyODYyMzgzLCJjbmYiOnsiandrIjoiZXlKcmRIa2lPaUpGUXlJc0luZ2lPaUpTUkZCVldUWlRkM1ZxVEdFeGVsUnlRamhvY1c1bGJXNVpibVpUTkZvdFdsa3RhamwwV0dZdFVISjNJaXdpZVNJNkltWlZjRmc0Ykdkc1drSk5XVmRuYzJkaVdVVm5OV1JFYVRKdU1saDBPWFpQWnpkS1dtMTVXR3N6ZVZVaUxDSmpjbllpT2lKUUxUSTFOaUo5In0sInNjb3BlcyI6InJlYWQuYWN0aXZpdGllcyBhdWRpdC5zdGF0ZSJ9.f0o897lKiDhHKo_1vsn2mFNhcFjdx3Jt_ofwfBpWPqeaW2_k-r_ZbjunjznD-AkeNi3KCEtHaD7NSekMdBDxzQ",
      "X-Client-DPoP-Token": "eyJhbGciOiJFUzI1NiJ9.eyJ0eXAiOiJkcG9wK2p3dCIsImp0aSI6ImRlYmNlYzM2LWJiNjEtNGM0OS05N2FlLTBmZjY0MjdhN2MxZSIsImp3ayI6eyJrdHkiOiJFQyIsIngiOiJSRFBVWTZTd3VqTGExelRyQjhocW5lbW5ZbmZTNFotWlktajl0WGYtUHJ3IiwieSI6ImZVcFg4bGdsWkJNWVdnc2diWUVnNWREaTJuMlh0OXZPZzdKWm15WGszeVUiLCJjcnYiOiJQLTI1NiJ9LCJodHUiOiJodHRwczovL3Jlc291cmNlLnNlcnZlci9teV9yZXNvdXJjZSIsImh0bSI6IlBPU1QiLCJpYXQiOjE2ODI4NTg3ODMsImV4cCI6MTY4Mjg1ODg0MywiZXVhIjoiVFc5NmFXeHNZUzgxTGpBZ0tGZHBibVJ2ZDNNZ1RsUWdNVEF1TURzZ1YybHVOalE3SUhnMk5Da2dRWEJ3YkdWWFpXSkxhWFF2TlRNM0xqTTJJQ2hMU0ZSTlRDd2diR2xyWlNCSFpXTnJieWtnUTJoeWIyMWxMelF5TGpBdU1qTXhNUzR4TXpVZ1UyRm1ZWEpwTHpVek55NHpOaUJGWkdkbEx6RXlMakkwTmc9PSJ9.rE0IQ9CN5cg2Tp4tJnbV8ATpc_hoZugexn2X6y9DjT2C5El-DUFyI5Hhnjth1fguveuM7MbpfCsFPgUJgrfJSg"
    }
  },
  "response": {
    "last_login": 1682858783405,
    "activities": [
      { "activity_id": "6ce639ce-75fd-4dee-a7c2-1e6c1110129a" },
      { "activity_id": "8b5fa96c-9efd-4c5c-8aac-e674642ba6ce" }
    ],
    "last_state_update_timestamp": 1682858783405,
    "last_state_update_author": "user_8bb1156120342e28"
  }
}

```
